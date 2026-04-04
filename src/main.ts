import "./css/styles.css";

// Inverse parallax: move background down (positive offset) when scrolling down and vice-versa
let isTicking = false;

window.addEventListener("scroll", () => {
  if (!isTicking) {
    window.requestAnimationFrame(() => {
      const scrolled = window.scrollY;

      document.documentElement.style.setProperty(
        "--scroll-offset",
        `${scrolled * -0.25}px`,
      );
      isTicking = false;
    });
    isTicking = true;
  }
});

// Observer for video
const videoObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.target instanceof HTMLVideoElement) {
        const video = entry.target;

        if (entry.isIntersecting) {
          video.play();
        } else {
          video.pause();
          video.currentTime = 0;
        }
      }
    });
  },
  { threshold: 0.01, rootMargin: "150px" },
);

const videoEl = document.querySelector<HTMLVideoElement>("#video");
if (videoEl) videoObserver.observe(videoEl);

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

    const priceElement = product.querySelector<HTMLSpanElement>(".price span");

    // Add data attribute to target specific filter
    priceElement?.setAttribute("data-filter", index.toString());
    priceElement?.classList.add("dissolve-active");

    // Trigger forward animations for THIS card's filter (using index)
    const animateIds: string[] = [
      "turbulence-forward",
      "displacement-forward",
      "blur-forward",
      "opacity-forward",
    ];

    animateIds.forEach((id) => {
      const animateEl = document.querySelector<SVGAnimateElement>(
        `#${id}-${index}`,
      );
      animateEl?.beginElement();
    });
  });

  product.addEventListener("mouseleave", () => {
    const priceElement = product.querySelector<HTMLSpanElement>(".price span");

    // Trigger reverse animations for THIS card's filter (using index)
    const animateIds: string[] = [
      "turbulence-reverse",
      "displacement-reverse",
      "blur-reverse",
      "opacity-reverse",
    ];

    animateIds.forEach((id) => {
      const animateEl = document.querySelector<SVGAnimateElement>(
        `#${id}-${index}`,
      );
      animateEl?.beginElement();
    });

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

// Form handling
const form = document.querySelector<HTMLFormElement>("#form");
const modal = document.querySelector<HTMLDialogElement>("#joke-modal");
const closeModalBtn = document.querySelector<HTMLButtonElement>("#close-modal");
const emailInput = document.querySelector<HTMLInputElement>("#email");
const validationMessages: string[] = [
  "This does not look like an email to me...",
  "You seem to be bad at this, to be honest",
  "We need to try something different here",
  " ", // No message
  "It should work... Just make sure to input a valid email",
];
let validationIndex = 0;
let isHandlingInvalid = false;

form?.addEventListener("submit", (e) => {
  e.preventDefault();
  if (emailInput?.checkValidity()) {
    modal?.showModal();
  }
});

emailInput?.addEventListener("invalid", (e) => {
  if (isHandlingInvalid) return; // This check might seem redundant but it is NOT

  e.preventDefault();

  const message: string = validationMessages[validationIndex];
  emailInput.setCustomValidity(message);

  // Rotate validation messages
  validationIndex = (validationIndex + 1) % validationMessages.length;

  isHandlingInvalid = true;
  setTimeout(() => {
    emailInput.reportValidity();
    isHandlingInvalid = false;
  }, 0);
});

closeModalBtn?.addEventListener("click", () => {
  modal?.close();
});

// Email input randomizer
let previousValue: string = "";

function getRandomCharacter(): string {
  const chars: string =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  return chars[Math.floor(Math.random() * chars.length)];
}

emailInput?.addEventListener("input", () => {
  // Reset validation message for input, otherwise the form is unsubmittable
  emailInput.setCustomValidity("");

  const currentValue: string = emailInput.value;

  if (currentValue.length > previousValue.length) {
    // User adds a character
    const lastChar: string = currentValue[currentValue.length - 1];

    // Replace with random character if it's not an @ or .
    if (lastChar !== "@" && lastChar !== ".") {
      const newValue: string = currentValue.slice(0, -1) + getRandomCharacter();
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
