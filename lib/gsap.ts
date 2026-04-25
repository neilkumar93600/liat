import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(SplitText, ScrollTrigger);
}

export { gsap, SplitText, ScrollTrigger };

export const EASE_LUXURY = "cubic-bezier(0.76, 0, 0.24, 1)";

export const slideTransition = {
  enter: (el: HTMLElement) =>
    gsap.fromTo(
      el,
      { opacity: 0, scale: 0.97 },
      { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" }
    ),
  exit: (el: HTMLElement) =>
    gsap.to(el, { opacity: 0, scale: 1.02, duration: 0.5, ease: "power2.in" }),
};

export function revealLines(el: HTMLElement, delay = 0) {
  const split = new SplitText(el, { type: "lines" });
  return gsap.from(split.lines, {
    y: 80,
    opacity: 0,
    duration: 1,
    stagger: 0.1,
    ease: "power3.out",
    delay,
  });
}

export function revealFadeUp(els: Element[], delay = 0) {
  return gsap.from(els, {
    y: 40,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: "power2.out",
    delay,
  });
}

export function animateCounter(
  obj: { val: number },
  target: number,
  onUpdate: (v: number) => void,
  duration = 2,
  delay = 0
) {
  return gsap.to(obj, {
    val: target,
    duration,
    delay,
    ease: "power2.out",
    onUpdate: () => onUpdate(obj.val),
  });
}
