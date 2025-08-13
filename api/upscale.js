const response = await fetch(
  "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-x4-upscaler",
  {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.HF_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ inputs: imageUrl })
  }
);

if (!response.ok) {
  const text = await response.text(); // get raw response
  console.error("Hugging Face error:", text);
  return res.status(response.status).json({ error: text });
}

const data = await response.json();
res.status(200).json(data);
