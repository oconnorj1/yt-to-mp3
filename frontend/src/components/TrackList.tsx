import { useState, useRef, useCallback } from 'react';

interface TrackFile {
  filename: string;
}

interface TrackListProps {
  files: TrackFile[];
  jobId: string;
  startIndex: number;
  onRetry: () => void;
}

const API_BASE = '/api';

function TrackList({ files, jobId, startIndex, onRetry }: TrackListProps) {
  const [downloadingIndex, setDownloadingIndex] = useState<number | null>(null);
  const [downloadingAll, setDownloadingAll] = useState(false);
  const [downloadedCount, setDownloadedCount] = useState(0);
  const abortRef = useRef(false);

  const triggerDownload = useCallback((backendIndex: number, filename: string) => {
    const link = document.createElement('a');
    link.href = `${API_BASE}/jobs/${jobId}/files/${backendIndex}`;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [jobId]);

  const handleDownload = (backendIndex: number) => {
    const idx = backendIndex - startIndex;
    setDownloadingIndex(backendIndex);
    triggerDownload(backendIndex, files[idx].filename);
    setTimeout(() => setDownloadingIndex(null), 1000);
  };

  const handleDownloadAll = async () => {
    abortRef.current = false;
    setDownloadingAll(true);
    setDownloadedCount(0);

    for (let i = 0; i < files.length; i++) {
      if (abortRef.current) break;
      const backendIndex = startIndex + i;
      triggerDownload(backendIndex, files[i].filename);
      setDownloadedCount(i + 1);
      await new Promise(r => setTimeout(r, 800));
    }

    setDownloadingAll(false);
  };

  const displayName = (filename: string) => {
    return filename.replace(/\.mp3$/i, '').replace(/^\d+\s*-\s*/, '');
  };

  return (
    <div className="track-list">
      <h3 className="track-list-title">Tracks ({files.length})</h3>
      <div className="track-list-actions">
        <button
          className="track-download-all-btn"
          onClick={handleDownloadAll}
          disabled={downloadingAll}
        >
          {downloadingAll ? `Downloading... (${downloadedCount}/${files.length})` : 'Download All'}
        </button>
      </div>
      <ul className="track-list-items">
        {files.map((file, index) => {
          const backendIndex = startIndex + index;
          return (
            <li key={backendIndex} className="track-list-item">
              <span className="track-name">{displayName(file.filename)}</span>
              <button
                className="track-download-btn"
                onClick={() => handleDownload(backendIndex)}
                disabled={downloadingIndex === backendIndex || downloadingAll}
              >
                {downloadingIndex === backendIndex ? '...' : 'Download'}
              </button>
            </li>
          );
        })}
      </ul>
      <button className="retry-btn" onClick={onRetry}>
        Convert Another
      </button>
    </div>
  );
}

export default TrackList;
