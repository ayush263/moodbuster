import React, { useRef, useEffect } from 'react';

function ParticleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let w = canvas.width = canvas.offsetWidth;
    let h = canvas.height = canvas.offsetHeight;
    let particles = [];

    function init() {
      particles = Array.from({length: 60}).map(() => ({
        x: Math.random()*w,
        y: Math.random()*h,
        r: Math.random()*1.8 + 0.4,
        vx: (Math.random()-0.5)*0.6,
        vy: (Math.random()-0.5)*0.6,
        alpha: Math.random()*0.6 + 0.2
      }));
    }

    function resize() { w = canvas.width = canvas.offsetWidth; h = canvas.height = canvas.offsetHeight; }

    function draw() {
      ctx.clearRect(0,0,w,h);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < -10) p.x = w + 10; if (p.x > w+10) p.x = -10;
        if (p.y < -10) p.y = h + 10; if (p.y > h+10) p.y = -10;
        ctx.beginPath();
        ctx.fillStyle = `rgba(100,190,255,${p.alpha})`;
        ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }

    init(); draw();
    window.addEventListener('resize', resize);
    return () => { window.removeEventListener('resize', resize); };
  }, []);

  return <canvas className="particle-canvas" ref={canvasRef} />;
}

export default ParticleBackground;
