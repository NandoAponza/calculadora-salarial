import { useRegisterSW } from 'virtual:pwa-register/react';

export function UpdatePrompt() {
  const { needRefresh: [needRefresh], updateServiceWorker } = useRegisterSW();

  if (!needRefresh) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-blue-700 text-white text-sm px-4 py-3 rounded-xl shadow-lg whitespace-nowrap">
      <span>Nueva versión disponible</span>
      <button
        onClick={() => updateServiceWorker(true)}
        className="bg-white text-blue-700 font-semibold px-3 py-1 rounded-md hover:bg-blue-50 transition-colors"
      >
        Recargar
      </button>
    </div>
  );
}
