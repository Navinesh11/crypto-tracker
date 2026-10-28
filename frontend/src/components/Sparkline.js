/**
 * Sparkline — Tiny inline SVG price chart for table rows
 */

import React from 'react';

function Sparkline({ data, positive, width = 120, height = 40 }) {
  if (!data || data.length < 2) return null;

  // Downsample to 30 points for performance
  const step = Math.ceil(data.length / 30);
  const sampled = data.filter((_, i) => i % step === 0);

  const min = Math.min(...sampled);
  const max = Math.max(...sampled);
  const range = max - min || 1;

  const points = sampled.map((val, i) => {
    const x = (i / (sampled.length - 1)) * width;
    const y = height - ((val - min) / range) * (height - 4) - 2;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  const color = positive ? '#00ff88' : '#ff3366';

  return (
    <svg width={width} height={height} className="sparkline">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.85"
      />
    </svg>
  );
}

export default Sparkline;
