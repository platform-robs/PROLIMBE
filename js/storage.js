const CART_KEY = "prolimbe_cart_v1";

export function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY) || "[]"); }
  catch { return []; }
}

export function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new CustomEvent("cart:updated"));
}

export function clearCart() { saveCart([]); }

export function addToCart(product, quantity = 1) {
  const cart = getCart();
  const existing = cart.find(item => item.id === product.id);
  if (existing) existing.quantity += quantity;
  else cart.push({
    id: product.id,
    sku: product.sku,
    name: product.name,
    quantity: product.quantity,
    price: Number(product.price),
    image: product.image,
    units: quantity
  });
  saveCart(cart);
}

export function updateCartItem(id, units) {
  const cart = getCart();
  const item = cart.find(x => x.id === id);
  if (!item) return;
  if (units <= 0) saveCart(cart.filter(x => x.id !== id));
  else { item.units = units; saveCart(cart); }
}

export function removeFromCart(id) { saveCart(getCart().filter(x => x.id !== id)); }

export function cartTotal() {
  return getCart().reduce((sum, item) => sum + item.price * item.units, 0);
}

export function cartCount() {
  return getCart().reduce((sum, item) => sum + item.units, 0);
}
