export function openModal(content, title = "") {
  closeModal();
  const root = document.querySelector("#modal-root");
  if (!root) return;
  root.innerHTML = `
    <div class="modal-backdrop" data-modal-backdrop>
      <section class="modal" role="dialog" aria-modal="true" aria-label="${escapeHtml(title)}">
        <button class="modal-close" data-modal-close aria-label="Cerrar">×</button>
        ${title ? `<h2>${escapeHtml(title)}</h2>` : ""}
        <div>${content}</div>
      </section>
    </div>`;
  root.querySelector("[data-modal-close]").addEventListener("click", closeModal);
  root.querySelector("[data-modal-backdrop]").addEventListener("click", e => {
    if (e.target.dataset.modalBackdrop !== undefined) closeModal();
  });
}

export function closeModal() {
  const root = document.querySelector("#modal-root");
  if (root) root.innerHTML = "";
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[c]));
}
