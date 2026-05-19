import Vapi from '@vapi-ai/web';

let vapiInstance: Vapi | null = null;

export function getVapi(): Vapi {
  if (!vapiInstance) {
    const key = import.meta.env.VITE_VAPI_PUBLIC_KEY;
    if (!key) throw new Error('VITE_VAPI_PUBLIC_KEY is not set');

    // Route all Vapi REST API calls through our server proxy.
    // Our server forwards to api.vapi.ai using the private key, which
    // has no "allowed origins" restriction. Daily.co WebRTC (the actual
    // voice stream) still connects directly from the browser to daily.co.
    const apiBaseUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/vapi-proxy`;

    vapiInstance = new Vapi(key, apiBaseUrl);
  }
  return vapiInstance;
}
