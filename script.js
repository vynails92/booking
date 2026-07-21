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

// Order: bottom of the Cal.com list to top, as requested.
// Services that had a separate "+ декорации" event type on Cal.com are
// merged into ONE card with a toggle: "Без декорации" / "Със декорации".
// Every decorated variant (including Френски/Омбре, folded into the same
// category) adds 1-5 EUR and +15 minutes to the base service.
const services = [
  {
    name: "Маникюр без лак",
    description: "Оформяне на нокти и кутикула, без лак.",
    variants: [
      { label: null, duration: "30 мин.", price: price(10), calUrl: calUrl("m-no-polish") }
    ]
  },
  {
    name: "Класически маникюр с гел лак",
    description: "Класически маникюр с покритие с гел лак.",
    note: "Декорациите включват и френски/омбре ефект — изберете „Със декорации“ за тях.",
    variants: [
      { label: "Без декорации", duration: "120 мин.", price: price(28), calUrl: calUrl("класически-маникюр-с-гел-лак") },
      { label: "Със декорации", duration: addMinutes("120 мин.", DECORATION_EXTRA_MINUTES), price: addDecoration(price(28)), calUrl: calUrl("класически-маникюр-с-гел-лак-и-декорации") }
    ]
  },
  {
    name: "Маникюр с гел лак — изравняване с каучукова база (къси нокти)",
    description: "Изравняване на нокътната плочка с каучукова база и гел лак.",
    variants: [
      { label: "Без декорации", duration: "120 мин.", price: price(30), calUrl: calUrl("маникюр-с-гел-лак-изравняване-с-каучукова-база-къси-нокти") },
      { label: "Със декорации", duration: addMinutes("120 мин.", DECORATION_EXTRA_MINUTES), price: addDecoration(price(30)), calUrl: calUrl("маникюр-с-гел-лак-изравняване-с-каучукова-база-къси-нокти-декорации") }
    ]
  },
  {
    name: "Маникюр с гел лак — изравняване с каучукова база (дълги нокти)",
    description: "Изравняване на нокътната плочка с каучукова база и гел лак.",
    variants: [
      { label: "Без декорации", duration: "150 мин.", price: price(40), calUrl: calUrl("маникюр-с-гел-лак-изравняване-с-каучукова-база-дълги-нокти") },
      { label: "Със декорации", duration: addMinutes("150 мин.", DECORATION_EXTRA_MINUTES), price: addDecoration(price(40)), calUrl: calUrl("маникюр-с-гел-лак-изравняване-с-каучукова-база-дълги-нокти-декорации") }
    ]
  },
  {
    name: "Лепене / подложка от гел",
    description: "Лепене на нокти или подложка от гел.",
    variants: [
      { label: null, duration: "30 мин.", price: price(3), calUrl: calUrl("лепене-подложка-от-гел") }
    ]
  },
  {
    name: "Изграждане на нокът",
    description: "Изграждане на единичен счупен или увреден нокът.",
    variants: [
      { label: null, duration: "30 мин.", price: price(5), calUrl: calUrl("изграждане-на-нокът") }
    ]
  },
  {
    name: "Цялостно изграждане на нокти",
    description: "Пълно изграждане на нокти с гел.",
    variants: [
      { label: "Без декорации", duration: "150 мин.", price: price(60), calUrl: calUrl("цялостно-изграждане-на-нокти") },
      { label: "Със декорации", duration: addMinutes("150 мин.", DECORATION_EXTRA_MINUTES), price: addDecoration(price(60)), calUrl: calUrl("цялостно-изграждане-на-нокти-декорации") }
    ]
  },
  {
    name: "Педикюр без лак",
    description: "Оформяне на нокти и грижа за ходилата, без лак.",
    variants: [
      { label: null, duration: "90 мин.", price: price(30), calUrl: calUrl("педикюр-без-лак") }
    ]
  },
  {
    name: "Педикюр с обикновен лак",
    description: "Педикюр с покритие с обикновен лак.",
    variants: [
      { label: null, duration: "90 мин.", price: price(35), calUrl: calUrl("педикюр-с-обикновен-лак") }
    ]
  },
  {
    name: "Педикюр с гел лак",
    description: "Педикюр с дълготрайно покритие с гел лак.",
    variants: [
      { label: null, duration: "120 мин.", price: price(40), calUrl: calUrl("педикюр-с-гел-лак") }
    ]
  },
  {
    name: "Частичен педикюр",
    description: "Освежаване и оформяне без цялостна процедура.",
    variants: [
      { label: null, duration: "60 мин.", price: price(20), calUrl: calUrl("частичен-педикюр") }
    ]
  }
];

const servicesGrid = document.getElementById("services-grid");
const calContainer = document.getElementById("cal-container");
const bookingTitle = document.getElementById("booking-title");
const bookingPrice = document.getElementById("booking-price");

// Tracks which variant (0 or 1) is currently selected per service index.
const selectedVariant = services.map(() => 0);

function formatPrice(p) {
  if (p.min === p.max) {
    return `${p.min.toFixed(2)} €`;
  }
  return `${p.min.toFixed(2)} – ${p.max.toFixed(2)} €`;
}

function earlyPrice(p) {
  return price(Math.round(p.min * 1.5 * 100) / 100, Math.round(p.max * 1.5 * 100) / 100);
}

function renderServices() {
  servicesGrid.innerHTML = services
    .map((service, index) => {
      const variantIndex = selectedVariant[index];
      const variant = service.variants[variantIndex];

      const toggleHtml =
        service.variants.length > 1
          ? `
            <div class="variant-toggle" data-service-index="${index}">
              ${service.variants
                .map(
                  (v, vIndex) => `
                    <button
                      type="button"
                      class="variant-button ${vIndex === variantIndex ? "active" : ""}"
                      data-variant-index="${vIndex}"
                    >
                      ${v.label}
                    </button>
                  `
                )
                .join("")}
            </div>
          `
          : "";

      const noteHtml = service.note
        ? `<p class="service-note">${service.note}</p>`
        : "";

      return `
        <article class="service-card">
          <h3>${service.name}</h3>

          <p class="service-description">
            ${service.description}
          </p>

          ${toggleHtml}

          <div class="service-meta">
            <span>${variant.duration}</span>
            <span>${formatPrice(variant.price)}</span>
          </div>

          <button
            class="book-button"
            type="button"
            data-service-index="${index}"
          >
            Изберете час
          </button>

          <div class="early-notice">
            При начален час преди 10:00 ч.:
            <strong>${formatPrice(earlyPrice(variant.price))}</strong>
          </div>

          ${noteHtml}
        </article>
      `;
    })
    .join("");
}

function openBooking(serviceIndex) {
  const service = services[serviceIndex];
  const variant = service.variants[selectedVariant[serviceIndex]];

  const variantSuffix = variant.label ? ` — ${variant.label}` : "";
  bookingTitle.textContent = `${service.name}${variantSuffix}`;

  bookingPrice.innerHTML = `
    Редовна цена:
    <strong>${formatPrice(variant.price)}</strong>.
    При начален час преди 10:00 ч.:
    <strong>${formatPrice(earlyPrice(variant.price))}</strong>.
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

servicesGrid.addEventListener("click", (event) => {
  const variantButton = event.target.closest(".variant-button");

  if (variantButton) {
    const toggle = variantButton.closest(".variant-toggle");
    const serviceIndex = Number(toggle.dataset.serviceIndex);
    const variantIndex = Number(variantButton.dataset.variantIndex);

    selectedVariant[serviceIndex] = variantIndex;
    renderServices();
    return;
  }

  const bookButton = event.target.closest(".book-button");

  if (bookButton) {
    const serviceIndex = Number(bookButton.dataset.serviceIndex);
    openBooking(serviceIndex);
  }
});

renderServices();
