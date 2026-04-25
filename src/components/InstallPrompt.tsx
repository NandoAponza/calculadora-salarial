import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!prompt) return null;

  const handleInstall = async () => {
    await prompt.prompt();
    await prompt.userChoice;
    setPrompt(null);
  };

  const handleDismiss = () => setPrompt(null);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700 rounded-xl shadow-lg px-4 py-3 text-sm">
      <span className="text-lg">📲</span>
      <span className="text-gray-700 dark:text-gray-200 font-medium">Instalar app</span>
      <button
        onClick={handleInstall}
        className="ml-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 py-1 rounded-md transition-colors"
      >
        Instalar
      </button>
      <button
        onClick={handleDismiss}
        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        aria-label="Cerrar"
      >
        ✕
      </button>
    </div>
  );
}
