import { openModal } from "./modal.js";

export function initPrivacy() {
  document.querySelector("#privacy-button")?.addEventListener("click", async () => {
    const response = await fetch("./legal/politica-privacidad.md");
    const text = await response.text();
    openModal(`<pre style="white-space:pre-wrap;font-family:inherit">${escapeHtml(text)}</pre>`, "Política de privacidad");
  });
}
function escapeHtml(value = "") { return String(value).replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;" }[c])); }
