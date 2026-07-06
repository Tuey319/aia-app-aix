// 🔌 Real network call — Groq's OpenAI-compatible Chat Completions API.
// Every user message goes through here; the model decides both the
// conversational reply and, when relevant, which single screen to suggest
// navigating to next — so an informational question (e.g. "what payment
// methods are there?") gets a real explanatory answer *and* a helpful
// next-step button, instead of just a bare navigation card.

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

export type ScreenId =
  | 'PaySelect'
  | 'ClaimStart'
  | 'CoverageDetail'
  | 'Policy'
  | 'Vitality'
  | 'ContactAgent'
  | 'FaqList'
  | 'History'
  | 'ChangeFreq';

// Kept in sync with SCREEN_TABS in AssistantScreen.tsx, which knows how to
// route each of these ids to its owning tab/stack.
const SCREEN_CATALOG: { id: ScreenId; desc: string }[] = [
  { id: 'PaySelect', desc: 'Pay premium / make a payment (shows available payment methods: card, QR/PromptPay, bank transfer)' },
  { id: 'ClaimStart', desc: 'File or start an insurance claim' },
  { id: 'CoverageDetail', desc: "View the user's policy coverage details" },
  { id: 'Policy', desc: "View the user's policy document / summary" },
  { id: 'Vitality', desc: 'Check AIA Vitality status, points, and discounts' },
  { id: 'ContactAgent', desc: 'Contact a human insurance agent' },
  { id: 'FaqList', desc: 'Browse frequently asked questions' },
  { id: 'History', desc: 'View payment history' },
  { id: 'ChangeFreq', desc: 'Change premium payment frequency/period (e.g. switch between monthly, quarterly, or annual payments)' },
];

const VALID_SCREENS = new Set<string>(SCREEN_CATALOG.map((s) => s.id));

// Scope guard: keeps the assistant answering only AIA+/insurance topics and
// refusing everything else, regardless of how the user phrases the request.
const SYSTEM_PROMPT = `You are the AI Assistant built into the AIA+ insurance app.

You may only help with topics related to AIA+ and insurance in general:
- policy coverage and terms, premiums and payments, filing or tracking claims
- AIA Vitality benefits and rewards
- using the AIA+ app (account, FAQ, contacting an agent)
- general insurance concepts (e.g. what a deductible or rider is)

If the user asks about anything outside these topics — general knowledge, other
companies or products, coding help, personal/medical/legal/financial advice
unrelated to their insurance, jokes, or any other unrelated request — do NOT
answer it, even if the user insists, rephrases, or claims it's hypothetical or
for research. Instead, reply with one short, polite sentence declining and
inviting them to ask about their policy, coverage, claims, or the app instead,
and set "screen" to null in that case.

Always reply in the same language as the user's most recent message (Thai or
English). Keep the reply short — 1 to 4 sentences — since it renders in a
mobile chat bubble. Actually answer the question first (e.g. list payment
methods, explain a term); don't just point at a screen without explaining.

Available screens you may suggest as a single helpful next step:
${SCREEN_CATALOG.map((s) => `- ${s.id}: ${s.desc}`).join('\n')}

Only set "screen" when navigating there would genuinely help the user act on
your answer, and only ever suggest exactly one. Set it to null for purely
conversational replies, clarifying questions, or refusals.

Respond with ONLY a raw JSON object (no markdown fences, no extra text)
matching exactly this shape:
{"reply": string, "screen": string|null, "ctaLabel": string|null}
"ctaLabel" is a short button label in the same language as "reply" (e.g. "Go to Payment Page" / "ไปที่หน้าชำระเงิน"), required when "screen" is set, otherwise null.`;

export type ChatTurn = { role: 'user' | 'assistant'; content: string };
export type AssistantReply = { reply: string; screen: ScreenId | null; ctaLabel: string | null };

export async function fetchAssistantReply(history: ChatTurn[]): Promise<AssistantReply> {
  const apiKey = process.env.EXPO_PUBLIC_GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('Missing EXPO_PUBLIC_GROQ_API_KEY');
  }

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...history],
      temperature: 0.4,
      max_tokens: 300,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    throw new Error(`Groq API error: ${response.status}`);
  }

  const data = await response.json();
  const raw: string | undefined = data?.choices?.[0]?.message?.content;
  if (!raw) {
    throw new Error('Empty response from Groq API');
  }

  let parsed: any;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('Malformed JSON from Groq API');
  }

  const reply = typeof parsed.reply === 'string' ? parsed.reply.trim() : '';
  if (!reply) {
    throw new Error('Missing reply text from Groq API');
  }

  // Defensive: never trust the model's screen id blindly, since a hallucinated
  // or malformed value would otherwise reach navigation.navigate() untouched.
  const screen: ScreenId | null =
    typeof parsed.screen === 'string' && VALID_SCREENS.has(parsed.screen) ? (parsed.screen as ScreenId) : null;
  const ctaLabel = screen && typeof parsed.ctaLabel === 'string' && parsed.ctaLabel.trim() ? parsed.ctaLabel.trim() : null;

  return { reply, screen, ctaLabel };
}
