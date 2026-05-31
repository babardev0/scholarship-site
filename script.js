document.querySelectorAll(".copy-code").forEach((button) => {
  button.addEventListener("click", async () => {
    const code = button.dataset.code || "";
    let copied = false;
    try {
      await navigator.clipboard.writeText(code);
      copied = true;
    } catch {
      const field = document.createElement("textarea");
      field.value = code;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      copied = document.execCommand("copy");
      field.remove();
    }

    button.textContent = copied ? "Copied" : code;
    setTimeout(() => {
      button.textContent = "Copy";
    }, 1600);
  });
});

const revealItems = document.querySelectorAll(
  ".section-heading, .split > *, .browser-card, .benefit-list li, .steps article, .category-grid article, .trust-grid article, .wallet-card, .deal-card, .loan-card, .faq-list details, .final-cta"
);

if ("IntersectionObserver" in window) {
  revealItems.forEach((item, index) => {
    item.classList.add("reveal");
    item.style.transitionDelay = `${Math.min((index % 6) * 55, 275)}ms`;
  });
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealItems.forEach((item) => observer.observe(item));
}
