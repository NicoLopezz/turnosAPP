import fetch from 'node-fetch';

export const INTERVALO_PETICIONES = 5 * 1000; // 5 minutos en milisegundos

setInterval(async () => {
  try {
    // Realizar una petición GET a tu servidor en Render
    const response = await fetch('https://backend-render-bdaf.onrender.com/');
    console.log('Respuesta del servidor:', response.statusText);
  } catch (error) {
    console.error('Error al realizar la petición:', error);
  }
}, INTERVALO_PETICIONES);

export default setInterval
