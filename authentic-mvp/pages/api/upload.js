export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { filename, contentType, dataBase64 } = req.body || {};
    if (!filename || !contentType || !dataBase64) {
      return res.status(400).json({ error: "Missing file payload" });
    }

    const secret = process.env.THIRDWEB_SECRET_KEY;
    if (!secret) {
      return res.status(500).json({ error: "Missing THIRDWEB_SECRET_KEY" });
    }

    // Decode base64 to a Uint8Array for Blob
    const buffer = Buffer.from(dataBase64, "base64");
    const blob = new Blob([buffer], { type: contentType });

    const form = new FormData();
    form.append("file", blob, filename);

    const upstream = await fetch("https://upload.thirdweb.com", {
      method: "POST",
      body: form,
      headers: {
        "x-secret-key": secret,
      },
    });

    let json = null;
    try {
      json = await upstream.json();
    } catch (_) {}

    if (!upstream.ok) {
      return res
        .status(upstream.status || 500)
        .json({ error: json?.error || json?.message || "Upload failed" });
    }

    const uri =
      json?.result?.uris?.[0] || json?.result?.uri || json?.uris?.[0] || json?.uri || null;
    if (!uri) return res.status(500).json({ error: "No URI in response" });

    return res.status(200).json({ uri, raw: json });
  } catch (err) {
    console.error("Upload proxy error:", err);
    return res.status(500).json({ error: err.message });
  }
}

