/**
 * Cloudflare Pages Function: /api/gemini
 * Acts as a secure serverless proxy for Google Gemini API.
 * The GEMINI_API_KEY is stored in Cloudflare Environment Variables (context.env.GEMINI_API_KEY).
 */

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const apiKey = env.GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : undefined);

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: "GEMINI_API_KEY no está configurada en las variables de entorno de Cloudflare Pages."
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const body = await request.json();
    const { contents, systemInstruction, imageBase64, mimeType } = body;

    // Build Gemini REST payload (using Gemini 2.5 / 3.8 Flash REST endpoint)
    // Works with Google Generative Language REST v1beta
    const model = "gemini-2.5-flash"; // or gemini-2.0-flash / gemini-1.5-flash fallback in REST
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const parts = [];
    if (imageBase64) {
      parts.push({
        inline_data: {
          mime_type: mimeType || "image/jpeg",
          data: imageBase64.replace(/^data:image\/[a-z]+;base64,/, '')
        }
      });
    }

    if (typeof contents === 'string') {
      parts.push({ text: contents });
    } else if (Array.isArray(contents)) {
      contents.forEach(item => {
        if (typeof item === 'string') parts.push({ text: item });
        else parts.push(item);
      });
    }

    const payload = {
      contents: [{ role: "user", parts }],
      system_instruction: systemInstruction ? {
        parts: [{ text: systemInstruction }]
      } : undefined,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1200
      }
    };

    const geminiRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!geminiRes.ok) {
      const errorText = await geminiRes.text();
      return new Response(
        JSON.stringify({ error: `Error desde Gemini API: ${geminiRes.status}`, details: errorText }),
        { status: geminiRes.status, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await geminiRes.json();
    const candidate = data.candidates?.[0];
    const text = candidate?.content?.parts?.map(p => p.text).join('') || "No se pudo obtener respuesta de la estilista.";

    return new Response(
      JSON.stringify({ text, raw: data }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache"
        }
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Error en el servidor de Wilma", details: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    }
  });
}
