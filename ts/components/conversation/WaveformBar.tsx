
import React, { useMemo } from 'react';


interface WaveformBarsProps {
  peaks: ReadonlyArray<number>;
  progress: number; // 0 to 1
  barWidth?: number;
  gap?: number;
  minPeakHeight?: number;
  progressColor?: string;
  waveColor?: string;
  isDragging?: boolean;
  onMouseDown:(e: React.MouseEvent<HTMLDivElement>)=>void;
// onClick:any;
onMouseMove:(e: React.MouseEvent<HTMLDivElement>)=>void;
onMouseUp:(e: React.MouseEvent<HTMLDivElement>)=>void;
onMouseLeave:(e: React.MouseEvent<HTMLDivElement>)=>void;

}

const WaveformBars: React.FC<WaveformBarsProps> = ({
  peaks,
  progress,
  barWidth = 2,
  gap = 2,
  minPeakHeight = 0.09,
  progressColor = '#2F8FFF',
  waveColor = '#16191F',
  isDragging = false,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseLeave,
}) => {
  const totalBars = useMemo(() => Math.floor(300 / (barWidth + gap)), [barWidth, gap]);
  const step = useMemo(() => Math.max(1, Math.floor(peaks.length / totalBars)), [peaks, totalBars]);

  const bars = useMemo(() => {
    return Array.from({ length: totalBars }, (_, i) => {
      const peak = peaks[i * step] || 0;
      const validPeak = Math.max(peak, minPeakHeight);
      return {
        height: validPeak,
      };
    });
  }, [peaks, step, totalBars, minPeakHeight]);

  const progressBars = Math.floor(bars.length * progress);
  const preventCursorDisable =
    progressBars >= totalBars - 1
      ? progressBars - 1.2
      : progressBars <= 0
      ? 1.2
      : progressBars + 1.2;
  const cursorX = preventCursorDisable * (barWidth + gap);

  return (
    <div className="waveform-container"  onMouseDown={onMouseDown}
    onMouseMove={onMouseMove}
    onMouseUp={onMouseUp}
    onMouseLeave={onMouseLeave}>
      {bars.map((bar, index) => {
        const isHighlighted =progressBars > 0 &&  index <= progressBars;
        return (
          <div
            key={index}
            className="waveform-bar"
            style={{
              height: `${bar.height * 100}%`,
              backgroundColor: isHighlighted ? progressColor : waveColor,
              width: `${barWidth}px`,
              marginRight: `${gap}px`,
            }}
          />
        );
      })}
      <div
        className="waveform-cursor"
        style={{
          left: `${cursorX}px`,
          transform: 'translateX(-50%)',
          width: isDragging ? 16 : 10,
          height: isDragging ? 16 : 10,
          marginTop:isDragging?'-8px':'-5px'
        }}
      />
    </div>
  );
};

export default WaveformBars;
