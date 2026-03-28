async function sendMessage() {
  const input = document.getElementById("input").value;

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [
        { role: "user", content: input }
      ]
    })
  });

  const data = await res.json();

  document.getElementById("result").textContent = data.text;
}
