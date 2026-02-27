class AnimatedHeader {
  constructor(options = {}) {
    this.options = this.mergeOptions(options);
    this.container = document.querySelector(".animated-header");

    if (!this.container) {
      console.error("AnimatedHeader: .animated-header element not found.");
      return;
    }

    this.initCanvas();
    this.createParticles();
    this.animate();
    window.addEventListener("resize", () => this.resize());
  }

  mergeOptions(options) {
    return {
      count: options.count || 3,
      size: options.size || { min: 800, max: 1200, pulse: 0 },
      speed: options.speed || {
        x: { min: 0.2, max: 0.6 },
        y: { min: 0.2, max: 0.6 }
      },
      colors: options.colors || {
        background: "#000000",
        particles: ["#ff00ff", "#00ffff"]
      },
      blending: options.blending || "lighter",
      opacity: options.opacity || { center: 0.5, edge: 0.8 },
      skew: options.skew || 0,
      shapes: options.shapes || ["c"]
    };
  }

  initCanvas() {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");

    this.container.style.position = "relative";

    this.canvas.style.position = "absolute";
    this.canvas.style.top = 0;
    this.canvas.style.left = 0;
    this.canvas.style.zIndex = 0;

    this.container.prepend(this.canvas);

    this.resize();
  }

  resize() {
    this.canvas.width = this.container.offsetWidth;
    this.canvas.height = this.container.offsetHeight;
  }

  random(min, max) {
    return Math.random() * (max - min) + min;
  }

  createParticles() {
    this.particles = [];

    for (let i = 0; i < this.options.count; i++) {
      this.particles.push({
        x: this.random(0, this.canvas.width),
        y: this.random(0, this.canvas.height),
        radius: this.random(this.options.size.min, this.options.size.max),
        vx: this.random(this.options.speed.x.min, this.options.speed.x.max),
        vy: this.random(this.options.speed.y.min, this.options.speed.y.max),
        color: this.options.colors.particles[
          Math.floor(Math.random() * this.options.colors.particles.length)
        ]
      });
    }
  }

  drawParticle(p) {
    const gradient = this.ctx.createRadialGradient(
      p.x,
      p.y,
      p.radius * 0.1,
      p.x,
      p.y,
      p.radius
    );

    gradient.addColorStop(
      0,
      this.hexToRGBA(p.color, this.options.opacity.center)
    );
    gradient.addColorStop(
      1,
      this.hexToRGBA(p.color, this.options.opacity.edge)
    );

    this.ctx.beginPath();
    this.ctx.fillStyle = gradient;
    this.ctx.globalCompositeOperation = this.options.blending;
    this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    this.ctx.fill();
  }

  hexToRGBA(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  updateParticles() {
    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x - p.radius > this.canvas.width) p.x = -p.radius;
      if (p.y - p.radius > this.canvas.height) p.y = -p.radius;
    });
  }

  animate() {
    this.ctx.globalCompositeOperation = "source-over";
    this.ctx.fillStyle = this.options.colors.background;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.updateParticles();
    this.particles.forEach(p => this.drawParticle(p));

    requestAnimationFrame(() => this.animate());
  }
}