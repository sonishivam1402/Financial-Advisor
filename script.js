// Header scroll effect
const header = document.querySelector("header");
const onScroll = () => {
  if (window.scrollY > 50) header.classList.add("scrolled");
  else header.classList.remove("scrolled");
};
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Mobile menu
const toggleBtn = document.querySelector(".menu-toggle");
const drawer = document.querySelector(".mobile-drawer");
toggleBtn?.addEventListener("click", () => {
  const isOpen = drawer.classList.toggle("open");
  toggleBtn.setAttribute("aria-expanded", isOpen.toString());
  drawer.setAttribute("aria-hidden", (!isOpen).toString());
});
drawer?.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => {
    drawer.classList.remove("open");
    toggleBtn.setAttribute("aria-expanded", "false");
    drawer.setAttribute("aria-hidden", "true");
  })
);

// Scroll reveal animations
const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in-view");
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// Animated counters for stats
const counters = document.querySelectorAll(".counter");
const fmt = (num, decimals) =>
  num.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
const runCounter = (el) => {
  const target = parseFloat(el.dataset.value || "0");
  const prefix = el.dataset.prefix || "";
  const suffix = el.dataset.suffix || "";
  const decimals = parseInt(el.dataset.decimals || "0", 10);
  let start = 0;
  const duration = 1400;
  const startTs = performance.now();
  const step = (now) => {
    const p = Math.min((now - startTs) / duration, 1);
    const ease = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p; // easeInOutQuad
    const val = start + (target - start) * ease;
    el.textContent = `${prefix}${fmt(val, decimals)}${suffix}`;
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = `${prefix}${fmt(target, decimals)}${suffix}`;
  };
  requestAnimationFrame(step);
};
const countersIO = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        runCounter(entry.target);
        countersIO.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.6 }
);
counters.forEach((c) => countersIO.observe(c));

// Contact form (radios validated; dropdowns removed)
const form = document.getElementById("contactForm");
const thanksMessage = document.getElementById("thanks");
form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Validate text inputs
  const requiredInputs = ["firstName", "lastName", "email", "phone"];
  let ok = true;
  for (const id of requiredInputs) {
    const field = form.querySelector("#" + id);
    if (!field.value.trim()) {
      field.style.borderColor = "#ef4444";
      ok = false;
    } else {
      field.style.borderColor = "";
    }
  }
  // Email format
  const email = form.email.value.trim();
  if (!/^([^\s@]+)@([^\s@]+)\.[^\s@]+$/.test(email)) {
    ok = false;
    form.email.style.borderColor = "#ef4444";
  }

  // Radios
  const assetsChecked = form.querySelector('input[name="assets"]:checked');
  const interestChecked = form.querySelector('input[name="interest"]:checked');
  if (!assetsChecked || !interestChecked) {
    ok = false;
    alert("Please choose your Investable Assets and Primary Interest.");
  }
  if (!ok) return;

  // Simulate submission
  const submitBtn = form.querySelector('button[type="submit"]');
  const original = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = "Sending…";
  await new Promise((r) => setTimeout(r, 1200));

  form.style.display = "none";
  thanksMessage.classList.add("show");
  setTimeout(() => {
    form.reset();
    form.style.display = "block";
    thanksMessage.classList.remove("show");
    submitBtn.disabled = false;
    submitBtn.innerHTML = original;
  }, 4800);
});

// Set current year
document.getElementById("year").textContent = new Date().getFullYear();

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (!href || href === "#") return; // allow non-anchors
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});
