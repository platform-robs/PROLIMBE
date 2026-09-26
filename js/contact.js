import { CONFIG } from "./config.js";
import { api } from "./api.js";
import { openModal } from "./modal.js";

export function initContact() {
  document.querySelector("#whatsapp-button")?.addEventListener("click", () => {
    const message = encodeURIComponent("Hola, quiero información sobre los productos de Prolimbe.");
    window.open(`https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${message}`, "_blank", "noopener");
  });

  document.querySelector("#email-button")?.addEventListener("click", () => {
    openModal(`
      <form id="contact-form">
        <div class="form-grid">
          <label class="form-field"><span>Nombre</span><input name="name" required></label>
          <label class="form-field"><span>Teléfono</span><input name="phone" required></label>
          <label class="form-field"><span>Correo</span><input type="email" name="email" required></label>
          <label class="form-field"><span>Asunto</span><input name="subject" required></label>
          <label class="form-field full"><span>Mensaje</span><textarea name="message" rows="6" required></textarea></label>
        </div>
        <div class="form-actions"><button class="btn btn-primary">Enviar</button></div>
      </form>`, "Contacto por correo");

    document.querySelector("#contact-form")?.addEventListener("submit", async e => {
      e.preventDefault();
      const payload = Object.fromEntries(new FormData(e.currentTarget));
      await api.sendContact(payload);
      alert("Mensaje enviado. Gracias por contactarnos.");
    });
  });
}
