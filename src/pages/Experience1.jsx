import { useEffect, useRef, useState } from 'react';
import './Experience1.css';

/**
 * Experience #1: Card → Balloons → Box → Flower Reveal
 * 
 * Animation Sequence:
 * 1. Card appears center, opens, fades to back left
 * 2. Balloons rise with box attached
 * 3. Balloons recede, box dominates
 * 4. Box opens with particle burst
 * 5. Flowers rise with falling petals
 */

const Experience1 = () => {
  const [animationPhase, setAnimationPhase] = useState('intro');
  const canvasRef = useRef(null);
  const particles = useRef([]);

  // Customization (will be props later)
  const config = {
    recipientName: "Mom",
    senderMessage: "Thank you for every sacrifice, every hug, every everything. Raising me was a gift you gave the world.",
    occasion: "Happy Mother's Day",
    balloonMessages: ["Happy Mother's Day", "I Love You", "💐"],
    colorScheme: {
      primary: "#C53A5C", // bloom blush
      secondary: "#D4AF37", // gold
      accent: "#ffffff"
    }
  };

  useEffect(() => {
    // Animation timeline
    const timeline = [
      { phase: 'card-appear', delay: 500 },
      { phase: 'card-open', delay: 3000 },
      { phase: 'card-fade', delay: 5000 },
      { phase: 'balloons-rise', delay: 6000 },
      { phase: 'balloons-recede', delay: 9000 },
      { phase: 'box-display', delay: 10500 },
      { phase: 'box-open', delay: 13000 },
      { phase: 'flowers-reveal', delay: 15000 },
      { phase: 'complete', delay: 20000 }
    ];

    const timeouts = timeline.map(({ phase, delay }) =>
      setTimeout(() => setAnimationPhase(phase), delay)
    );

    return () => timeouts.forEach(clearTimeout);
  }, []);

  // Particle system for gold dust/confetti
  useEffect(() => {
    if (animationPhase !== 'box-open' && animationPhase !== 'flowers-reveal') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create particles
    const createParticles = (count) => {
      const newParticles = [];
      for (let i = 0; i < count; i++) {
        newParticles.push({
          x: canvas.width / 2,
          y: canvas.height / 2,
          vx: (Math.random() - 0.5) * 10,
          vy: (Math.random() - 0.5) * 10 - 5,
          size: Math.random() * 4 + 2,
          color: Math.random() > 0.5 ? '#D4AF37' : '#FFD700',
          life: 1,
          decay: Math.random() * 0.01 + 0.005
        });
      }
      return newParticles;
    };

    particles.current = createParticles(200);

    // Animation loop
    let animationId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.current = particles.current.filter(p => {
        // Update
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2; // gravity
        p.life -= p.decay;

        // Draw
        if (p.life > 0) {
          ctx.globalAlpha = p.life;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        return p.life > 0;
      });

      if (particles.current.length > 0) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [animationPhase]);

  return (
    <div className="experience-container">
      <canvas ref={canvasRef} className="particle-canvas" />

      {/* Card */}
      <div className={`card ${animationPhase}`}>
        <div className="card-front">
          <div className="card-embossed-pattern"></div>
          <h2 className="card-recipient">{config.recipientName}</h2>
          <p className="card-occasion">{config.occasion}</p>
        </div>
        <div className="card-back">
          <p className="card-message">{config.senderMessage}</p>
          <div className="card-signature">With Love 💛</div>
        </div>
      </div>

      {/* Balloons */}
      {(animationPhase === 'balloons-rise' || animationPhase === 'balloons-recede' || 
        animationPhase === 'box-display' || animationPhase === 'box-open' || 
        animationPhase === 'flowers-reveal' || animationPhase === 'complete') && (
        <div className={`balloons ${animationPhase}`}>
          {config.balloonMessages.map((message, i) => (
            <div key={i} className="balloon" style={{ animationDelay: `${i * 0.3}s` }}>
              <div className="balloon-body">
                <span className="balloon-text">{message}</span>
              </div>
              <div className="balloon-string"></div>
            </div>
          ))}
        </div>
      )}

      {/* Gift Box */}
      {(animationPhase === 'balloons-rise' || animationPhase === 'balloons-recede' ||
        animationPhase === 'box-display' || animationPhase === 'box-open' ||
        animationPhase === 'flowers-reveal' || animationPhase === 'complete') && (
        <div className={`gift-box ${animationPhase}`}>
          <div className="box-lid">
            <div className="box-logo">DB</div>
          </div>
          <div className="box-body">
            <div className="box-front-text">
              <div className="box-name">{config.recipientName}</div>
              <div className="box-brand">Digital Bloom</div>
              <div className="box-occasion">{config.occasion}</div>
            </div>
          </div>
        </div>
      )}

      {/* Flowers */}
      {(animationPhase === 'flowers-reveal' || animationPhase === 'complete') && (
        <div className="flowers">
          <div className="flower rose" style={{ animationDelay: '0s' }}>
            <div className="petal"></div>
            <div className="petal"></div>
            <div className="petal"></div>
            <div className="stem"></div>
          </div>
          <div className="flower rose" style={{ animationDelay: '0.3s' }}>
            <div className="petal"></div>
            <div className="petal"></div>
            <div className="petal"></div>
            <div className="stem"></div>
          </div>
          <div className="flower lily" style={{ animationDelay: '0.6s' }}>
            <div className="petal"></div>
            <div className="petal"></div>
            <div className="petal"></div>
            <div className="stem"></div>
          </div>
          <div className="flower rose" style={{ animationDelay: '0.9s' }}>
            <div className="petal"></div>
            <div className="petal"></div>
            <div className="petal"></div>
            <div className="stem"></div>
          </div>
        </div>
      )}

      {/* Falling Petals */}
      {(animationPhase === 'flowers-reveal' || animationPhase === 'complete') && (
        <div className="falling-petals">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="petal-fall"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Debug Info (remove in production) */}
      <div className="debug-info">
        Phase: {animationPhase}
      </div>
    </div>
  );
};

export default Experience1;
