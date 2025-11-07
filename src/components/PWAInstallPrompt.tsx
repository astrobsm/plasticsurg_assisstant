interface PWAInstallPromptProps {
  prompt: any;
  onInstall: () => void;
}

export function PWAInstallPrompt({ prompt, onInstall }: PWAInstallPromptProps) {
  const handleInstall = async () => {
    if (prompt) {
      prompt.prompt();
      const { outcome } = await prompt.userChoice;
      if (outcome === 'accepted') {
        onInstall();
      }
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">PSA</span>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-clinical-dark">
            Install Plastic Surgeon Assistant
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Add to home screen for offline access
          </p>
        </div>
      </div>
      
      <div className="mt-3 flex space-x-2">
        <button
          onClick={handleInstall}
          className="btn-primary text-xs px-3 py-1.5"
        >
          Install
        </button>
        <button
          onClick={onInstall}
          className="btn-secondary text-xs px-3 py-1.5"
        >
          Not now
        </button>
      </div>
    </div>
  );
}