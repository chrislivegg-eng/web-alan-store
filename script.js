const filters = document.querySelectorAll(".filter");
const productCards = document.querySelectorAll(".product-card");
const revealItems = document.querySelectorAll(".reveal");

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
