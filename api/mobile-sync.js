const DEFAULT_REPO = process.env.GITHUB_SYNC_REPO || 'sobri3195/EcoDiab-';
const DEFAULT_BRANCH = process.env.GITHUB_SYNC_BRANCH || 'main';
const DEFAULT_DATA_PATH = process.env.GITHUB_SYNC_DATA_PATH || 'data/mobile-inputs.json';
const ENABLE_GITHUB_ISSUES = (process.env.ENABLE_GITHUB_ISSUES || 'true') === 'true';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(res, status, payload) {
  res.status(status);
  Object.entries(corsHeaders).forEach(([key, value]) => res.setHeader(key, value));
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}

function sanitizeValue(value, depth = 0) {
  if (depth > 4) return '[truncated-depth]';
  if (value === null || value === undefined) return value;
  if (Array.isArray(value)) return value.slice(0, 20).map((item) => sanitizeValue(item, depth + 1));
  if (typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => !/thumbnail|image|capturedImage/i.test(key))
        .slice(0, 40)
        .map(([key, item]) => [key, sanitizeValue(item, depth + 1)])
    );
  }
  if (typeof value === 'string') {
    return value.length > 1200 ? `${value.slice(0, 1200)}...[truncated]` : value;
  }
  return value;
}

async function githubRequest(path, options = {}) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error('Missing GITHUB_TOKEN environment variable');
  }

  const response = await fetch(`https://api.github.com${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub API failed (${response.status}): ${text}`);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

async function upsertDataFile(entry) {
  const [owner, repo] = DEFAULT_REPO.split('/');
  let existing = [];
  let sha;

  try {
    const current = await githubRequest(`/repos/${owner}/${repo}/contents/${encodeURIComponent(DEFAULT_DATA_PATH)}?ref=${DEFAULT_BRANCH}`);
    sha = current.sha;
    existing = JSON.parse(Buffer.from(current.content, 'base64').toString('utf8'));
    if (!Array.isArray(existing)) existing = [];
  } catch (error) {
    if (!String(error.message || '').includes('404')) {
      throw error;
    }
  }

  const nextEntries = [entry, ...existing].slice(0, 5000);
  const content = Buffer.from(JSON.stringify(nextEntries, null, 2)).toString('base64');

  await githubRequest(`/repos/${owner}/${repo}/contents/${encodeURIComponent(DEFAULT_DATA_PATH)}`, {
    method: 'PUT',
    body: JSON.stringify({
      message: `Store mobile sync payload for ${entry.module}`,
      content,
      branch: DEFAULT_BRANCH,
      ...(sha ? { sha } : {}),
    }),
  });

  return nextEntries.length;
}

async function createIssue(entry) {
  if (!ENABLE_GITHUB_ISSUES) return null;

  const [owner, repo] = DEFAULT_REPO.split('/');
  const title = `[Mobile Sync] ${entry.module} - ${new Date(entry.createdAt).toISOString()}`;
  const body = [
    'Incoming data from `ecodiab-mobile`.',
    '',
    `- Source: ${entry.source}`,
    `- Module: ${entry.module}`,
    `- Created at: ${entry.createdAt}`,
    '',
    '```json',
    JSON.stringify(entry.record, null, 2),
    '```',
  ].join('\n');

  const issue = await githubRequest(`/repos/${owner}/${repo}/issues`, {
    method: 'POST',
    body: JSON.stringify({
      title,
      body,
      labels: ['mobile-sync'],
    }),
  });

  return issue?.html_url || null;
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return json(res, 200, { ok: true });
  }

  if (req.method !== 'POST') {
    return json(res, 405, { ok: false, message: 'Method not allowed' });
  }

  try {
    const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    if (!payload || !payload.module || !payload.record) {
      return json(res, 400, { ok: false, message: 'Invalid payload' });
    }

    const entry = {
      source: payload.source || 'ecodiab-mobile',
      module: payload.module,
      createdAt: payload.createdAt || new Date().toISOString(),
      receivedAt: new Date().toISOString(),
      record: sanitizeValue(payload.record),
    };

    const stored = await upsertDataFile(entry);
    const issueUrl = await createIssue(entry);

    return json(res, 200, {
      ok: true,
      mode: issueUrl ? 'json-and-issue' : 'json',
      stored,
      issueUrl,
      message: 'Mobile data synced successfully',
    });
  } catch (error) {
    return json(res, 500, {
      ok: false,
      message: error instanceof Error ? error.message : 'Unexpected sync failure',
    });
  }
}
