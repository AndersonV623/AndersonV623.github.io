export default async function handler(req, res) {
  const { seccion, sessionId } = req.body;
  const pais = req.headers['x-vercel-ip-country'] || 'Desconocido';
  const ciudad = req.headers['x-vercel-ip-city'] || 'Desconocido';
  const region = req.headers['x-vercel-ip-country-region'] || '';
  const userAgent = req.headers['user-agent'];

  try {
    const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/visitas_web`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.SUPABASE_KEY,
        'Authorization': `Bearer ${process.env.SUPABASE_KEY}`
      },
      body: JSON.stringify({
        seccion: seccion,
        navegador: userAgent,
        pais: `${pais} - ${decodeURIComponent(ciudad)} - ${region}`,
        session_id: sessionId
      }),
    });

    return res.status(200).json({ status: "Tracked" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}