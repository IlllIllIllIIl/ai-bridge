export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  const body = req.method === "POST" ? req.body : req.query;
  const message = body?.message || "";
  const systemPrompt = body?.system || "You are a helpful assistant embedded in a Roblox exploit script called Hyperion. Answer questions concisely and helpfully.";
  const history = Array.isArray(body?.messages) ? body.messages : [];

  const BASE = "https://hermes.ai.unturf.com";

  const modelsRes = await fetch(BASE + "/v1/models").catch(() => null);
  let model = "gpt-3.5-turbo";
  if (modelsRes && modelsRes.ok) {
    const modelsData = await modelsRes.json().catch(() => null);
    const first = modelsData?.data?.[0]?.id;
    if (first) model = first;
  }

  const messages = [
    { role: "system", content: systemPrompt },
    ...history.slice(-18),
    { role: "user", content: message }
  ];

  const response = await fetch(BASE + "/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model, messages, temperature: 0.7, max_tokens: 500 })
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => "unknown");
    return res.status(200).json({ reply: "[Error " + response.status + "] " + errText.slice(0, 200) });
  }

  const data = await response.json();
  let reply = data.choices?.[0]?.message?.content || "[No response]";
  reply = reply.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
  return res.status(200).json({ reply });
}
