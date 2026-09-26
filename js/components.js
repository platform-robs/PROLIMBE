export async function loadComponent(selector, path) {
  const target = document.querySelector(selector);
  if (!target) return;
  const response = await fetch(path);
  if (!response.ok) throw new Error(`No se pudo cargar ${path}`);
  target.innerHTML = await response.text();
}
