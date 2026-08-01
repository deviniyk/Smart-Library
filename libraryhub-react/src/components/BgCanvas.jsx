import { useEffect, useRef } from 'react';

export default function BgCanvas() {
  const ref = useRef(null);

  useEffect(() => {
    const c = ref.current;
    const ctx = c.getContext('2d');
    let W, H, stars = [];
    let raf;

    function init() {
      W = c.width = window.innerWidth;
      H = c.height = window.innerHeight;
      stars = [];
      for (let i = 0; i < 120; i++) {
        stars.push({
          x: Math.random() * W, y: Math.random() * H,
          r: Math.random() * 1.2 + 0.2,
          o: Math.random() * 0.5 + 0.1,
          s: Math.random() * 0.3 + 0.05,
        });
      }
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      stars.forEach(s => {
        s.o += s.s * 0.01;
        if (s.o > 0.7 || s.o < 0.05) s.s *= -1;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,168,76,${s.o})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    }
    init();
    draw();
    window.addEventListener('resize', init);
    return () => {
      window.removeEventListener('resize', init);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas id="bg-canvas" ref={ref} />;
}
