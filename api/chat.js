export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  const body = req.method === "POST" ? req.body : req.query;
  const message = body?.message || "";
  const systemPrompt = body?.system || "You are a helpful assistant. Be concise and friendly.";
  const history = Array.isArray(body?.messages) ? body.messages : [];

  const messages = [
    { role: "system", content: systemPrompt },
    ...history.slice(-18),
    { role: "user", content: message }
  ];

  const response = await fetch("https://hermes.ai.unturf.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "Hermes", messages, temperature: 0.7, max_tokens: 300 })
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => "unknown");
    return res.status(200).json({ reply: "[Error " + response.status + "] " + errText.slice(0, 200) });
  }

  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content || "[No response]";
  return res.status(200).json({ reply });
}
