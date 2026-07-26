import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

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
      gsap.to(nav, { yPercent: hidden ? -100 : 0, duration: 0.3, ease: "power2.out" });
      lastScrollY = scrollY;
    },
    { passive: true },
  );
}

// parallax hero
gsap.to(".hero-bg", {
  yPercent: 20,
  ease: "none",
  scrollTrigger: { trigger: ".hero", scrub: true },
});

// reveals genéricos
gsap.utils.toArray(".reveal").forEach((el) => {
  gsap.from(el as Element, {
    opacity: 0,
    y: 40,
    duration: 0.8,
    scrollTrigger: { trigger: el as Element, start: "top 85%" },
  });
});
