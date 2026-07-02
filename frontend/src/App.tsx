import { useState, useEffect, useRef } from 'react';
import UrlInput from './components/UrlInput';
import ProgressBar from './components/ProgressBar';

const API_BASE = '/api';

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [jobStatus, setJobStatus] = useState<'idle' | 'pending' | 'downloading' | 'completed' | 'failed'>('idle');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') {
      setTheme(saved);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    return () => {
      eventSourceRef.current?.close();
    };
  }, []);

  const handleSubmit = async (url: string) => {
    setLoading(true);
    setError(null);
    setProgress(0);
    setJobStatus('pending');

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const res = await fetch(`${API_BASE}/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to create job');
      }

      const { id } = await res.json();
      setJobStatus('downloading');

      const es = new EventSource(`${API_BASE}/jobs/${id}/progress`);
      eventSourceRef.current = es;

      es.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === 'progress') {
          setProgress(data.progress);
        } else if (data.type === 'completed') {
          setProgress(100);
          setJobStatus('completed');
          es.close();
          eventSourceRef.current = null;

          const a = document.createElement('a');
          a.href = `${API_BASE}/jobs/${id}/file`;
          a.download = data.filename || 'audio.mp3';
          a.click();
        } else if (data.type === 'failed') {
          setJobStatus('failed');
          setError(data.error || 'Download failed');
          es.close();
          eventSourceRef.current = null;
        }
      };

      es.onerror = () => {
        setJobStatus('failed');
        setError('Connection lost. Please try again.');
        es.close();
        eventSourceRef.current = null;
      };
    } catch (err) {
      setJobStatus('failed');
      if (err instanceof Error && err.name === 'AbortError') {
        setError('Request timed out. The server may be busy. Please try again.');
      } else {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setJobStatus('idle');
    setError(null);
    setProgress(0);
  };

  return (
    <div className="app-container">
      <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
        {theme === 'light' ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        )}
      </button>
      <div className="card">
        <img src="/yt2mp3logo.png" alt="yt-to-mp3" className="logo" />
        <p className="subtitle">
          Paste a YouTube URL and download the audio as MP3
        </p>
        <UrlInput onDownload={handleSubmit} loading={loading} />
        {(jobStatus === 'pending' || jobStatus === 'downloading' || jobStatus === 'completed') && (
          <ProgressBar progress={progress} status={jobStatus} />
        )}
        {error && (
          <div className="error-block">
            <p className="error-message">{error}</p>
            {jobStatus === 'failed' && (
              <button className="retry-btn" onClick={handleRetry}>
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
