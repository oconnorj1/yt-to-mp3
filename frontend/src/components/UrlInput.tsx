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
    <form onSubmit={handleSubmit} className="url-form">
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://youtube.com/watch?v=..."
        disabled={loading}
        className="url-input"
      />
      <button
        type="submit"
        disabled={loading || !url.trim()}
        className="download-btn"
      >
        {loading ? 'Processing...' : 'Download'}
      </button>
    </form>
  );
}

export default UrlInput;
