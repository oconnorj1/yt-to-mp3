interface ProgressBarProps {
  progress: number;
  status: 'pending' | 'downloading' | 'completed' | 'failed';
}

function ProgressBar({ progress, status }: ProgressBarProps) {
  if (status === 'pending') {
    return (
      <div className="progress-bar-container">
        <div className="progress-bar-track">
          <div className="progress-bar-skeleton" />
        </div>
        <span className="progress-bar-label">Starting...</span>
      </div>
    );
  }

  return (
    <div className="progress-bar-container">
      <div className="progress-bar-track">
        <div
          className="progress-bar-fill"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      <span className="progress-bar-label">{Math.round(progress)}%</span>
    </div>
  );
}

export default ProgressBar;
