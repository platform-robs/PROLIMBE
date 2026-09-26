import { getCart, updateCartItem, removeFromCart, cartTotal } from "./storage.js";

const root = document.querySelector("#cart-page");
render();

function render() {
  const cart = getCart();
  if (!cart.length) {
    root.innerHTML = `<div class="empty-state">Tu carrito está vacío. <a href="../index.html#catalogo">Seguir comprando</a></div>`;
    return;
  }
  root.innerHTML = `
    <div>
      ${cart.map(item => `
        <article class="cart-row">
          <strong>${escapeHtml(item.name)}</strong>
          <span>${escapeHtml(item.quantity || "")}</span>
          <input type="number" min="1" value="${item.units}" data-qty="${item.id}">
          <strong>$${money(item.price * item.units)}</strong>
          <button class="btn btn-secondary" data-remove="${item.id}">Eliminar</button>
        </article>`).join("")}
    </div>
    <div class="cart-summary">
      <h2>Total: $${money(cartTotal())} MXN</h2>
      <a class="btn btn-primary" href="checkout.html">Continuar compra</a>
    </div>`;

  root.querySelectorAll("[data-qty]").forEach(input => input.addEventListener("change", e => {
    updateCartItem(e.target.dataset.qty, Number(e.target.value));
    render();
  }));
  root.querySelectorAll("[data-remove]").forEach(btn => btn.addEventListener("click", () => {
    removeFromCart(btn.dataset.remove);
    render();
  }));
}
function money(value) { return new Intl.NumberFormat("es-MX", {minimumFractionDigits:2}).format(Number(value || 0)); }
function escapeHtml(value = "") { return String(value).replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;" }[c])); }
