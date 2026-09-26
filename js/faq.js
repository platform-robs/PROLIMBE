import { api } from "./api.js";

export async function renderFaq() {
  const root = document.querySelector("#faq-list");
  if (!root) return;
  const { faq = [] } = await api.getFaq();
  root.innerHTML = faq.filter(x => String(x.active).toUpperCase() === "SI")
    .sort((a,b) => Number(a.order || 0) - Number(b.order || 0))
    .map((x, i) => `
      <article class="faq-item">
        <button class="faq-question" aria-expanded="false" data-faq="${i}">
          ${escapeHtml(x.question)} <span>+</span>
        </button>
        <div class="faq-answer" hidden>${escapeHtml(x.answer)}</div>
      </article>`).join("");

  root.addEventListener("click", e => {
    const btn = e.target.closest("[data-faq]");
    if (!btn) return;
    const answer = btn.nextElementSibling;
    const open = !answer.hidden;
    answer.hidden = open;
    btn.setAttribute("aria-expanded", String(!open));
    btn.querySelector("span").textContent = open ? "+" : "−";
  });
}

function escapeHtml(value = "") { return String(value).replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;" }[c])); }
