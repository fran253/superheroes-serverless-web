const API_URL = 'https://8k0gqgbxze.execute-api.us-east-1.amazonaws.com/dev/contact';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form');
  const btn = document.getElementById('btn');
  const msg = document.getElementById('msg');
  if (!form) return;

  const show = (type, text) => { msg.className = type; msg.textContent = text; };

  form.addEventListener('submit', async (event) => {
    // Evitamos la recarga normal del formulario.
    event.preventDefault();

    // Leemos los valores del DOM.
    const name = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const payload = { name, email };
    console.log('Payload:', payload);

    if (name.length < 2) return show('err', 'Escribe tu nombre (mínimo 2 letras).');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return show('err', 'Revisa tu email: parece que no es válido.');
    if (API_URL.includes('API_ID') || API_URL.includes('TU_REGION')) {
      return show('err', 'Falta pegar tu endpoint real en js/api.js (API_URL).');
    }

    btn.disabled = true;
    btn.textContent = 'Enviando...';
    msg.className = '';

    try {
      // Enviamos JSON mediante POST.
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error ?? 'Error al enviar');

      show('ok', result.message ?? '¡Registro completado! Te esperamos en HeroCon.');
      form.reset();
    } catch (error) {
      console.error('Error API:', error);
      show('err', error.message || 'No hemos podido registrarte. Inténtalo de nuevo.');
    } finally {
      btn.disabled = false;
      btn.textContent = '¡Apúntame!';
    }
  });
});