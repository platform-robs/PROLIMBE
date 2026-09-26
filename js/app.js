import { loadComponent } from "./components.js";
import { updateCartBadge } from "./cart.js";
import { renderPromotions } from "./promotions.js";
import { initCatalog } from "./products.js";
import { renderFaq } from "./faq.js";
import { initContact } from "./contact.js";
import { initPrivacy } from "./privacy.js";

async function init() {
  await Promise.all([
    loadComponent("#site-header", "./components/header.html"),
    loadComponent("#site-footer", "./components/footer.html")
  ]);

  document.querySelector("#footer-year")?.append(new Date().getFullYear());
  updateCartBadge();
  window.addEventListener("cart:updated", updateCartBadge);

  try {
    await Promise.all([renderPromotions(), initCatalog(), renderFaq()]);
  } catch (error) {
    console.error(error);
    document.querySelector("#catalog-empty")?.classList.remove("hidden");
  }

  initContact();
  initPrivacy();
}
init();
