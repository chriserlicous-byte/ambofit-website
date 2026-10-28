// Preise in der Währung des Besuchers: Euro in Euro-Ländern, britisches Pfund im Vereinigten Königreich, sonst
// US-Dollar. Erkannt an der Zeitzone des Browsers (bei UTC an der Sprache, z. B. „en-GB“). Läuft nur im Browser,
// speichert nichts und sendet nichts. Ohne Skript bleiben die Euro-Preise aus dem HTML stehen.
// Preise wie in App Store Connect (docs/technik-und-mvp.md, Phase 6); „save“ wie in der App kaufmännisch gerundet.
(() => {
  const prices = {
    GBP: {
      from: "£2.50", note: "Prices in pounds including VAT.",
      "basic-month": "£3.99", "basic-year": "£29.99", "basic-year-month": "£2.50", "basic-save": "save 37 %",
      "pro-month": "£8.99", "pro-year": "£49.99", "pro-year-month": "£4.17", "pro-save": "save 54 %",
    },
    USD: {
      from: "$3.00", note: "Prices in US dollars, plus tax where applicable.",
      "basic-month": "$4.99", "basic-year": "$35.99", "basic-year-month": "$3.00", "basic-save": "save 40 %",
      "pro-month": "$9.99", "pro-year": "$59.99", "pro-year-month": "$5.00", "pro-save": "save 50 %",
    },
  };

  // Euro-Länder (seit 2026 mit Bulgarien) und Gebiete mit Euro, mit ihren Zeitzonen.
  const euroZones = new Set([
    "Europe/Vienna", "Europe/Brussels", "Europe/Sofia", "Europe/Zagreb", "Asia/Nicosia", "Asia/Famagusta",
    "Europe/Nicosia", "Europe/Tallinn", "Europe/Helsinki", "Europe/Mariehamn", "Europe/Paris", "Europe/Berlin",
    "Europe/Busingen", "Europe/Athens", "Europe/Dublin", "Europe/Rome", "Europe/Riga", "Europe/Vilnius",
    "Europe/Luxembourg", "Europe/Malta", "Europe/Amsterdam", "Europe/Lisbon", "Atlantic/Azores", "Atlantic/Madeira",
    "Europe/Bratislava", "Europe/Ljubljana", "Europe/Madrid", "Africa/Ceuta", "Atlantic/Canary", "Europe/Andorra",
    "Europe/Monaco", "Europe/San_Marino", "Europe/Vatican", "Europe/Podgorica", "America/Guadeloupe",
    "America/Martinique", "America/Cayenne", "Indian/Reunion", "Indian/Mayotte", "America/St_Barthelemy",
    "America/Marigot", "America/Miquelon",
  ]);
  const poundZones = new Set([
    "Europe/London", "Europe/Belfast", "Europe/Guernsey", "Europe/Jersey", "Europe/Isle_of_Man", "Europe/Gibraltar",
  ]);
  const euroRegions = new Set([
    "AT", "BE", "BG", "HR", "CY", "EE", "FI", "FR", "DE", "GR", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PT", "SK",
    "SI", "ES", "AD", "MC", "SM", "VA", "ME", "XK",
  ]);

  let zone = "";
  try { zone = Intl.DateTimeFormat().resolvedOptions().timeZone || ""; } catch (error) { zone = ""; }
  const language = (navigator.languages && navigator.languages[0]) || navigator.language || "";
  const region = (language.split("-").slice(1).find((part) => /^[A-Za-z]{2}$/.test(part)) || "").toUpperCase();

  let currency;
  if (euroZones.has(zone)) currency = "EUR";
  else if (poundZones.has(zone)) currency = "GBP";
  else if (zone && !/^(UTC|GMT|Etc\/)/.test(zone)) currency = "USD";
  else currency = euroRegions.has(region) ? "EUR" : region === "GB" ? "GBP" : "USD";

  document.documentElement.dataset.currency = currency;
  const table = prices[currency];
  if (!table) return; // Euro steht schon im HTML.
  document.querySelectorAll("[data-price]").forEach((element) => {
    const value = table[element.dataset.price];
    if (value) element.textContent = value;
  });
})();
