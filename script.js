const filters = document.querySelectorAll(".filter");
const productCards = document.querySelectorAll(".product-card");
const productCardToggles = document.querySelectorAll(".product-card__toggle");
const productCardPreviews = document.querySelectorAll(".product-card__preview");
const revealItems = document.querySelectorAll(".reveal");
const wholesaleForm = document.querySelector("#wholesale-form");
const folioCode = document.querySelector("#folio-code");
const folioSummary = document.querySelector("#folio-summary");
const folioWhatsapp = document.querySelector("#folio-whatsapp");
const closeOpenProductCards = (exceptionCard = null) => {
  productCards.forEach((card) => {
    if (card !== exceptionCard) {
      card.classList.remove("is-open");
    }
  });
};

const setupPreviewCarousel = (preview) => {
  const previewImages = Array.from(preview.querySelectorAll("img"));

  if (previewImages.length <= 1) {
    return;
  }

  const shell = document.createElement("div");
  shell.className = "product-card__preview-shell";

  const prevButton = document.createElement("button");
  prevButton.className = "product-card__carousel-button";
  prevButton.type = "button";
  prevButton.setAttribute("aria-label", "Imagen anterior");
  prevButton.textContent = "<";

  const nextButton = document.createElement("button");
  nextButton.className = "product-card__carousel-button";
  nextButton.type = "button";
  nextButton.setAttribute("aria-label", "Imagen siguiente");
  nextButton.textContent = ">";

  const viewport = document.createElement("div");
  viewport.className = "product-card__preview-viewport";

  const track = document.createElement("div");
  track.className = "product-card__preview-track";

  previewImages.forEach((image) => {
    track.appendChild(image);
  });

  viewport.appendChild(track);
  shell.append(prevButton, viewport, nextButton);
  preview.appendChild(shell);

  const dots = document.createElement("div");
  dots.className = "product-card__preview-dots";

  let currentIndex = 0;

  const dotButtons = previewImages.map((_, index) => {
    const dot = document.createElement("button");
    dot.className = "product-card__preview-dot";
    dot.type = "button";
    dot.setAttribute("aria-label", `Ir a imagen ${index + 1}`);
    dot.addEventListener("click", (event) => {
      event.preventDefault();
      currentIndex = index;
      updateCarousel();
    });
    dots.appendChild(dot);
    return dot;
  });

  preview.appendChild(dots);

  const updateCarousel = () => {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    prevButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex === previewImages.length - 1;

    dotButtons.forEach((dotButton, index) => {
      dotButton.classList.toggle("is-active", index === currentIndex);
    });
  };

  prevButton.addEventListener("click", (event) => {
    event.preventDefault();

    if (currentIndex > 0) {
      currentIndex -= 1;
      updateCarousel();
    }
  });

  nextButton.addEventListener("click", (event) => {
    event.preventDefault();

    if (currentIndex < previewImages.length - 1) {
      currentIndex += 1;
      updateCarousel();
    }
  });

  updateCarousel();
};

productCardPreviews.forEach(setupPreviewCarousel);

filters.forEach((filterButton) => {
  filterButton.addEventListener("click", () => {
    const selectedFilter = filterButton.dataset.filter;

    filters.forEach((button) => button.classList.remove("is-active"));
    filterButton.classList.add("is-active");
    closeOpenProductCards();

    productCards.forEach((card) => {
      const matches =
        selectedFilter === "todos" ||
        card.dataset.category === selectedFilter;

      card.classList.toggle("is-hidden", !matches);
    });
  });
});

productCardToggles.forEach((toggleButton) => {
  toggleButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    const card = toggleButton.closest(".product-card");

    if (!card) {
      return;
    }

    const willOpen = !card.classList.contains("is-open");
    closeOpenProductCards(card);

    card.classList.toggle("is-open", willOpen);
  });
});

productCards.forEach((card) => {
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      if (event.target.closest("a, button")) {
        return;
      }

      event.preventDefault();
      const willOpen = !card.classList.contains("is-open");
      closeOpenProductCards(card);
      card.classList.toggle("is-open", willOpen);
    }
  });
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".product-card")) {
    closeOpenProductCards();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeOpenProductCards();
  }
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
