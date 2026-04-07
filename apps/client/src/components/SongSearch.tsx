import { useState } from 'react';

interface SongSearchProps {
  onGenerate: (title: string, artist: string) => void;
  loading: boolean;
  error: string | null;
}

const SongSearch = ({ onGenerate, loading, error }: SongSearchProps) => {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && artist.trim()) {
      onGenerate(title.trim(), artist.trim());
    }
  };

  const inputStyle: React.CSSProperties = {
    fontFamily: 'Georgia, serif',
    fontSize: '13px',
    padding: '6px 10px',
    background: '#333',
    border: '1px solid #555',
    color: '#ddd',
    borderRadius: '3px',
    width: '200px',
  };

  const buttonStyle: React.CSSProperties = {
    fontFamily: 'Georgia, serif',
    fontSize: '13px',
    padding: '6px 16px',
    background: loading ? '#444' : '#8B6914',
    border: 'none',
    color: loading ? '#888' : '#FDF6E8',
    borderRadius: '3px',
    cursor: loading ? 'not-allowed' : 'pointer',
    letterSpacing: '1px',
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
      <input
        style={inputStyle}
        placeholder="Song title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        disabled={loading}
      />
      <input
        style={inputStyle}
        placeholder="Artist"
        value={artist}
        onChange={e => setArtist(e.target.value)}
        disabled={loading}
      />
      <button type="submit" style={buttonStyle} disabled={loading || !title.trim() || !artist.trim()}>
        {loading ? 'generating…' : 'generate sheet'}
      </button>
      {error && (
        <span style={{ fontFamily: 'Georgia, serif', fontSize: '12px', color: '#c66', marginLeft: '8px' }}>
          {error}
        </span>
      )}
    </form>
  );
};

export default SongSearch;
