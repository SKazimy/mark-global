import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function scrollToContact({ offset = 0, duration = 600 } = {}) {
  // Keep for backwards compatibility — delegate to scrollTo
  scrollTo('#contact', { offset, duration });
}

export function scrollTo(selectorOrElement: string | Element, { offset = 0, duration = 600 } = {}) {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;

  let el: Element | null = null;
  if (typeof selectorOrElement === 'string') {
    // accept '#id' or other selectors
    el = document.querySelector(selectorOrElement);
  } else if (selectorOrElement instanceof Element) {
    el = selectorOrElement;
  }

  if (!el) {
    // fallback: set hash if selector is an id
    if (typeof selectorOrElement === 'string' && selectorOrElement.startsWith('#')) {
      try {
        window.location.hash = selectorOrElement;
      } catch {}
    }
    return;
  }

  // compute offset (default to fixed nav height if present)
  const nav = document.querySelector('nav');
  const navHeight = nav ? (nav as HTMLElement).offsetHeight : 80;
  const target = el.getBoundingClientRect().top + window.pageYOffset - (offset || navHeight);

  // animated scroll using requestAnimationFrame and an easing function
  const start = window.pageYOffset;
  const change = target - start;
  const startTime = performance.now();

  function easeInOutQuad(t: number) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  function animate(now: number) {
    const elapsed = Math.min(1, (now - startTime) / duration);
    const val = easeInOutQuad(elapsed);
    window.scrollTo(0, Math.round(start + change * val));
    if (elapsed < 1) {
      requestAnimationFrame(animate);
    } else {
      // Add a brief highlight class to the target element
      (el as HTMLElement).classList.add('scroll-highlight');
      const cleanup = () => {
        (el as HTMLElement).classList.remove('scroll-highlight');
        el!.removeEventListener('animationend', cleanup);
      };
      el.addEventListener('animationend', cleanup);
    }
  }

  requestAnimationFrame(animate);
}
