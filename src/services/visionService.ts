export async function detectImageWithAI(file: File): Promise<string[]> {
  const apiKey = import.meta.env.VITE_GOOGLE_VISION_API_KEY;

  const base64 = await toBase64(file);

  const response = await fetch(
    `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requests: [
          {
            image: {
              content: base64.split(",")[1],
            },
            features: [{ type: "LABEL_DETECTION", maxResults: 10 }],
          },
        ],
      }),
    }
  );

  const data = await response.json();

  const labels =
    data.responses?.[0]?.labelAnnotations?.map(
      (label: any) => label.description.toLowerCase()
    ) || [];

  return labels;
}

function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
}