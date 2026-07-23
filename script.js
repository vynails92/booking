// ============================================================
// PRICES COME FROM A GOOGLE SHEET — see setup instructions.
// Replace the URL below with your own published sheet's CSV link.
// ============================================================
const PRICE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRWxbLidvgvW9AyvupoeJd7Y-Q6V2ojU-9dFG7wUX_zIp92CCXmajpJ0YO3Xzmn9uFvSXoNRJTWgSdN/pub?gid=0&single=true&output=csv";

const CAL_USERNAME = "вероника-иорданова-rdlmso";

function calUrl(slug) {
  return `https://cal.com/${CAL_USERNAME}/${slug}`;
}

// A "price" is always { min, max }. Fixed prices just have min === max.
function price(min, max) {
  const minNum = Number(min);
  const maxNum = max === undefined || max === "" ? minNum : Number(max);
  return { min: minNum, max: maxNum };
}

// Order below matches the order of events in the Cal.com dashboard.
const FALLBACK_SERVICES = [
  {
    category: "manicure",
    name: "Поддръжка на гел (под 30 дни)",
    note: "Декорация: +1–5 €. Френски/Омбре: +5 €.",
    variants: [
      { label: "Без декорации", duration: "150 мин.", price: price(45), calUrl: calUrl("поддръжка-на-гел-под-30-дни") },
      { label: "Със декорации", duration: "165 мин.", price: price(46, 50), calUrl: calUrl("поддръжка-на-гел-под-30-дни-декорации") },
      { label: "Френски/Омбре", duration: "165 мин.", price: price(50), calUrl: calUrl("поддръжка-на-гел-под-30-дни-френски-омбре-маникюр") }
    ]
  },
  {
    category: "manicure",
    name: "Цялостно изграждане на нокти с гел + гел лак",
    note: "Декорация: +1–5 €. Френски/Омбре: +5 €.",
    variants: [
      { label: "Без декорации", duration: "150 мин.", price: price(50, 60), calUrl: calUrl("цялостно-изграждане-на-нокти") },
      { label: "Със декорации", duration: "165 мин.", price: price(51, 65), calUrl: calUrl("цялостно-изграждане-на-нокти-декорации") },
      { label: "Френски/Омбре", duration: "165 мин.", price: price(55, 65), calUrl: calUrl("цялостно-изграждане-на-нокти-френски-омбре-маникюр") }
    ]
  },
  {
    category: "manicure",
    name: "Изграждане на нокът (1 бр.)",
    variants: [
      { label: null, duration: "30 мин.", price: price(5), calUrl: calUrl("изграждане-на-нокът") }
    ]
  },
  {
    category: "manicure",
    name: "Лепене / подложка от гел (1 бр.)",
    variants: [
      { label: null, duration: "30 мин.", price: price(3), calUrl: calUrl("лепене-подложка-от-гел") }
    ]
  },
  {
    category: "manicure",
    name: "Маникюр с гел лак – каучукова база (дълги нокти)",
    note: "Декорация: +1–5 €. Френски/Омбре: +5 €.",
    variants: [
      { label: "Без декорации", duration: "150 мин.", price: price(40), calUrl: calUrl("маникюр-с-гел-лак-изравняване-с-каучукова-база-дълги-нокти") },
      { label: "Със декорации", duration: "165 мин.", price: price(41, 45), calUrl: calUrl("маникюр-с-гел-лак-изравняване-с-каучукова-база-дълги-нокти-декорации") },
      { label: "Френски/Омбре", duration: "165 мин.", price: price(45), calUrl: calUrl("маникюр-с-гел-лак-изравняване-с-каучукова-база-дълги-нокти-френски-омбре-маникюр") }
    ]
  },
  {
    category: "manicure",
    name: "Маникюр с гел лак – каучукова база (къси нокти)",
    note: "Декорация: +1–5 €. Френски/Омбре: +5 €.",
    variants: [
      { label: "Без декорации", duration: "120 мин.", price: price(35), calUrl: calUrl("маникюр-с-гел-лак-изравняване-с-каучукова-база-къси-нокти") },
      { label: "Със декорации", duration: "135 мин.", price: price(36, 40), calUrl: calUrl("маникюр-с-гел-лак-изравняване-с-каучукова-база-къси-нокти-декорации") },
      { label: "Френски/Омбре", duration: "135 мин.", price: price(40), calUrl: calUrl("маникюр-с-гел-лак-изравняване-с-каучукова-база-къси-нокти-френски-омбре-маникюр") }
    ]
  },
  {
    category: "manicure",
    name: "Класически маникюр с гел лак (дълги нокти)",
    note: "Декорация: +1–5 €. Френски/Омбре: +5 €.",
    variants: [
      { label: "Без декорации", duration: "120 мин.", price: price(35), calUrl: calUrl("класически-маникюр-с-гел-лак-дълги-нокти") },
      { label: "Със декорации", duration: "120 мин.", price: price(36, 40), calUrl: calUrl("класически-маникюр-с-гел-лак-дълги-нокти-декорации") },
      { label: "Френски/Омбре", duration: "120 мин.", price: price(40), calUrl: calUrl("класически-маникюр-с-гел-лак-дълги-нокти-френски-омбре-маникюр") }
    ]
  },
  {
    category: "manicure",
    name: "Класически маникюр с гел лак (къси нокти)",
    note: "Декорация: +1–5 €. Френски/Омбре: +5 €.",
    variants: [
      { label: "Без декорации", duration: "120 мин.", price: price(30), calUrl: calUrl("класически-маникюр-с-гел-лак") },
      { label: "Със декорации", duration: "120 мин.", price: price(31, 35), calUrl: calUrl("класически-маникюр-с-гел-лак-и-декорации") },
      { label: "Френски/Омбре", duration: "120 мин.", price: price(35), calUrl: calUrl("класически-маникюр-с-гел-лак-къси-нокти-френски-омбре-маникюр") }
    ]
  },
  {
    category: "manicure",
    name: "Маникюр без лак",
    variants: [
      { label: null, duration: "30 мин.", price: price(12), calUrl: calUrl("m-no-polish") }
    ]
  },
  {
    category: "pedicure",
    name: "Частичен педикюр с гел лак",
    variants: [
      { label: null, duration: "60 мин.", price: price(25), calUrl: calUrl("частичен-педикюр") }
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
    name: "Педикюр с обикновен лак",
    variants: [
      { label: null, duration: "90 мин.", price: price(35), calUrl: calUrl("педикюр-с-обикновен-лак") }
    ]
  },
  {
    category: "pedicure",
    name: "Педикюр без лак",
    variants: [
      { label: null, duration: "90 мин.", price: price(30), calUrl: calUrl("педикюр-без-лак") }
    ]
  }
];

let services = FALLBACK_SERVICES;

// --- Minimal CSV parser (handles simple quoted fields, no external library needed) ---
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && next === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((r) => r.some((cell) => cell.trim() !== ""));
}

// Expected sheet columns (in this order):
// group, category, service_name, variant_label, duration, price_min, price_max, cal_slug, note
function buildServicesFromCsv(csvText) {
  const rows = parseCsv(csvText);
  const [header, ...dataRows] = rows;
  const col = (rowArr, name) => {
    const idx = header.findIndex((h) => h.trim().toLowerCase() === name);
    return idx === -1 ? "" : (rowArr[idx] || "").trim();
  };

  const groups = [];
  const groupIndex = {};

  dataRows.forEach((r) => {
    const groupKey = col(r, "group");
    if (!groupKey) return;

    const durationMinutes = col(r, "duration");
    const variant = {
      label: col(r, "variant_label") || null,
      duration: `${durationMinutes} мин.`,
      price: price(col(r, "price_min"), col(r, "price_max")),
      calUrl: calUrl(col(r, "cal_slug"))
    };

    if (groupIndex[groupKey] === undefined) {
      groupIndex[groupKey] = groups.length;
      groups.push({
        category: col(r, "category"),
        name: col(r, "service_name"),
        note: col(r, "note") || undefined,
        variants: [variant]
      });
    } else {
      const existing = groups[groupIndex[groupKey]];
      existing.variants.push(variant);
      if (!existing.note && col(r, "note")) {
        existing.note = col(r, "note");
      }
    }
  });

  return groups;
}

async function loadServicesFromSheet() {
  if (
    !PRICE_SHEET_CSV_URL ||
    PRICE_SHEET_CSV_URL === "PASTE_YOUR_PUBLISHED_SHEET_CSV_LINK_HERE"
  ) {
    return; // no sheet configured yet — keep using FALLBACK_SERVICES
  }

  try {
    const response = await fetch(PRICE_SHEET_CSV_URL, { cache: "no-store" });
    if (!response.ok) throw new Error("Sheet fetch failed");
    const csvText = await response.text();
    const parsed = buildServicesFromCsv(csvText);
    if (parsed.length > 0) {
      services = parsed;
    }
  } catch (err) {
    console.warn("Could not load prices from Google Sheet, using fallback data.", err);
  }
}

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
            Math.min(...service.variants.map((v) => v.price.min)),
            Math.max(...service.variants.map((v) => v.price.max))
          )
        : service.variants[0].price;

      const displayDuration = service.variants[0].duration;

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
    <span class="price-line-early">При начален час преди 10:00 ч. или след 18:00 ч.: <strong>${formatPrice(earlyPrice(variant.price))}</strong>.</span>
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

async function init() {
  renderPanel(); // show fallback data immediately, no flash of empty content
  await loadServicesFromSheet();
  renderPanel(); // re-render with live sheet data once it arrives
}

init();
