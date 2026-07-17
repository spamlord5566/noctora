import React, { useEffect, useRef } from 'react';

export default function ParticleEffect({ theme }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const particles = [];
    // Adapt particle density depending on display size
    const particleCount = Math.min(80, Math.floor((width * height) / 18000));

    const mouse = { x: null, y: null, radius: 130 };
    const activeTheme = theme || 'dark';

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2.2 + 0.6;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = -(Math.random() * 0.4 + 0.2); // Slowly rise upwards
        
        // Setup colors according to active theme
        this.baseColor = activeTheme === 'dark' 
          ? (Math.random() > 0.5 ? '0, 242, 254' : '112, 0, 255') // Cyan / Indigo (dark mode)
          : (Math.random() > 0.5 ? '255, 78, 80' : '249, 212, 35'); // Orange / Yellow (light mode)
        
        this.alpha = Math.random() * 0.4 + 0.15;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Reset particle position when it rises past top of the screen
        if (this.y < 0) {
          this.y = height;
          this.x = Math.random() * width;
        }

        // Keep horizontal boundaries inside bounds
        if (this.x < 0 || this.x > width) {
          this.speedX = -this.speedX;
        }

        // Cursor attraction/repulsion
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius;
            // Push away particles gently from the mouse cursor
            this.x -= (dx / distance) * force * 1.6;
            this.y -= (dy / distance) * force * 1.6;
          }
        }
      }

      draw() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.baseColor}, ${this.alpha})`;
        
        // Add delicate glowing bloom around canvas particles
        ctx.shadowBlur = this.size * 3.5;
        ctx.shadowColor = `rgba(${this.baseColor}, 0.6)`;
        ctx.fill();
        ctx.restore();
      }
    }

    const init = () => {
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Render a subtle spotlight backdrop around cursor in dark mode
      if (mouse.x !== null && mouse.y !== null && activeTheme === 'dark') {
        const gradient = ctx.createRadialGradient(
          mouse.x, mouse.y, 0, 
          mouse.x, mouse.y, mouse.radius
        );
        gradient.addColorStop(0, 'rgba(0, 242, 254, 0.035)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, mouse.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      init();
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseleave', handleMouseLeave);

    init();
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [theme]);

  return <canvas ref={canvasRef} className="particle-canvas" />;
}
