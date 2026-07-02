import { useState } from 'react';

interface Props {
  onDownload: (url: string) => void;
  loading: boolean;
}

function UrlInput({ onDownload, loading }: Props) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onDownload(url.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', width: '100%', maxWidth: 500 }}>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://youtube.com/watch?v=..."
        disabled={loading}
        style={{
          flex: 1,
          padding: '0.75rem 1rem',
          fontSize: '1rem',
          border: '1px solid #ccc',
          borderRadius: 6,
          outline: 'none',
        }}
      />
      <button
        type="submit"
        disabled={loading || !url.trim()}
        style={{
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          background: loading ? '#999' : '#1a73e8',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Processing...' : 'Download'}
      </button>
    </form>
  );
}

export default UrlInput;
