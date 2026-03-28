export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages, system } = req.body || {};

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "messages required" });
  }

  const fullMessages = system
    ? [{ role: "system", content: system }, ...messages.slice(-10)]
    : messages.slice(-10);

  try {
    const response = await fetch(
      "https://ark.cn-beijing.volces.com/api/v3/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.DOUBAO_API_KEY}`
        },
        body: JSON.stringify({
          model: "doubao-1-5-lite-32k-250115",
          max_tokens: 600,
          messages: fullMessages
        })
      }
    );

    const data = await response.json();

    const text = data?.choices?.[0]?.message?.content;

    if (!text) {
      return res.status(500).json({
        error: "Invalid AI response",
        raw: data
      });
    }

    return res.status(200).json({
      text
    });

  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
}
