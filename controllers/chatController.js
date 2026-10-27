exports.chatWithBot = async (req, res) => {
  try {
    const { mensajeUsuario } = req.body;
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ success: false, error: 'GROQ_API_KEY no configurada.' });
    }

    const promptSistema = `
Eres el asistente virtual elegante, exclusivo y profesional de AXMY Barber Shop. Tu única función es brindar soporte, informar sobre los servicios y guiar a los clientes sobre cómo agendar.

Nuestros Servicios Oficiales:
1. El Degradado Ejecutivo (Fade) - $25 (⏱️ 20 min) - Un degradado clásico, limpio y profesional.
2. El Ritual de Toalla Caliente y Barba - $45 (⏱️ 25 min) - Tradicional ritual con toalla caliente y perfilado completo.
3. Pompadour Moderno - $25 (⏱️ 20 min) - Estilo clásico con volumen y acabado impecable.
4. El Paquete Signature AXMY (Corte y Barba) - $45 (⏱️ 30 min) - La combinación perfecta de corte y barba signature.

Instrucciones para las respuestas:
- Sé amable, sofisticado y usa un tono de alta barbería.
- Si el usuario pregunta por precios, cortes o duración, respóndele detalladamente basándote en la lista anterior.
- Si el usuario quiere agendar o reservar, indícale amablemente que puede hacer clic en el botón **"RESERVAR"** que se encuentra en la parte superior o directamente en la tarjeta del servicio que prefiera de nuestro catálogo web.
- Mantén respuestas concisas y directas.
`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b',
        messages: [
          { role: 'system', content: promptSistema },
          { role: 'user', content: mensajeUsuario }
        ],
        temperature: 0.5
      })
    });

    const data = await response.json();
    const textoRespuesta = data.choices[0]?.message?.content || '¡Hola! Bienvenido a AXMY Barber Shop. ¿En qué puedo ayudarte hoy?';

    res.json({
      success: true,
      respuesta: textoRespuesta
    });

  } catch (error) {
    console.error('Error en el controlador:', error);
    res.status(500).json({ success: false, error: 'Error procesando tu mensaje.' });
  }
};