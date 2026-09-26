import { getCart, cartTotal, clearCart } from "./storage.js";
import { api } from "./api.js";

const root = document.querySelector("#checkout-page");

if (root) {
  const cart = getCart();
  if (!cart.length) {
    root.innerHTML = `<div class="empty-state">Tu carrito está vacío. <a href="../index.html#catalogo">Ver productos</a></div>`;
  } else {
    root.innerHTML = `
      <form id="checkout-form">
        <div class="form-grid">
          <label class="form-field"><span>Nombre completo</span><input name="name" required></label>
          <label class="form-field"><span>Teléfono</span><input name="phone" required></label>
          <label class="form-field"><span>Correo</span><input name="email" type="email" required></label>
          <label class="form-field"><span>Entrega</span><select name="delivery"><option>Entrega local</option><option>Envío</option><option>Recoger</option></select></label>
          <label class="form-field full"><span>Dirección / indicaciones</span><textarea name="address" rows="3"></textarea></label>
          <label class="form-field full"><span>¿Requieres factura?</span><select name="requiresInvoice" id="requires-invoice"><option value="NO">No</option><option value="SI">Sí</option></select></label>
        </div>
        <div id="billing-area" class="hidden"></div>
        <hr>
        <h3>Total: $${money(cartTotal())} MXN</h3>
        <button class="btn btn-primary" type="submit">Continuar al pago</button>
      </form>`;

    document.querySelector("#requires-invoice").addEventListener("change", e => {
      document.querySelector("#billing-area").classList.toggle("hidden", e.target.value !== "SI");
      if (e.target.value === "SI") renderBilling();
    });

    document.querySelector("#checkout-form").addEventListener("submit", submitOrder);
  }
}

function renderBilling() {
  document.querySelector("#billing-area").innerHTML = `
    <div class="form-grid">
      <label class="form-field full"><span>Correo de consulta fiscal</span><input name="billingEmail" form="checkout-form" type="email"></label>
      <label class="form-field"><span>Razón social / nombre</span><input name="legalName" form="checkout-form"></label>
      <label class="form-field"><span>RFC</span><input name="rfc" form="checkout-form"></label>
      <label class="form-field"><span>Régimen fiscal</span><input name="taxRegime" form="checkout-form"></label>
      <label class="form-field"><span>Código postal fiscal</span><input name="taxZip" form="checkout-form"></label>
      <label class="form-field"><span>Uso CFDI</span><input name="cfdiUse" form="checkout-form"></label>
    </div>`;
}

async function submitOrder(e) {
  e.preventDefault();
  const form = new FormData(e.currentTarget);
  const order = Object.fromEntries(form);
  order.items = getCart();
  order.total = cartTotal();

  const result = await api.createOrder(order);
  if (result.paymentUrl) window.location.href = result.paymentUrl;
  else {
    clearCart();
    window.location.href = `pedido.html?id=${encodeURIComponent(result.orderId)}`;
  }
}

function money(value) { return new Intl.NumberFormat("es-MX", {minimumFractionDigits:2}).format(Number(value || 0)); }
