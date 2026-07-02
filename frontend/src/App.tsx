import { useState } from 'react';
import UrlInput from './components/UrlInput';

const API_BASE = '/api';

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async (url: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/download`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.details || data.error || 'Download failed');
      }

      const blob = await response.blob();
      const disposition = response.headers.get('Content-Disposition');
      const match = disposition?.match(/filename="?(.+?)"?$/);
      const filename = match?.[1] || 'audio.mp3';

      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif',
      background: '#f5f5f5',
      margin: 0,
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>yt-to-mp3</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Paste a YouTube URL and download the audio as MP3
      </p>
      <UrlInput onDownload={handleDownload} loading={loading} />
      {error && (
        <p style={{
          color: '#e53e3e',
          marginTop: '1rem',
          maxWidth: 500,
          textAlign: 'center',
          fontSize: '0.875rem',
          wordBreak: 'break-word',
        }}>
          {error}
        </p>
      )}
    </div>
  );
}

export default App;
