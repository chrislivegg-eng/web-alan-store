const filters = document.querySelectorAll(".filter");
const productCards = document.querySelectorAll(".product-card");
const revealItems = document.querySelectorAll(".reveal");
const wholesaleForm = document.querySelector("#wholesale-form");
const folioCode = document.querySelector("#folio-code");
const folioSummary = document.querySelector("#folio-summary");
const folioWhatsapp = document.querySelector("#folio-whatsapp");

filters.forEach((filterButton) => {
  filterButton.addEventListener("click", () => {
    const selectedFilter = filterButton.dataset.filter;

    filters.forEach((button) => button.classList.remove("is-active"));
    filterButton.classList.add("is-active");

    productCards.forEach((card) => {
      const matches =
        selectedFilter === "todos" ||
        card.dataset.category === selectedFilter;

      card.classList.toggle("is-hidden", !matches);
    });
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.16,
    rootMargin: "0px 0px -40px 0px",
  }
);

revealItems.forEach((item) => {
  revealObserver.observe(item);
});

if (wholesaleForm && folioCode && folioSummary && folioWhatsapp) {
  wholesaleForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(wholesaleForm);
    const name = String(formData.get("name") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const type = String(formData.get("type") || "").trim();
    const quantity = String(formData.get("quantity") || "").trim();
    const notes = String(formData.get("notes") || "").trim();

    const now = new Date();
    const dateToken = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
    const randomToken = Math.floor(100 + Math.random() * 900);
    const folio = `MAY-${dateToken}-${randomToken}`;
    const whatsappMessage =
      `Hola, soy ${name || "un cliente mayorista"}.\n` +
      `Folio: ${folio}\n` +
      `Tipo de pedido: ${type || "No especificado"}\n` +
      `Cantidad estimada: ${quantity || "0"}\n` +
      `Telefono de contacto: ${phone || "No especificado"}\n` +
      `${notes ? `Comentarios: ${notes}\n` : ""}` +
      `Quiero informacion de mayoreo.`;

    folioCode.textContent = folio;
    folioSummary.textContent =
      `${name || "Prospecto"} solicito ${quantity || "0"} piezas de ${type || "producto"} ` +
      `con telefono ${phone || "sin telefono"}${notes ? `. Nota: ${notes}` : "."}`;

    folioWhatsapp.href = `https://wa.me/528100000000?text=${encodeURIComponent(whatsappMessage)}`;
    folioWhatsapp.classList.remove("is-disabled");
    folioWhatsapp.setAttribute("aria-disabled", "false");
  });
}
