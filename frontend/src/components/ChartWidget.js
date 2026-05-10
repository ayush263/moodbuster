import React, { useRef, useEffect, useState } from 'react';

function ChartWidget({ data = [3,5,6,4,7,8,6,7,9,8] }) {
  const svgRef = useRef(null);
  const [hover, setHover] = useState(null);

  const points = data.map((v, i) => ({ x: (i/(data.length-1))*100, y: 100 - (v/10)*100, v }));
  const d = points.map((p, i) => `${i===0? 'M':'L'} ${p.x} ${p.y}`).join(' ');

  useEffect(() => {
    const path = svgRef.current.querySelector('path');
    const len = path.getTotalLength();
    path.style.strokeDasharray = len;
    path.style.strokeDashoffset = len;
    path.getBoundingClientRect();
    path.style.transition = 'stroke-dashoffset 1.8s ease-out';
    path.style.strokeDashoffset = '0';
  }, []);

  return (
    <div className="chart-widget">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" ref={svgRef}>
        <defs>
          <linearGradient id="g1" x1="0" x2="1">
            <stop offset="0%" stopColor="#aef0ff" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#66c7ff" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <path d={d} fill="none" stroke="#66c7ff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d={`${d} L 100 100 L 0 100 Z`} fill="url(#g1)" opacity="0.12" stroke="none" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={1.3} fill="#e6fbff" onMouseEnter={() => setHover({i, p})} onMouseLeave={() => setHover(null)} />
        ))}
      </svg>

      {hover && (
        <div className="chart-tooltip" style={{ left: `${hover.p.x}%` }}>
          <div className="tt-value">{hover.p.v}/10</div>
        </div>
      )}
    </div>
  );
}

export default ChartWidget;
