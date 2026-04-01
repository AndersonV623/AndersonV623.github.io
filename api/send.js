export default async function handler(req, res) {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_KEY;

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return res.status(500).json({ error: "Faltan las variables de Supabase en Vercel" });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    // Enviamos los datos directamente a la API de Supabase desde el servidor
    const response = await fetch(`${SUPABASE_URL}/rest/v1/Encuestas_SIMCH-S`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error en Supabase");
    }

    return res.status(200).json({ status: "Enviado a Supabase correctamente" });
  } catch (error) {
    return res.status(500).json({ error: "Error de conexión", detalles: error.message });
  }
}