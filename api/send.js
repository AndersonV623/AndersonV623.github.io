export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const GOOGLE_URL = process.env.URL_SHEETS;

  try {
    const response = await fetch(GOOGLE_URL, {
      method: 'POST',
      body: JSON.stringify(req.body),
    });

    return res.status(200).json({ message: 'Datos enviados a Google' });
  } catch (error) {
    return res.status(500).json({ error: 'Error al conectar con Google' });
  }
}