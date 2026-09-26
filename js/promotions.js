import { api } from "./api.js";

export async function renderPromotions() {
  const root = document.querySelector("#promotion-carousel");
  if (!root) return;

  const { promotions = [] } = await api.getPromotions();
  const active = promotions.filter(p => String(p.active).toUpperCase() === "SI").slice(0, 5);

  if (!active.length) {
    root.innerHTML = "";
    return;
  }

  root.innerHTML = active.map((p, i) => `
    <article class="promo-slide" data-slide="${i}">
      <div class="promo-slide-inner">
        <div class="promo-copy">
          <span class="eyebrow">${escapeHtml(p.badge || "Promoción")}</span>
          <h2>${escapeHtml(p.title)}</h2>
          <p>${escapeHtml(p.subtitle || "")}</p>
          ${p.buttonText ? `<a class="btn btn-primary" href="${escapeAttr(p.action || "#catalogo")}">${escapeHtml(p.buttonText)}</a>` : ""}
        </div>
        ${p.image ? `<img class="promo-image" src="./assets/promotions/${encodeURIComponent(p.image)}" alt="${escapeHtml(p.title)}">` : ""}
      </div>
    </article>`).join("");

  let current = 0;
  const slides = [...root.querySelectorAll(".promo-slide")];
  const show = i => slides.forEach((s, idx) => s.style.display = idx === i ? "grid" : "none");
  show(0);
  if (slides.length > 1) setInterval(() => { current = (current + 1) % slides.length; show(current); }, 6000);
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;" }[c]));
}
function escapeAttr(value = "") { return escapeHtml(value); }
