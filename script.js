const CAL_USERNAME = "вероника-иорданова-rdlmso";
const DECORATION_MIN = 1;
const DECORATION_MAX = 5;
const DECORATION_EXTRA_MINUTES = 15;

function calUrl(slug) {
  return `https://cal.com/${CAL_USERNAME}/${slug}`;
}

// A "price" is always { min, max }. Fixed prices just have min === max.
function price(min, max) {
  return { min, max: max === undefined ? min : max };
}

function addDecoration(p) {
  return price(p.min + DECORATION_MIN, p.max + DECORATION_MAX);
}

function addMinutes(durationText, extraMinutes) {
  const baseMinutes = parseInt(durationText, 10);
  return `${baseMinutes + extraMinutes} мин.`;
}

// Every decorated variant (including Френски/Омбре, folded into the same
// category) adds 1-5 EUR and +15 minutes to the base service.
const services = [
  {
    category: "manicure",
    name: "Маникюр без лак",
    variants: [
      { label: null, duration: "30 мин.", price: price(10), calUrl: calUrl("m-no-polish") }
    ]
  },
  {
    category: "manicure",
    name: "Класически маникюр с гел лак",
    note: "Декорациите включват и френски/омбре ефект.",
    variants: [
      { label: "Без декорации", duration: "120 мин.", price: price(28), calUrl: calUrl("класически-маникюр-с-гел-лак") },
      { label: "Със декорации", duration: addMinutes("120 мин.", DECORATION_EXTRA_MINUTES), price: addDecoration(price(28)), calUrl: calUrl("класически-маникюр-с-гел-лак-и-декорации") }
    ]
  },
  {
    category: "manicure",
    name: "Маникюр с гел лак – каучукова база (къси нокти)",
    variants: [
      { label: "Без декорации", duration: "120 мин.", price: price(30), calUrl: calUrl("маникюр-с-гел-лак-изравняване-с-каучукова-база-къси-нокти") },
      { label: "Със декорации", duration: addMinutes("120 мин.", DECORATION_EXTRA_MINUTES), price: addDecoration(price(30)), calUrl: calUrl("маникюр-с-гел-лак-изравняване-с-каучукова-база-къси-нокти-декорации") }
    ]
  },
  {
    category: "manicure",
    name: "Маникюр с гел лак – каучукова база (дълги нокти)",
    variants: [
      { label: "Без декорации", duration: "150 мин.", price: price(40), calUrl: calUrl("маникюр-с-гел-лак-изравняване-с-каучукова-база-дълги-нокти") },
      { label: "Със декорации", duration: addMinutes("150 мин.", DECORATION_EXTRA_MINUTES), price: addDecoration(price(40)), calUrl: calUrl("маникюр-с-гел-лак-изравняване-с-каучукова-база-дълги-нокти-декорации") }
    ]
  },
  {
    category: "manicure",
    name: "Лепене / подложка от гел",
    variants: [
      { label: null, duration: "30 мин.", price: price(3), calUrl: calUrl("лепене-подложка-от-гел") }
    ]
  },
  {
    category: "manicure",
    name: "Изграждане на нокът",
    variants: [
      { label: null, duration: "30 мин.", price: price(5), calUrl: calUrl("изграждане-на-нокът") }
    ]
  },
  {
    category: "manicure",
    name: "Цялостно изграждане на нокти",
    variants: [
      { label: "Без декорации", duration: "150 мин.", price: price(60), calUrl: calUrl("цялостно-изграждане-на-нокти") },
      { label: "Със декорации", duration: addMinutes("150 мин.", DECORATION_EXTRA_MINUTES), price: addDecoration(price(60)), calUrl: calUrl("цялостно-изграждане-на-нокти-декорации") }
    ]
  },
  {
    category: "pedicure",
    name: "Педикюр без лак",
    variants: [
      { label: null, duration: "90 мин.", price: price(30), calUrl: calUrl("педикюр-без-лак") }
    ]
  },
  {
    category: "pedicure",
    name: "Педикюр с обикновен лак",
    variants: [
      { label: null, duration: "90 мин.", price: price(35), calUrl: calUrl("педикюр-с-обикновен-лак") }
    ]
  },
  {
    category: "pedicure",
    name: "Педикюр с гел лак",
    variants: [
      { label: null, duration: "120 мин.", price: price(40), calUrl: calUrl("педикюр-с-гел-лак") }
    ]
  },
  {
    category: "pedicure",
    name: "Частичен педикюр",
    variants: [
      { label: null, duration: "60 мин.", price: price(20), calUrl: calUrl("частичен-педикюр") }
    ]
  }
];

const categories = [
  { id: "manicure", label: "Маникюр" },
  { id: "pedicure", label: "Педикюр" }
];

const servicesPanel = document.getElementById("services-panel");
const calContainer = document.getElementById("cal-container");
const bookingTitle = document.getElementById("booking-title");
const bookingPrice = document.getElementById("booking-price");

let activeCategory = categories[0].id;
let expandedServiceIndex = null;

function formatPrice(p) {
  if (p.min === p.max) {
    return `${p.min.toFixed(2)} €`;
  }
  return `${p.min.toFixed(2)} – ${p.max.toFixed(2)} €`;
}

function earlyPrice(p) {
  return price(
    Math.round(p.min * 1.5 * 100) / 100,
    Math.round(p.max * 1.5 * 100) / 100
  );
}

function renderPanel() {
  const tabsHtml = categories
    .map(
      (cat) => `
        <button
          type="button"
          class="category-tab ${cat.id === activeCategory ? "active" : ""}"
          data-category="${cat.id}"
        >
          ${cat.label}
        </button>
      `
    )
    .join("");

  const rowsHtml = services
    .map((service, index) => {
      if (service.category !== activeCategory) {
        return "";
      }

      const hasVariants = service.variants.length > 1;
      const isExpanded = expandedServiceIndex === index;

      const displayPrice = hasVariants
        ? price(
            service.variants[0].price.min,
            service.variants[service.variants.length - 1].price.max
          )
        : service.variants[0].price;

      const displayDuration = hasVariants
        ? service.variants[0].duration
        : service.variants[0].duration;

      const chevron = hasVariants
        ? `<span class="service-row-chevron">›</span>`
        : "";

      const rowHtml = `
        <div
          class="service-row ${isExpanded ? "expanded" : ""}"
          data-service-index="${index}"
        >
          <div class="service-row-info">
            <span class="service-row-name">${service.name}</span>
            <span class="service-row-duration">${displayDuration}</span>
          </div>
          <div class="service-row-right">
            <span class="service-row-price">${formatPrice(displayPrice)}</span>
            ${chevron}
          </div>
        </div>
      `;

      if (!hasVariants || !isExpanded) {
        return rowHtml;
      }

      const pillsHtml = service.variants
        .map(
          (variant, variantIndex) => `
            <button
              type="button"
              class="variant-pill"
              data-service-index="${index}"
              data-variant-index="${variantIndex}"
            >
              <span>${variant.label} · ${variant.duration}</span>
              <span class="variant-pill-price">${formatPrice(variant.price)}</span>
            </button>
          `
        )
        .join("");

      const noteHtml = service.note
        ? `<p class="service-note">${service.note}</p>`
        : "";

      return `
        ${rowHtml}
        <div class="variant-panel">
          ${pillsHtml}
          ${noteHtml}
        </div>
      `;
    })
    .join("");

  servicesPanel.innerHTML = `
    <div class="category-tabs">${tabsHtml}</div>
    <div class="services-list" id="services-list">${rowsHtml}</div>
  `;
}

function openBooking(serviceIndex, variantIndex) {
  const service = services[serviceIndex];
  const variant = service.variants[variantIndex];

  const variantSuffix = variant.label ? ` – ${variant.label}` : "";
  bookingTitle.textContent = `${service.name}${variantSuffix}`;

  bookingPrice.innerHTML = `
    <span class="price-line-main">Редовна цена: <strong>${formatPrice(variant.price)}</strong>.</span>
    <span class="price-line-early">При начален час преди 10:00 ч.: <strong>${formatPrice(earlyPrice(variant.price))}</strong>.</span>
  `;

  const separator = variant.calUrl.includes("?") ? "&" : "?";
  const embedUrl = `${variant.calUrl}${separator}embed=true&theme=light`;

  calContainer.innerHTML = `
    <iframe
      class="cal-frame"
      src="${embedUrl}"
      title="Запазване на час за ${service.name}"
      loading="lazy"
      allow="payment"
    ></iframe>
  `;

  document
    .getElementById("booking")
    .scrollIntoView({ behavior: "smooth" });
}

servicesPanel.addEventListener("click", (event) => {
  const tabButton = event.target.closest(".category-tab");

  if (tabButton) {
    activeCategory = tabButton.dataset.category;
    expandedServiceIndex = null;
    renderPanel();
    return;
  }

  const variantPill = event.target.closest(".variant-pill");

  if (variantPill) {
    const serviceIndex = Number(variantPill.dataset.serviceIndex);
    const variantIndex = Number(variantPill.dataset.variantIndex);
    openBooking(serviceIndex, variantIndex);
    return;
  }

  const row = event.target.closest(".service-row");

  if (row) {
    const serviceIndex = Number(row.dataset.serviceIndex);
    const service = services[serviceIndex];

    if (service.variants.length > 1) {
      expandedServiceIndex =
        expandedServiceIndex === serviceIndex ? null : serviceIndex;
      renderPanel();
    } else {
      openBooking(serviceIndex, 0);
    }
  }
});

renderPanel();
