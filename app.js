const agents = [
  {
    id: "london",
    type: "branch",
    code: "NW - XF",
    area: "London / Harlesden Agent",
    business: "Alrayah Cargo",
    person: "Abu Rema",
    address: ["219A Cricklewood Broadway", "London", "NW2 3HP"],
    phones: ["+44 7449 794440", "+44 7707 600077"],
  },
  {
    id: "birmingham",
    type: "branch",
    code: "B - XU",
    area: "Birmingham",
    business: "Green Vally Grocery",
    person: "Kak Kozhir",
    address: ["221 Erdington High Street", "Birmingham", "B23 6SS"],
    phones: ["+44 7940 258238"],
  },
  {
    id: "bolton",
    type: "branch",
    code: "BL - XP",
    area: "Bolton",
    business: "New Start Market",
    person: "Kak Hemn",
    address: ["124 Bolton Road", "BL5 3DX"],
    phones: ["+44 7901 760837"],
  },
  {
    id: "brighton-eastbourne",
    type: "branch",
    code: "BN - XH",
    area: "Brighton / Eastbourne",
    business: "Eastbourne Collection Point",
    person: "Kak Dana",
    address: ["1 Broom Close", "Eastbourne", "BN22 0TQ"],
    phones: ["+44 7521 261763"],
  },
  {
    id: "oldham",
    type: "branch",
    code: "OL - XX",
    area: "Oldham",
    business: "Daryan Barber",
    person: "Kak Shadiar",
    address: ["764 Hollins Rd", "Oldham", "OL8 4SA"],
    phones: ["+44 7535 678084"],
  },
  {
    id: "glasgow",
    type: "branch",
    code: "G - XE",
    area: "Glasgow",
    business: "Parkhead Market",
    person: "Kak Mukhtar",
    address: ["90 Westmuir Street", "Glasgow", "G31 5BJ", "Scotland"],
    phones: ["+44 7380 904994"],
  },
  {
    id: "harrow",
    type: "branch",
    code: "HA - XC",
    area: "Harrow",
    business: "Amin Transport",
    person: "Abu Laith",
    address: ["95 Church Lane", "Harrow", "HA3 7EB"],
    phones: ["+44 7460 178987"],
  },

  {
    id: "leicester",
    type: "branch",
    code: "LE - XS",
    area: "Leicester",
    business: "Istanbul Barber",
    person: "Kak Aso",
    address: ["8 The Parade, Oadby", "Leicester", "LE2 5BF"],
    phones: ["+44 7397 270420"],
  },
  {
    id: "liverpool",
    type: "branch",
    code: "LV - XJ",
    area: "Liverpool",
    business: "Marmarise Supermarket",
    person: "Kak Taha",
    address: ["45-47 London Road", "Liverpool", "L3 8HY"],
    phones: ["+44 7830 646494"],
  },
  {
    id: "sheffield",
    type: "branch",
    code: "S - XV",
    area: "Sheffield",
    business: "Sheffield Collection Point",
    person: "Kak Zana",
    address: ["43 Roman Dale Gardens", "Sheffield", "S2 1DL"],
    phones: ["+44 7990 322232"],
  },
  {
    id: "swansea",
    type: "branch",
    code: "SA - XY",
    area: "Swansea",
    business: "International Food",
    person: "Kak Hevar",
    address: ["38, 39 St Helen's Rd", "Swansea", "SA1 4AY"],
    phones: ["+44 7777 462731"],
  },
  {
    id: "wakefield",
    type: "branch",
    code: "WF - XQ",
    area: "Wakefield",
    business: "Faper Cuts",
    person: "Kak Hogr",
    address: ["1-3 Providence St", "Wakefield", "WF1 3BD"],
    phones: ["+44 7747 831561"],
  },

  
];

const grid = document.querySelector("#agentGrid");
const template = document.querySelector("#agentCardTemplate");
const searchInput = document.querySelector("#agentSearch");
const resultCount = document.querySelector("#resultCount");
const emptyState = document.querySelector("#emptyState");
const filterTabs = document.querySelectorAll(".filter-tab");

let activeFilter = "all";

const normalizePhone = (phone) => phone.replace(/[^\d]/g, "");
const mapsUrl = (address) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address.join(", "))}`;
const imageDataUrlCache = new Map();

const searchableText = (agent) =>
  [
    agent.code,
    agent.area,
    agent.business,
    agent.person,
    agent.type,
    ...agent.address,
    ...agent.phones,
    ...agent.phones.map(normalizePhone),
  ]
    .join(" ")
    .toLowerCase();

const fileSafeName = (agent) =>
  `${agent.area}-${agent.person}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

function renderAgents() {
  const query = searchInput.value.trim().toLowerCase();
  const matches = agents.filter((agent) => {
    const filterMatch = activeFilter === "all" || agent.type === activeFilter;
    return filterMatch && searchableText(agent).includes(query);
  });

  grid.replaceChildren(...matches.map(createAgentCard));
  resultCount.textContent = matches.length.toString();
  emptyState.hidden = matches.length !== 0;
}

function createAgentCard(agent) {
  const card = template.content.firstElementChild.cloneNode(true);

  card.dataset.agentId = agent.id;
  card.querySelector(".area-code").textContent = agent.code;
  card.querySelector(".card-kind").textContent = agent.type === "warehouse" ? "Warehouse" : "Branch";
  card.querySelector("h3").textContent = agent.area;
  card.querySelector(".agent-place").textContent = agent.business;
  card.querySelector(".agent-person").textContent = agent.person;

  const addressLink = card.querySelector(".address-link");
  const mapLink = mapsUrl(agent.address);
  addressLink.href = mapLink;
  addressLink.setAttribute("aria-label", `Open ${agent.area} in Google Maps`);
  card.querySelector(".address-text").innerHTML = agent.address.map(escapeHtml).join("<br>");
  card.querySelector(".map-card").href = mapLink;

  const phoneList = card.querySelector(".phone-list");
  agent.phones.forEach((phone) => {
    const link = document.createElement("a");
    link.className = "phone-link";
    link.href = `https://wa.me/${normalizePhone(phone)}`;
    link.target = "_blank";
    link.rel = "noopener";
    link.setAttribute("aria-label", `WhatsApp ${agent.person} on ${phone}`);
    link.innerHTML = `<span class="whatsapp-icon" aria-hidden="true"></span><span>${phone}</span>`;
    phoneList.append(link);
  });

  if (agent.phones.length === 0) {
    const unavailable = document.createElement("div");
    unavailable.className = "phone-unavailable";
    unavailable.textContent = "Phone not listed in PDF";
    phoneList.append(unavailable);
  }

  card.querySelector(".save-card").addEventListener("click", () => saveCard(card, agent));

  return card;
}

async function saveCard(card, agent) {
  const button = card.querySelector(".save-card");
  const oldLabel = "Save JPG";
  button.disabled = true;
  button.textContent = "Saving...";
  let exportCard;

  try {
    if (!window.html2canvas) {
      throw new Error("html2canvas failed to load");
    }

    if (document.fonts?.ready) {
      await document.fonts.ready;
    }

    await Promise.all(
      [...card.querySelectorAll("img")].map((img) => {
        if (img.complete && img.naturalWidth > 0) {
          return img.decode ? img.decode().catch(() => undefined) : Promise.resolve();
        }
        return new Promise((resolve) => {
          img.addEventListener("load", resolve, { once: true });
          img.addEventListener("error", resolve, { once: true });
        });
      })
    );

    exportCard = card.cloneNode(true);
    exportCard.querySelector(".card-actions")?.remove();
    exportCard.classList.add("export-card");
    exportCard.style.width = `${card.getBoundingClientRect().width}px`;
    document.body.append(exportCard);
    await inlineExportImages(exportCard);

    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

    const exportScale = Math.min(Math.max(window.devicePixelRatio || 1, 3), 4);
    const canvas = await html2canvas(exportCard, {
      backgroundColor: "#07110e",
      scale: exportScale,
      logging: false,
      imageTimeout: 15000,
      removeContainer: true,
      useCORS: true,
      allowTaint: false,
    });

    await downloadCanvasAsJpg(canvas, `${fileSafeName(agent)}.jpg`);
  } catch (error) {
    console.error(error);
    window.alert(`Card could not be saved as JPG. ${error.message || "Please try again."}`);
  } finally {
    exportCard?.remove();
    button.disabled = false;
    button.innerHTML = `<span class="download-icon" aria-hidden="true"></span>${oldLabel}`;
  }
}

async function inlineExportImages(root) {
  await Promise.all(
    [...root.querySelectorAll("img")].map(async (img) => {
      const dataUrl = await imageToDataUrl(img);
      if (dataUrl) {
        img.src = dataUrl;
        await waitForImage(img);
      }
    })
  );
}

async function imageToDataUrl(img) {
  const src = img.currentSrc || img.src;
  if (!src || src.startsWith("data:")) return src;
  if (src.includes("iraq-logistics-logo") && window.ILS_LOGO_DATA_URL) {
    return window.ILS_LOGO_DATA_URL;
  }
  if (imageDataUrlCache.has(src)) return imageDataUrlCache.get(src);

  try {
    const response = await fetch(src, { cache: "force-cache" });
    if (!response.ok) throw new Error(`Image fetch failed: ${response.status}`);
    const blob = await response.blob();
    const dataUrl = await blobToDataUrl(blob);
    imageDataUrlCache.set(src, dataUrl);
    return dataUrl;
  } catch {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const dataUrl = canvas.toDataURL("image/png");
      imageDataUrlCache.set(src, dataUrl);
      return dataUrl;
    } catch {
      return "";
    }
  }
}

function waitForImage(img) {
  if (img.complete && img.naturalWidth > 0) {
    return img.decode ? img.decode().catch(() => undefined) : Promise.resolve();
  }
  return new Promise((resolve) => {
    img.addEventListener("load", resolve, { once: true });
    img.addEventListener("error", resolve, { once: true });
  });
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result));
    reader.addEventListener("error", reject);
    reader.readAsDataURL(blob);
  });
}

async function downloadCanvasAsJpg(canvas, filename) {
  const link = document.createElement("a");
  link.download = filename;

  if (canvas.toBlob && URL.createObjectURL) {
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.98));
    if (blob) {
      const objectUrl = URL.createObjectURL(blob);
      link.href = objectUrl;
      link.click();
      setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
      return;
    }
  }

  link.href = canvas.toDataURL("image/jpeg", 0.98);
  link.click();
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

searchInput.addEventListener("input", renderAgents);

filterTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    filterTabs.forEach((item) => item.classList.remove("active"));
    tab.classList.add("active");
    activeFilter = tab.dataset.filter;
    renderAgents();
  });
});

renderAgents();
