import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
gsap.registerPlugin(ScrollTrigger, CustomEase);

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

CustomEase.create("revealEase", "0.22, 0.61, 0.36, 1");
CustomEase.create("wipeEase", "0.2, 0.7, 0.25, 1");

// nav flotante: se oculta al bajar, reaparece al subir
const nav = document.querySelector("nav");
if (nav) {
  let lastScrollY = window.scrollY;
  window.addEventListener(
    "scroll",
    () => {
      const scrollY = window.scrollY;
      const scrollingDown = scrollY > lastScrollY;
      const hidden = scrollingDown && scrollY > nav.clientHeight;
      gsap.to(nav, {
        yPercent: hidden ? -100 : 0,
        duration: prefersReducedMotion ? 0 : 0.3,
        ease: "power2.out",
      });
      lastScrollY = scrollY;
    },
    { passive: true },
  );
}

// 5. parallax por capas
function initParallax(el: HTMLElement) {
  const speed = parseFloat(el.dataset.par ?? "0");
  if (!speed) return;
  gsap.fromTo(
    el,
    { y: () => (speed * (window.innerHeight + el.offsetHeight)) / 2 },
    {
      y: () => (-speed * (window.innerHeight + el.offsetHeight)) / 2,
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        invalidateOnRefresh: true,
      },
    },
  );
}

if (!prefersReducedMotion) {
  // 1. fade + subida al entrar
  gsap.utils.toArray<Element>("[data-reveal]").forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      y: 24,
      duration: 1.15,
      ease: "revealEase",
      scrollTrigger: { trigger: el, start: "top 92%" },
    });
  });

  // 2. barrido de máscara en imágenes
  gsap.utils.toArray<Element>("[data-wipe]").forEach((el) => {
    gsap.fromTo(
      el,
      { clipPath: "inset(0 0 100% 0)" },
      {
        clipPath: "inset(0 0 0% 0)",
        duration: 1.55,
        ease: "wipeEase",
        scrollTrigger: { trigger: el, start: "top 92%" },
      },
    );
  });

  // 3. entrada escalonada del hero, al montar
  // (sin clip-path: los paneles del hero tienen elementos que sobresalen,
  // como la etiqueta de precio, y el clip-path los recortaría igualmente
  // en el estado final "abierto". Va en un nodo aparte del que lleva el
  // parallax de scroll -el <figure>-, nunca en el mismo: si comparten
  // propiedad "y" se pisan y dan un salto al terminar la entrada)
  gsap.utils.toArray<Element>("[data-reveal-wipe]").forEach((el, i) => {
    gsap.from(el, {
      opacity: 0,
      y: 70,
      duration: 1.5,
      ease: "revealEase",
      delay: (90 + i * 170) / 1000,
    });
  });

  // 4. titular palabra a palabra, al cargar
  gsap.utils.toArray<Element>("[data-word]").forEach((el, i) => {
    gsap.fromTo(
      el,
      { yPercent: 108 },
      {
        yPercent: 0,
        duration: 1.25,
        ease: "wipeEase",
        delay: (320 + i * 110) / 1000,
      },
    );
  });

  gsap.utils.toArray<HTMLElement>("[data-par]").forEach(initParallax);

  // 9. entradas laterales alternas (filas de highlights)
  const rowMM = gsap.matchMedia();
  rowMM.add(
    { isWide: "(min-width: 880px)" },
    (context) => {
      const { isWide } = context.conditions as { isWide: boolean };

      gsap.utils.toArray<HTMLElement>("[data-row-photo]").forEach((el) => {
        gsap.from(el, {
          x: isWide ? (el.dataset.rowPhoto === "right" ? 56 : -56) : 0,
          y: isWide ? 0 : 24,
          opacity: 0,
          duration: 1.25,
          ease: "revealEase",
          scrollTrigger: { trigger: el, start: "top 92%" },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-row-text]").forEach((el) => {
        gsap.from(el, {
          x: isWide ? (el.dataset.rowText === "right" ? -28 : 28) : 0,
          y: isWide ? 0 : 24,
          opacity: 0,
          duration: 1.25,
          ease: "revealEase",
          scrollTrigger: { trigger: el, start: "top 92%" },
        });
      });
    },
  );
}

// despliegue suave de los acordeones de actividades
if (!prefersReducedMotion) {
  document.querySelectorAll<HTMLDetailsElement>("details").forEach((details) => {
    const summary = details.querySelector("summary");
    const panel = details.querySelector<HTMLElement>(":scope > summary + *");
    const chevron = summary?.querySelector<HTMLElement>(".activity-chevron");
    if (!summary || !panel) return;

    let isAnimating = false;

    summary.addEventListener("click", (e) => {
      e.preventDefault();
      if (isAnimating) return;
      isAnimating = true;
      gsap.killTweensOf([panel, chevron]);

      if (details.open) {
        if (chevron) gsap.to(chevron, { rotate: 0, duration: 0.3, ease: "power2.in" });
        gsap.set(panel, { height: panel.scrollHeight, overflow: "hidden" });
        gsap.to(panel, {
          height: 0,
          opacity: 0,
          duration: 0.32,
          ease: "power2.in",
          onComplete: () => {
            details.open = false;
            isAnimating = false;
            gsap.set(panel, { clearProps: "height,opacity,overflow" });
          },
        });
      } else {
        details.open = true;
        const targetHeight = panel.scrollHeight;
        if (chevron) gsap.to(chevron, { rotate: 45, duration: 0.4, ease: "power3.out" });
        gsap.fromTo(
          panel,
          { height: 0, opacity: 0, overflow: "hidden" },
          {
            height: targetHeight,
            opacity: 1,
            duration: 0.45,
            ease: "power3.out",
            onComplete: () => {
              isAnimating = false;
              gsap.set(panel, { clearProps: "height,overflow" });
            },
          },
        );
      }
    });
  });
}

// 8. raíl de progreso lateral (solo home, visible en ≥1024px vía CSS)
const railFill = document.querySelector<HTMLElement>("#rail-fill");
const railDot = document.querySelector<HTMLElement>("#rail-dot");
const railLabel = document.querySelector<HTMLElement>("#rail-label");
const secEls = gsap.utils.toArray<HTMLElement>("[data-sec]");

if (railFill && railDot && secEls.length > 0) {
  let currentLabel = "";
  ScrollTrigger.create({
    trigger: document.documentElement,
    start: "top top",
    end: "bottom bottom",
    onUpdate: (self) => {
      const p = self.progress;
      railFill.style.height = `${p * 100}%`;
      railDot.style.top = `${p * 100}%`;

      let active: HTMLElement | null = null;
      for (const el of secEls) {
        if (el.getBoundingClientRect().top < window.innerHeight * 0.45) {
          active = el;
        }
      }
      const name = active?.dataset.sec ?? "";
      if (name !== currentLabel && railLabel) {
        currentLabel = name;
        gsap.to(railLabel, {
          opacity: 0,
          y: -4,
          duration: prefersReducedMotion ? 0 : 0.18,
          ease: "power1.in",
          onComplete: () => {
            railLabel.textContent = name;
            gsap.fromTo(
              railLabel,
              { opacity: 0, y: 4 },
              { opacity: 1, y: 0, duration: prefersReducedMotion ? 0 : 0.22, ease: "power1.out" },
            );
          },
        });
      }
    },
  });
}
