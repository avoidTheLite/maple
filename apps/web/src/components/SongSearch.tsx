import { useState } from 'react';
import { cn } from '../lib/utils.ts';

interface SongSearchProps {
  onGenerate: (title: string, artist: string) => void;
  loading: boolean;
  error: string | null;
}

export const SongSearch = ({ onGenerate, loading, error }: SongSearchProps): React.JSX.Element => {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (title.trim() && artist.trim()) {
      onGenerate(title.trim(), artist.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-2.5">
      <input
        className="w-48 rounded-sm border border-[#555] bg-[#333] px-2.5 py-1.5 font-serif text-[13px] text-[#ddd]"
        placeholder="Song title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={loading}
      />
      <input
        className="w-48 rounded-sm border border-[#555] bg-[#333] px-2.5 py-1.5 font-serif text-[13px] text-[#ddd]"
        placeholder="Artist"
        value={artist}
        onChange={(e) => setArtist(e.target.value)}
        disabled={loading}
      />
      <button
        type="submit"
        className={cn(
          'rounded-sm border-none px-4 py-1.5 font-serif text-[13px] tracking-widest disabled:cursor-not-allowed',
          loading && 'opacity-80',
        )}
        style={{ background: loading ? '#444' : '#8B6914', color: loading ? '#888' : '#FDF6E8' }}
        disabled={loading || !title.trim() || !artist.trim()}
      >
        {loading ? 'generating…' : 'generate sheet'}
      </button>
      {error && <span className="ml-2 font-serif text-[12px] text-[#c66]">{error}</span>}
    </form>
  );
};
