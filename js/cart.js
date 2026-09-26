import { cartCount } from "./storage.js";

export function updateCartBadge() {
  const el = document.querySelector("#cart-count");
  if (el) el.textContent = cartCount();
}
