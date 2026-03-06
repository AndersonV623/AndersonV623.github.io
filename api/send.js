export default async function handler(req, res) {
  const GOOGLE_URL = process.env.URL_APP_SCRIPTS;

  // Si no hay URL configurada en Vercel, detenemos todo
  if (!GOOGLE_URL) {
    return res.status(500).json({ error: "Falta la variable URL_APP_SCRIPTS en Vercel" });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const response = await fetch(GOOGLE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    return res.status(200).json({ status: "Enviado correctamente" });
  } catch (error) {
    return res.status(500).json({ error: "Error conectando con Google", detalles: error.message });
  }
}

/*
export default async function handler(req, res) {
  // 1. Sacamos la URL de la caja fuerte de Vercel
  const GOOGLE_URL = process.env.URL_SHEETS;

  if (req.method !== 'POST') return res.status(405).send('Solo POST');

  try {
    // 2. Enviamos los datos a Google
    const response = await fetch(GOOGLE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    const data = await response.text();
    return res.status(200).json({ status: 'Exito', data });
  } catch (e) {
    // Si llegamos aquí, es que la URL_SHEETS está mal o Google rechazó la conexión
    return res.status(500).json({ error: e.message });
  }
}
*/