"use client";

import { useEffect, useRef, useState } from "react";

const ExplosionContainer = () => {
  const explosionContainerRef = useRef(null);
  const footerRef = useRef(null);
  const [explosionTriggered, setExplosionTriggered] = useState(false);
  const particlesRef = useRef([]);
  const animationIdRef = useRef(null);

  const config = {
    gravity: 0.25,
    friction: 0.99,
    imageSize: 150,
    horizontalForce: 20,
    verticalForce: 15,
    rotationSpeed: 10,
    resetDelay: 1500, // Increased to ensure complete reset
    initialSpacing: 30,
  };

  const imageParticleCount = 15;
  const imagePaths = Array.from(
    { length: imageParticleCount },
    (_, i) => `/assets/img-${i + 1}.jpg`
  );

  class Particle {
    constructor(element, containerWidth) {
      this.element = element;
      // Start with a distributed position across the container width
      this.x = Math.random() * containerWidth * 0.8 - containerWidth * 0.4;
      this.y = Math.random() * config.initialSpacing - config.initialSpacing;
      this.vx = (Math.random() - 0.5) * config.horizontalForce;
      this.vy = -config.verticalForce - Math.random() * 10;
      this.rotation = 0;
      this.rotationSpeed = (Math.random() - 0.5) * config.rotationSpeed;
      
      // Apply initial position
      this.applyStyles();
    }

    applyStyles() {
      if (this.element) {
        this.element.style.transform = `translate(${this.x}px, ${this.y}px) rotate(${this.rotation}deg)`;
      }
    }

    update() {
      this.vy += config.gravity;
      this.vx *= config.friction;
      this.vy *= config.friction;
      this.rotationSpeed *= config.friction;

      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.rotationSpeed;

      this.applyStyles();
    }
  }

  const cleanupPreviousExplosion = () => {
    // Cancel any ongoing animations
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
      animationIdRef.current = null;
    }
    
    // Clear previous particles
    if (explosionContainerRef.current) {
      explosionContainerRef.current.innerHTML = "";
    }
    
    particlesRef.current = [];
  };

  const createParticles = () => {
    if (!explosionContainerRef.current) return;

    // First clean up any previous state
    cleanupPreviousExplosion();

    // Get container width for distributed positioning
    const containerWidth = explosionContainerRef.current.offsetWidth;

    imagePaths.forEach((path) => {
      const particle = document.createElement("img");
      particle.src = path;
      particle.classList.add("explosion-particle-img");
      particle.style.width = `${config.imageSize}px`;
      
      // Set initial position
      particle.style.position = "absolute";
      particle.style.left = "50%";
      particle.style.top = "0";
      particle.style.transition = "none"; // Ensure no CSS transitions interfere
      
      explosionContainerRef.current.appendChild(particle);
    });

    const particleElements = explosionContainerRef.current.querySelectorAll(
      ".explosion-particle-img"
    );
    
    particlesRef.current = Array.from(particleElements).map(
      (element) => new Particle(element, containerWidth)
    );
  };

  const explode = () => {
    if (explosionTriggered) return;

    setExplosionTriggered(true);
    createParticles();

    let finished = false;

    const animate = () => {
      if (finished) return;

      particlesRef.current.forEach((particle) => particle.update());

      // Check if animation should end
      if (
        explosionContainerRef.current &&
        particlesRef.current.every(
          (particle) =>
            particle.y > explosionContainerRef.current.offsetHeight / 2
        )
      ) {
        finished = true;
        setTimeout(() => {
          cleanupPreviousExplosion();
          setExplosionTriggered(false);
        }, config.resetDelay);
        return;
      }
      
      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();
  };

  const checkFooterPosition = () => {
    if (!footerRef.current || !explosionContainerRef.current) return;

    const footerRect = footerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Position explosion container relative to footer
    explosionContainerRef.current.style.width = "100%";
    explosionContainerRef.current.style.left = "0";
    
    if (
      !explosionTriggered &&
      footerRect.top <= viewportHeight - footerRect.height * 0.5
    ) {
      explode();
    }
  };

  useEffect(() => {
    // Preload images
    imagePaths.forEach((path) => {
      const img = new Image();
      img.src = path;
    });

    footerRef.current = document.querySelector("footer");

    // Initialize explosion container styling
    if (explosionContainerRef.current) {
      explosionContainerRef.current.style.position = "absolute";
      explosionContainerRef.current.style.width = "100%";
      explosionContainerRef.current.style.height = "0";
      explosionContainerRef.current.style.overflow = "visible";
      explosionContainerRef.current.style.zIndex = "10";
      explosionContainerRef.current.style.pointerEvents = "none"; // Prevent interfering with clicks
    }

    let checkTimeout;
    const handleScroll = () => {
      clearTimeout(checkTimeout);
      checkTimeout = setTimeout(checkFooterPosition, 10);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", cleanupPreviousExplosion);

    // Initial check
    setTimeout(checkFooterPosition, 500);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", cleanupPreviousExplosion);
      cleanupPreviousExplosion();
      clearTimeout(checkTimeout);
    };
  }, []);

  return (
    <div className="explosion-container" ref={explosionContainerRef}></div>
  );
};

export default ExplosionContainer;