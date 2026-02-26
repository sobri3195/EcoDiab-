export type PatientProfile = 'newly-diagnosed' | 'adherence-challenge' | 'telemedicine-ready' | 'comorbidity-care';
export type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Critical';

export type WidgetRuleContext = {
  patientProfile: PatientProfile;
  riskLevel: RiskLevel;
};

type WidgetBase = {
  id: string;
  title: string;
  description: string;
  rules: Array<Partial<WidgetRuleContext>>;
};

export type MetricWidget = WidgetBase & {
  type: 'metric';
  metricLabel: string;
  metricValue: string;
  trend?: 'up' | 'down' | 'stable';
};

export type InsightWidget = WidgetBase & {
  type: 'insight';
  bullets: string[];
};

export type ActionWidget = WidgetBase & {
  type: 'action';
  actionLabel: string;
  href: string;
};

export type DashboardWidget = MetricWidget | InsightWidget | ActionWidget;

export const widgetRegistry: DashboardWidget[] = [
  {
    id: 'critical-follow-up',
    type: 'action',
    title: 'Escalate high-risk follow-up',
    description: 'Schedule intensive follow-up cadence for unstable glycemic control.',
    actionLabel: 'Open Follow-up Planner',
    href: '/follow-up',
    rules: [{ riskLevel: 'High' }, { riskLevel: 'Critical' }],
  },
  {
    id: 'adherence-nudge',
    type: 'insight',
    title: 'Adherence intervention',
    description: 'Patients with low adherence benefit from weekly behavioral nudges.',
    bullets: ['Enable reminder call every 3 days', 'Pair meds reminder with meal schedule'],
    rules: [{ patientProfile: 'adherence-challenge' }],
  },
  {
    id: 'telemedicine-capacity',
    type: 'metric',
    title: 'Telemedicine capacity',
    description: 'Estimated consultation slots that can be moved to remote care this week.',
    metricLabel: 'Eligible visits',
    metricValue: '18 slots',
    trend: 'up',
    rules: [{ patientProfile: 'telemedicine-ready', riskLevel: 'Low' }, { patientProfile: 'telemedicine-ready', riskLevel: 'Moderate' }],
  },
  {
    id: 'newly-diagnosed-pathway',
    type: 'action',
    title: 'Onboarding pathway',
    description: 'Use structured education modules for newly diagnosed patients.',
    actionLabel: 'Open Dietary Assistant',
    href: '/dietary-assistant',
    rules: [{ patientProfile: 'newly-diagnosed' }],
  },
  {
    id: 'comorbidity-guardrail',
    type: 'insight',
    title: 'Comorbidity guardrails',
    description: 'Track nephropathy and retinopathy screening in one coordinated lane.',
    bullets: ['Bundle BP + LDL check on next visit', 'Prioritize retinal referral within 14 days'],
    rules: [{ patientProfile: 'comorbidity-care', riskLevel: 'High' }, { patientProfile: 'comorbidity-care', riskLevel: 'Critical' }],
  },
];

export function isWidgetRuleMatch(context: WidgetRuleContext, rule: Partial<WidgetRuleContext>) {
  return (Object.keys(rule) as Array<keyof WidgetRuleContext>).every((key) => {
    const expected = rule[key];
    return expected === undefined || expected === context[key];
  });
}

export function matchWidgetsByRules(registry: DashboardWidget[], context: WidgetRuleContext) {
  return registry.filter((widget) => widget.rules.some((rule) => isWidgetRuleMatch(context, rule)));
}
