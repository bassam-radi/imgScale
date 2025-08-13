module.exports = async function (req, res) {
  // Temporary log to check environment variable
  console.log("HF_API_KEY:", process.env.HF_API_KEY);

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { imageUrl } = req.body;
  if (!imageUrl) return res.status(400).json({ error: "No image provided" });

  try {
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

    // Check if Hugging Face returned an error
    if (!response.ok) {
      const text = await response.text(); // get raw response
      console.error("Hugging Face API error:", text);
      return res.status(response.status).json({ error: text });
    }

    const data = await response.json();
    console.log("Hugging Face API response:", data);

    res.status(200).json(data);

  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Error calling Hugging Face API" });
  }
};
