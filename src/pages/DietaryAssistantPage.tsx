import { useState } from 'react';
import Card from '../components/Card';
import { dietaryProfiles } from '../lib/mock';

type Message = { role: 'user' | 'bot'; text: string };

const prompts = ['Menu lokal rendah gula', 'Alternatif snack', 'Belanja hemat', 'Kurangi food waste'];

const scriptedReply = (prompt: string, profile: keyof typeof dietaryProfiles) => {
  const data = dietaryProfiles[profile];
  if (prompt.includes('snack')) return `Try snack options: rebus kacang, yogurt plain, and potongan ${data.foods[4]}. Target ${data.calories} kcal/day.`;
  if (prompt.includes('Belanja')) return `Budget shopping tip: prioritize ${data.foods.slice(0, 3).join(', ')}, buy seasonal produce, and batch cook to reduce waste.`;
  if (prompt.includes('waste')) return `To reduce food waste, reuse leftovers into soup/stir-fry and plan 3-day menus around ${data.foods[0]} + veggies.`;
  return `Contoh menu lokal rendah gula: ${data.foods.join(', ')}. Sasaran energi: ${data.calories} kkal/hari.`;
};

export default function DietaryAssistantPage() {
  const [profile, setProfile] = useState<keyof typeof dietaryProfiles>('standard');
  const [messages, setMessages] = useState<Message[]>([{ role: 'bot', text: 'Hi! Choose a prompt to start dietary guidance.' }]);

  const sendPrompt = (prompt: string) => {
    const reply = scriptedReply(prompt, profile);
    setMessages((prev) => [...prev, { role: 'user', text: prompt }, { role: 'bot', text: reply }]);
  };

  return (
    <Card title="Dietary Assistant (Mock Chatbot)">
      <div className="mb-3 flex items-center gap-2 text-sm">
        <label>Patient profile:</label>
        <select value={profile} onChange={(e) => setProfile(e.target.value as keyof typeof dietaryProfiles)} className="rounded border px-2 py-1 dark:bg-slate-900">
          <option value="standard">Standard</option>
          <option value="intensive">Intensive</option>
        </select>
      </div>
      <div className="mb-3 flex flex-wrap gap-2">
        {prompts.map((prompt) => (
          <button key={prompt} onClick={() => sendPrompt(prompt)} className="rounded-full border px-3 py-1 text-sm hover:bg-slate-50 dark:hover:bg-slate-800">
            {prompt}
          </button>
        ))}
      </div>
      <div className="max-h-[420px] space-y-2 overflow-y-auto rounded-lg border p-3">
        {messages.map((message, index) => (
          <div key={`${message.role}-${index}`} className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${message.role === 'user' ? 'ml-auto bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}>
            {message.text}
          </div>
        ))}
      </div>
    </Card>
  );
}
