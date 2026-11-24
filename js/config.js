/* finnish website settings.
   1) DOWNLOAD LINKS: paste each direct download link between the quotes. A button with an empty link
      shows "Download link coming soon" when tapped.
   (Mac and iPhone open the web version until the store links exist. Replace them with the store links later.)
   2) PRICES: one price per country on every platform. India is 25 a month and 200 a year.
   3) PRICES (continued): edit the amounts per country below (code: [country name, currency code, price per month]). */
window.FINNISH_CONFIG = {
  mobilePrices: {},
  // Annual plan: exact amounts per country where listed, otherwise monthly price x annualMultiple (rounded).
  annual: { mobile: { IN: 200 }, desktop: { IN: 200 } },
  annualMultiple: { mobile: 10, desktop: 10 },
  links: {
    android: "",
    ios: "https://nishanchel.github.io/Finnish/",
    windows: "",
    mac: "https://nishanchel.github.io/Finnish/",
    linux: ""
  },
  trialDays: 5,
  fallback: ["US", "International", "USD", 5],
  prices: {
    /* — home markets — */
    IN: ["India", "INR", 25],
    US: ["United States", "USD", 5],
    /* — higher-income markets (about US $5) — */
    GB: ["United Kingdom", "GBP", 5], CA: ["Canada", "CAD", 7], AU: ["Australia", "AUD", 8], NZ: ["New Zealand", "NZD", 8],
    IE: ["Ireland", "EUR", 5], DE: ["Germany", "EUR", 5], FR: ["France", "EUR", 5], ES: ["Spain", "EUR", 5], IT: ["Italy", "EUR", 5],
    NL: ["Netherlands", "EUR", 5], BE: ["Belgium", "EUR", 5], AT: ["Austria", "EUR", 5], FI: ["Finland", "EUR", 5], PT: ["Portugal", "EUR", 5],
    CH: ["Switzerland", "CHF", 5], NO: ["Norway", "NOK", 50], SE: ["Sweden", "SEK", 50], DK: ["Denmark", "DKK", 35],
    SG: ["Singapore", "SGD", 7], AE: ["United Arab Emirates", "AED", 19], JP: ["Japan", "JPY", 700], KR: ["South Korea", "KRW", 5900], IL: ["Israel", "ILS", 18],
    /* — middle-income markets (about US $3) — */
    SA: ["Saudi Arabia", "SAR", 12], PL: ["Poland", "PLN", 12], CZ: ["Czechia", "CZK", 69], HU: ["Hungary", "HUF", 1100], RO: ["Romania", "RON", 14],
    TR: ["Türkiye", "TRY", 99], BR: ["Brazil", "BRL", 15], MX: ["Mexico", "MXN", 59], CL: ["Chile", "CLP", 2900], CO: ["Colombia", "COP", 11900],
    MY: ["Malaysia", "MYR", 13], TH: ["Thailand", "THB", 99], ZA: ["South Africa", "ZAR", 49],
    /* — lower-income markets (about US $1.50) — */
    ID: ["Indonesia", "IDR", 25000], PH: ["Philippines", "PHP", 99], VN: ["Vietnam", "VND", 39000], EG: ["Egypt", "EGP", 79], NG: ["Nigeria", "NGN", 1900],
    KE: ["Kenya", "KES", 199], PK: ["Pakistan", "PKR", 399], BD: ["Bangladesh", "BDT", 169], LK: ["Sri Lanka", "LKR", 449], NP: ["Nepal", "NPR", 199]
  }
};
