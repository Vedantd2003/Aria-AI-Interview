import Vapi from '@vapi-ai/web';

let vapiInstance: Vapi | null = null;

export function getVapi(): Vapi {
  if (!vapiInstance) {
    const key = import.meta.env.VITE_VAPI_PUBLIC_KEY;
    if (!key) throw new Error('VITE_VAPI_PUBLIC_KEY is not set');
    vapiInstance = new Vapi(key);
  }
  return vapiInstance;
}
