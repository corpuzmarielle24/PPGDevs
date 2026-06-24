const marqueeTrack = document.querySelector(".marquee-track");

if (marqueeTrack) {
  marqueeTrack.innerHTML += marqueeTrack.innerHTML;
}

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const hasGsap = window.gsap && window.ScrollTrigger;

function setupFallbackReveal() {
  const revealItems = document.querySelectorAll("[data-reveal]");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function splitHeroHeadline() {
  const heading = document.querySelector(".hero h1");

  if (!heading || heading.dataset.split === "true") return;

  const words = heading.textContent.trim().split(/\s+/);
  heading.innerHTML = words
    .map((word) => `<span class="hero-word">${word}</span>`)
    .join(" ");
  heading.dataset.split = "true";
}

function setupGsap() {
  splitHeroHeadline();
  gsap.registerPlugin(ScrollTrigger);
  gsap.config({ nullTargetWarn: false });

  const header = document.querySelector(".site-header");

  gsap.to(".scroll-progress", {
    scaleX: 1,
    ease: "none",
    scrollTrigger: {
      trigger: document.documentElement,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.2
    }
  });

  if (header) {
    ScrollTrigger.create({
      start: 80,
      end: "max",
      toggleClass: { targets: header, className: "is-scrolled" }
    });
  }

  gsap.set("[data-reveal]", { autoAlpha: 0, y: 28 });

  gsap.set(".hero-copy", { autoAlpha: 1, x: -24 });
  gsap.set(".hero-word", { autoAlpha: 0, y: 44, rotate: 2 });
  gsap.set(".hero .hero-text, .hero .hero-actions, .hero .eyebrow", { autoAlpha: 0, y: 18 });
  gsap.set(".hero-media", { autoAlpha: 0, x: 42, rotate: 2, scale: 0.94 });
  gsap.set(".mobile-hero-peek", { autoAlpha: 0, y: 26, scale: 0.96 });
  gsap.set(".hero-note", { autoAlpha: 0, x: -18 });

  gsap
    .timeline({ defaults: { duration: 1, ease: "power3.out" } })
    .to(".hero-copy", { x: 0, y: 0, duration: 0.7 })
    .to(".hero .eyebrow", { autoAlpha: 1, y: 0, duration: 0.42 }, "-=0.45")
    .to(".hero-word", { autoAlpha: 1, y: 0, rotate: 0, stagger: 0.055, duration: 0.58 }, "-=0.22")
    .to(".mobile-hero-peek", { autoAlpha: 1, y: 0, scale: 1, duration: 0.58 }, "-=0.34")
    .to(".hero .hero-text, .hero .hero-actions", { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.52 }, "-=0.42")
    .to(".hero-media", { autoAlpha: 1, x: 0, y: 0, rotate: 0, scale: 1 }, "-=0.9")
    .to(".hero-note", { autoAlpha: 1, x: 0, y: 0 }, "-=0.42")
    .from(".brand-mark", { scaleX: 0.2, rotate: -32, duration: 0.7, ease: "back.out(2)" }, "-=0.8");

  gsap.to(".hero-media img, .mobile-hero-peek img", {
    yPercent: 13,
    scale: 1.1,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true
    }
  });

  gsap.utils.toArray("main > section:not(.hero)").forEach((section) => {
    const items = section.querySelectorAll("[data-reveal]");

    if (!items.length) return;

    gsap.to(items, {
      autoAlpha: 1,
      y: 0,
      duration: 0.95,
      ease: "power3.out",
      stagger: 0.18,
      scrollTrigger: {
        trigger: section,
        start: "top 76%",
        once: true
      }
    });
  });

  gsap.utils.toArray(".ingredient-tile").forEach((tile) => {
    tile.addEventListener("pointermove", (event) => {
      const rect = tile.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      gsap.to(tile, {
        rotateX: y * -6,
        rotateY: x * 8,
        y: -6,
        duration: 0.45,
        ease: "power3.out"
      });
    });

    tile.addEventListener("pointerleave", () => {
      gsap.to(tile, {
        rotateX: 0,
        rotateY: 0,
        y: 0,
        duration: 0.65,
        ease: "elastic.out(1, 0.55)"
      });
    });
  });

  gsap.utils.toArray(".method-step span").forEach((marker) => {
    gsap.from(marker, {
      scale: 0.72,
      rotate: -10,
      duration: 0.55,
      ease: "back.out(1.8)",
      scrollTrigger: {
        trigger: marker,
        start: "top 82%",
        once: true
      }
    });
  });

  gsap.utils.toArray(".method-step").forEach((step) => {
    ScrollTrigger.create({
      trigger: step,
      start: "top 58%",
      end: "bottom 42%",
      toggleClass: { targets: step, className: "is-active" }
    });
  });

  const fryStages = gsap.utils.toArray(".fry-stage");
  const stageProgress = document.querySelector(".stage-progress span");

  function setFryStage(progress) {
    if (!fryStages.length) return;

    const activeIndex = Math.min(
      fryStages.length - 1,
      Math.max(0, Math.floor(progress * fryStages.length))
    );

    fryStages.forEach((stage, index) => {
      stage.classList.toggle("is-active", index === activeIndex);
    });

    if (stageProgress) {
      stageProgress.style.setProperty("--stage-progress", progress.toFixed(3));
    }
  }

  if (fryStages.length) {
    setFryStage(0);

    gsap.from(fryStages, {
      x: 24,
      duration: 0.55,
      ease: "power3.out",
      stagger: 0.09,
      scrollTrigger: {
        trigger: ".fry-stage-meter",
        start: "top 78%",
        once: true
      }
    });

    ScrollTrigger.create({
      trigger: ".recipe",
      start: "top 68%",
      end: "bottom 42%",
      scrub: true,
      onUpdate: (self) => setFryStage(self.progress)
    });
  }

  const heatValue = { value: 150 };
  const heatReadout = document.querySelector(".heat-dial strong");

  if (heatReadout) {
    gsap.to(heatValue, {
      value: 175,
      ease: "none",
      scrollTrigger: {
        trigger: ".recipe",
        start: "top 80%",
        end: "top 34%",
        scrub: true
      },
      onUpdate: () => {
        heatReadout.textContent = `${Math.round(heatValue.value)}\u00b0C`;
      }
    });
  }

  const curve = document.querySelector(".curve");
  const curveLine = document.querySelector(".curve-line");
  const curvePoints = gsap.utils.toArray(".curve-point");

  if (curve && curveLine) {
    const curveLength = curveLine.getTotalLength();

    gsap.set(curveLine, {
      strokeDasharray: curveLength,
      strokeDashoffset: curveLength
    });
    gsap.set(curvePoints, { autoAlpha: 0, scale: 0.72, transformOrigin: "center" });

    gsap
      .timeline({
        scrollTrigger: {
          trigger: curve,
          start: "top 72%",
          once: true
        }
      })
      .to(curveLine, {
        strokeDashoffset: 0,
        duration: 1.1,
        ease: "power2.out"
      })
      .to(
        curvePoints,
        {
          autoAlpha: 1,
          scale: 1,
          duration: 0.45,
          ease: "back.out(1.7)",
          stagger: 0.11
        },
        "-=0.52"
      );
  }

  window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });

  ScrollTrigger.matchMedia({
    "(min-width: 1101px)": () => {
      const panelTween = gsap.to(".temperature-panel", {
        y: -34,
        ease: "none",
        scrollTrigger: {
          trigger: ".recipe",
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });

      return () => panelTween.kill();
    }
  });
}

if (hasGsap && !prefersReducedMotion) {
  setupGsap();
} else {
  setupFallbackReveal();
}







