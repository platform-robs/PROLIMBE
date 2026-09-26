const root = document.querySelector("#order-page");
const id = new URLSearchParams(location.search).get("id");

root.innerHTML = `
  <div class="section-heading">
    <span class="eyebrow">Prolimbe</span>
    <h1>Pedido recibido</h1>
    <p>Tu pedido <strong>${escapeHtml(id || "pendiente")}</strong> fue registrado.</p>
  </div>
  <a class="btn btn-primary" href="../index.html">Volver a la tienda</a>`;

function escapeHtml(value = "") { return String(value).replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;" }[c])); }
