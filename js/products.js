import { api } from "./api.js";
import { addToCart } from "./storage.js";

let allProducts = [];
let activeCategory = "all";

export async function initCatalog() {
  const [categoryData, productData] = await Promise.all([
    api.getCategories(),
    api.getProducts("all")
  ]);
  renderCategories(categoryData.categories || []);
  allProducts = productData.products || [];
  bindFilters();
  renderProducts();
}

function renderCategories(categories) {
  const root = document.querySelector("#category-menu");
  root.innerHTML = [
    { id: "all", name: "Todos" },
    ...categories
  ].map(c => `<button class="category-card ${c.id === "all" ? "active" : ""}" data-category="${escapeHtml(c.id)}">${escapeHtml(c.name)}</button>`).join("");

  root.addEventListener("click", e => {
    const button = e.target.closest("[data-category]");
    if (!button) return;
    activeCategory = button.dataset.category;
    root.querySelectorAll(".category-card").forEach(x => x.classList.toggle("active", x === button));
    renderProducts();
  });
}

function bindFilters() {
  document.querySelector("#product-search")?.addEventListener("input", renderProducts);
  document.querySelector("#product-sort")?.addEventListener("change", renderProducts);
}

function renderProducts() {
  const query = document.querySelector("#product-search")?.value.trim().toLowerCase() || "";
  const sort = document.querySelector("#product-sort")?.value || "relevance";
  let products = allProducts.filter(p => {
    const categoryMatch = activeCategory === "all" || p.categoryId === activeCategory || (activeCategory === "mas-vendidos" && String(p.bestSeller).toUpperCase() === "SI");
    const text = `${p.name} ${p.description} ${p.sku}`.toLowerCase();
    return categoryMatch && text.includes(query) && String(p.active).toUpperCase() === "SI";
  });

  if (sort === "price-asc") products.sort((a,b) => Number(a.price)-Number(b.price));
  if (sort === "price-desc") products.sort((a,b) => Number(b.price)-Number(a.price));
  if (sort === "name") products.sort((a,b) => a.name.localeCompare(b.name));

  const root = document.querySelector("#product-grid");
  const empty = document.querySelector("#catalog-empty");
  empty.classList.toggle("hidden", products.length > 0);

  root.innerHTML = products.map(productCard).join("");
  root.querySelectorAll("[data-add]").forEach(btn => btn.addEventListener("click", () => {
    const product = allProducts.find(p => p.id === btn.dataset.add);
    addToCart(product);
    btn.textContent = "Agregado ✓";
    setTimeout(() => btn.textContent = "Agregar", 1200);
  }));
  root.querySelectorAll("[data-sheet]").forEach(btn => btn.addEventListener("click", () => {
    window.open(btn.dataset.sheet, "_blank", "noopener");
  }));
}

function productCard(p) {
  const imagePath = `./assets/products/${p.folder || "otros"}/${encodeURIComponent(p.image || "placeholder.webp")}`;
  const old = p.oldPrice && Number(p.oldPrice) > Number(p.price)
    ? `<span class="product-old-price">$${money(p.oldPrice)}</span>` : "";
  return `
    <article class="product-card">
      <div class="product-image-wrap">
        <img class="product-image" src="${imagePath}" alt="${escapeHtml(p.name)}" loading="lazy">
      </div>
      <div class="product-content">
        <span class="product-category">${escapeHtml(p.categoryName || "")}</span>
        <h3 class="product-name">${escapeHtml(p.name)}</h3>
        <span class="product-quantity">${escapeHtml(p.quantity || "")}</span>
        <p class="product-description">${escapeHtml(p.description || "")}</p>
        <div class="product-price">${old}$${money(p.price)}</div>
        <div class="product-actions">
          ${p.technicalSheetUrl ? `<button class="btn btn-secondary" data-sheet="${escapeAttr(p.technicalSheetUrl)}">Ficha técnica</button>` : `<span></span>`}
          <button class="btn btn-primary" data-add="${escapeAttr(p.id)}">Agregar</button>
        </div>
      </div>
    </article>`;
}

function money(value) {
  return new Intl.NumberFormat("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(value || 0));
}
function escapeHtml(value = "") { return String(value).replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;" }[c])); }
function escapeAttr(value = "") { return escapeHtml(value); }
