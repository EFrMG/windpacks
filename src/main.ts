import "./css/styles.css";

// Inverse parallax: move background down (positive offset) when scrolling down and vice-versa
let ticking: boolean = false;

window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const scrolled = window.scrollY;

      document.documentElement.style.setProperty(
        "--scroll-offset",
        `${scrolled * -0.25}px`
      );
      ticking = false;
    });
    ticking = true;
  }
});

// Observer for video
const videoObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const video = entry.target as HTMLVideoElement;

      if (entry.isIntersecting) {
        video.play();
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  },
  { threshold: 0.01, rootMargin: "150px" }
);

videoObserver.observe(document.getElementById("video") as HTMLVideoElement);

// Particle dissolve effect on product hover
const products = document.querySelectorAll(".product");

// Store timeout IDs to clear them when re-hovering
const timeoutMap = new WeakMap<Element, number>();

products.forEach((product, index) => {
  product.addEventListener("mouseenter", () => {
    // Clear any pending timeout for this product (in case re-hovering)
    const existingTimeout = timeoutMap.get(product);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
      timeoutMap.delete(product);
    }

    const priceElement = product.querySelector(
      ".price span"
    ) as HTMLSpanElement;

    // Add data attribute to target specific filter
    priceElement?.setAttribute("data-filter", index.toString());
    priceElement?.classList.add("dissolve-active");

    // Trigger forward animations for THIS card's filter (using index)
    const turbulenceForward = document.getElementById(
      `turbulence-forward-${index}`
    ) as unknown as SVGAnimateElement;
    const displacementForward = document.getElementById(
      `displacement-forward-${index}`
    ) as unknown as SVGAnimateElement;
    const blurForward = document.getElementById(
      `blur-forward-${index}`
    ) as unknown as SVGAnimateElement;
    const opacityForward = document.getElementById(
      `opacity-forward-${index}`
    ) as unknown as SVGAnimateElement;

    turbulenceForward?.beginElement();
    displacementForward?.beginElement();
    blurForward?.beginElement();
    opacityForward?.beginElement();
  });

  product.addEventListener("mouseleave", () => {
    const priceElement = product.querySelector(
      ".price span"
    ) as HTMLSpanElement;

    // Trigger reverse animations for THIS card's filter (using index)
    const turbulenceReverse = document.getElementById(
      `turbulence-reverse-${index}`
    ) as unknown as SVGAnimateElement;
    const displacementReverse = document.getElementById(
      `displacement-reverse-${index}`
    ) as unknown as SVGAnimateElement;
    const blurReverse = document.getElementById(
      `blur-reverse-${index}`
    ) as unknown as SVGAnimateElement;
    const opacityReverse = document.getElementById(
      `opacity-reverse-${index}`
    ) as unknown as SVGAnimateElement;

    turbulenceReverse?.beginElement();
    displacementReverse?.beginElement();
    blurReverse?.beginElement();
    opacityReverse?.beginElement();

    // Remove filter after animation completes
    const timeoutId = window.setTimeout(() => {
      priceElement?.classList.remove("dissolve-active");
      priceElement?.removeAttribute("data-filter");
      timeoutMap.delete(product);
    }, 1201);

    // Store timeout ID so we clear it if re-hovered
    timeoutMap.set(product, timeoutId);
  });
});

// Email input randomizer
const emailInput = document.getElementById("email") as HTMLInputElement;
let previousValue = "";

function getRandomCharacter() {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  return chars[Math.floor(Math.random() * chars.length)];
}

emailInput?.addEventListener("input", () => {
  const currentValue = emailInput.value;

  if (currentValue.length > previousValue.length) {
    // User adds a character
    const lastChar = currentValue[currentValue.length - 1];

    // Replace with random character if it's not an @ or .
    if (lastChar !== "@" && lastChar !== ".") {
      const newValue = currentValue.slice(0, -1) + getRandomCharacter();
      emailInput.value = newValue;
      previousValue = newValue;
    } else {
      previousValue = currentValue;
    }
  } else {
    // User deletes a character
    previousValue = currentValue;
  }
});
