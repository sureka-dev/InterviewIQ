import React, { useEffect, useRef, useState } from 'react';

interface AudioVisualizerProps {
  stream: MediaStream | null;
  isActive: boolean;
  barCount?: number;
  className?: string;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  stream,
  isActive,
  barCount = 18,
  className = ''
}) => {
  const [audioLevels, setAudioLevels] = useState<number[]>(Array(barCount).fill(10));
  const animationFrameRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    if (!stream || !isActive) {
      setAudioLevels(Array(barCount).fill(8));
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      const audioCtx = new AudioCtx();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.8;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      audioContextRef.current = audioCtx;
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const renderFrame = () => {
        analyser.getByteFrequencyData(dataArray);

        // Sample frequencies across bins
        const step = Math.max(1, Math.floor(dataArray.length / barCount));
        const levels: number[] = [];

        for (let i = 0; i < barCount; i++) {
          const val = dataArray[i * step] || 0;
          // Normalize to percentage between 10% and 95%
          const pct = Math.max(10, Math.min(95, Math.round((val / 255) * 100)));
          levels.push(pct);
        }

        setAudioLevels(levels);
        animationFrameRef.current = requestAnimationFrame(renderFrame);
      };

      renderFrame();
    } catch (err) {
      console.warn('AudioVisualizer setup error:', err);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, [stream, isActive, barCount]);

  return (
    <div className={`flex items-end justify-center gap-1 h-8 ${className}`}>
      {audioLevels.map((lvl, idx) => (
        <div
          key={idx}
          className="w-1.5 rounded-full transition-all duration-75"
          style={{
            height: `${lvl}%`,
            backgroundColor: !isActive
              ? '#D6D0C5'
              : lvl > 60
              ? '#E65A3C'
              : lvl > 25
              ? '#1B4332'
              : '#94A3B8'
          }}
        />
      ))}
    </div>
  );
};
