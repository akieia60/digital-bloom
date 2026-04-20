import { useEffect, useRef } from 'react';

function hexToRgb(hex) {
  const clean = (hex || '#D4AF37').replace('#', '');
  if (clean.length !== 6) return { r: 212, g: 175, b: 55 };
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
}

function initParticles(id, w, h, accent, primary) {
  switch (id) {
    case 'luminaraDrift':
      return Array.from({ length: 48 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 1 + Math.random() * 1.8,
        vy: -(0.25 + Math.random() * 0.45),
        vx: (Math.random() - 0.5) * 0.2,
        opacity: Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2,
      }));

    case 'bokehBloom':
      return Array.from({ length: 11 }, (_, i) => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 45 + Math.random() * 65,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        opacity: 0.05 + Math.random() * 0.09,
        phase: (i / 11) * Math.PI * 2,
        colorMix: Math.random(),
      }));

    case 'lightVeil':
      return Array.from({ length: 4 }, (_, i) => ({
        speed: 0.05 + Math.random() * 0.04,
        opacity: 0.04 + Math.random() * 0.04,
        width: 70 + Math.random() * 100,
        phase: (i / 4) * Math.PI * 2,
      }));

    case 'silkPetals': {
      const petalColors = [
        `rgba(${primary.r},${primary.g},${primary.b},0.52)`,
        `rgba(${accent.r},${accent.g},${accent.b},0.42)`,
        'rgba(242,167,188,0.48)',
        'rgba(245,230,204,0.42)',
        'rgba(220,180,200,0.46)',
      ];
      return Array.from({ length: 18 }, () => ({
        x: Math.random() * w,
        y: -20 - Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: 0.35 + Math.random() * 0.55,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.012,
        scaleX: 0.55 + Math.random() * 0.5,
        scaleY: 0.38 + Math.random() * 0.38,
        color: petalColors[Math.floor(Math.random() * petalColors.length)],
        sway: Math.random() * Math.PI * 2,
        swaySpeed: 0.008 + Math.random() * 0.01,
        swayAmp: 0.18 + Math.random() * 0.28,
      }));
    }

    case 'constellationDrift':
      return Array.from({ length: 24 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.1,
        vy: (Math.random() - 0.5) * 0.1,
        r: 1 + Math.random() * 1.2,
        opacity: 0.35 + Math.random() * 0.45,
        phase: Math.random() * Math.PI * 2,
      }));

    case 'dewShimmer':
      return Array.from({ length: 32 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        opacity: 0,
        life: 0,
        maxLife: 0,
        active: false,
        size: 3 + Math.random() * 4.5,
        nextActivation: Math.random() * 3.0,
      }));

    default:
      return [];
  }
}

function drawEffect(ctx, w, h, particles, id, accent, primary, elapsed, dt) {
  switch (id) {
    case 'luminaraDrift': {
      particles.forEach((p) => {
        p.y += p.vy;
        p.x += p.vx + Math.sin(elapsed * 0.7 + p.phase) * 0.12;

        const nearTop = p.y < h * 0.12;
        p.opacity = nearTop
          ? Math.max(0, p.opacity - 0.025)
          : Math.min(0.72 + Math.sin(elapsed * 1.4 + p.phase) * 0.18, p.opacity + 0.018);

        if (p.y < -8) {
          p.y = h + 8;
          p.x = Math.random() * w;
          p.opacity = 0;
        }

        ctx.save();
        ctx.shadowBlur = 7;
        ctx.shadowColor = `rgba(${accent.r},${accent.g},${accent.b},0.75)`;
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2.5);
        grad.addColorStop(0, `rgba(255,242,200,${p.opacity})`);
        grad.addColorStop(0.45, `rgba(${accent.r},${accent.g},${accent.b},${p.opacity * 0.7})`);
        grad.addColorStop(1, `rgba(${accent.r},${accent.g},${accent.b},0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.restore();
      });
      break;
    }

    case 'bokehBloom': {
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -p.r) p.x = w + p.r;
        if (p.x > w + p.r) p.x = -p.r;
        if (p.y < -p.r) p.y = h + p.r;
        if (p.y > h + p.r) p.y = -p.r;

        const pulsedOpacity = p.opacity * (0.65 + 0.35 * Math.sin(elapsed * 0.55 + p.phase));
        const pulsedR = p.r * (0.88 + 0.12 * Math.sin(elapsed * 0.38 + p.phase));

        const r = Math.round(primary.r + (accent.r - primary.r) * p.colorMix);
        const g = Math.round(primary.g + (accent.g - primary.g) * p.colorMix);
        const b = Math.round(primary.b + (accent.b - primary.b) * p.colorMix);

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, pulsedR);
        grad.addColorStop(0, `rgba(${r},${g},${b},${pulsedOpacity})`);
        grad.addColorStop(0.55, `rgba(${r},${g},${b},${pulsedOpacity * 0.45})`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, pulsedR, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });
      break;
    }

    case 'lightVeil': {
      particles.forEach((p) => {
        const sweep = Math.sin(elapsed * p.speed + p.phase);
        const xPos = w * 0.5 + sweep * w * 0.9;
        const pulsedOpacity = p.opacity * (0.4 + 0.6 * Math.abs(Math.sin(elapsed * 0.28 + p.phase)));

        const grad = ctx.createLinearGradient(xPos - p.width * 2.5, 0, xPos + p.width * 2.5, 0);
        grad.addColorStop(0, 'rgba(255,248,220,0)');
        grad.addColorStop(0.35, 'rgba(255,248,220,0)');
        grad.addColorStop(0.5, `rgba(255,248,220,${pulsedOpacity})`);
        grad.addColorStop(0.65, 'rgba(255,248,220,0)');
        grad.addColorStop(1, 'rgba(255,248,220,0)');

        const slant = h * 0.28;
        ctx.beginPath();
        ctx.moveTo(xPos - p.width + slant, 0);
        ctx.lineTo(xPos + p.width + slant, 0);
        ctx.lineTo(xPos + p.width - slant, h);
        ctx.lineTo(xPos - p.width - slant, h);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();
      });
      break;
    }

    case 'silkPetals': {
      particles.forEach((p) => {
        p.y += p.vy;
        p.sway += p.swaySpeed;
        p.x += p.vx + Math.sin(p.sway) * p.swayAmp;
        p.rotation += p.rotSpeed;

        if (p.y > h + 30) {
          p.y = -20;
          p.x = Math.random() * w;
          p.sway = Math.random() * Math.PI * 2;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.scale(p.scaleX, p.scaleY);
        ctx.beginPath();
        ctx.moveTo(0, -13);
        ctx.bezierCurveTo(9, -6, 9, 6, 0, 13);
        ctx.bezierCurveTo(-9, 6, -9, -6, 0, -13);
        ctx.closePath();
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.restore();
      });
      break;
    }

    case 'constellationDrift': {
      const CONNECT_DIST = 85;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        p.opacity = 0.28 + 0.42 * Math.sin(elapsed * 1.1 + p.phase);
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[j].x - particles[i].x;
          const dy = particles[j].y - particles[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) {
            const lineOpacity = (1 - dist / CONNECT_DIST) * 0.22;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${accent.r},${accent.g},${accent.b},${lineOpacity})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        ctx.save();
        ctx.shadowBlur = 5;
        ctx.shadowColor = `rgba(${accent.r},${accent.g},${accent.b},0.9)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${accent.r},${accent.g},${accent.b},${p.opacity})`;
        ctx.fill();
        ctx.restore();
      });
      break;
    }

    case 'dewShimmer': {
      particles.forEach((p) => {
        if (!p.active) {
          if (elapsed >= p.nextActivation) {
            p.active = true;
            p.life = 0;
            p.maxLife = 0.4 + Math.random() * 0.55;
            p.x = Math.random() * w;
            p.y = Math.random() * h;
            p.size = 3 + Math.random() * 4.5;
          }
        }

        if (p.active) {
          p.life += dt;
          const progress = p.life / p.maxLife;
          if (progress < 0.28) {
            p.opacity = progress / 0.28;
          } else if (progress < 0.68) {
            p.opacity = 1;
          } else {
            p.opacity = (1 - progress) / 0.32;
          }

          if (p.life >= p.maxLife) {
            p.active = false;
            p.opacity = 0;
            p.nextActivation = elapsed + 0.4 + Math.random() * 2.2;
          }

          const op = Math.max(0, p.opacity) * 0.72;
          const s = p.size;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.shadowBlur = 5;
          ctx.shadowColor = `rgba(${accent.r},${accent.g},${accent.b},${op})`;
          ctx.strokeStyle = `rgba(255,248,220,${op})`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(-s, 0); ctx.lineTo(s, 0); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(0, -s); ctx.lineTo(0, s); ctx.stroke();
          const d = s * 0.48;
          ctx.strokeStyle = `rgba(255,248,220,${op * 0.45})`;
          ctx.beginPath(); ctx.moveTo(-d, -d); ctx.lineTo(d, d); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(d, -d); ctx.lineTo(-d, d); ctx.stroke();
          ctx.restore();
        }
      });
      break;
    }

    default:
      break;
  }
}

export default function CanvasEffect({ effectId, accentColor, primaryColor }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const stateRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !effectId) return;

    const accent = hexToRgb(accentColor);
    const primary = hexToRgb(primaryColor);

    const resize = () => {
      const w = canvas.offsetWidth || 400;
      const h = canvas.offsetHeight || 400;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        stateRef.current = null;
      }
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let startTime = null;
    let lastTime = null;

    const loop = (ts) => {
      if (!startTime) startTime = ts;
      if (!lastTime) lastTime = ts;
      const elapsed = (ts - startTime) / 1000;
      const dt = Math.min((ts - lastTime) / 1000, 0.05);
      lastTime = ts;

      const ctx = canvas.getContext('2d');
      const w = canvas.width;
      const h = canvas.height;

      if (!stateRef.current && w > 0 && h > 0) {
        stateRef.current = initParticles(effectId, w, h, accent, primary);
      }

      if (stateRef.current) {
        ctx.clearRect(0, 0, w, h);
        drawEffect(ctx, w, h, stateRef.current, effectId, accent, primary, elapsed, dt);
      }

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      ro.disconnect();
      stateRef.current = null;
    };
  }, [effectId, accentColor, primaryColor]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  );
}
