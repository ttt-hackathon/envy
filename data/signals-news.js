// Supplier, strike, port and trade news, saved by Claude after searching real sources.
// To refresh: ask Claude to "check the supplier and port news again".
// Every entry has real source links and a date. Nothing here is invented.
// Used by sections/news.js as window.LR_NEWS.
// "raises" lists the risk level each real finding suggests for a supplier; the risk section will use it.
window.LR_NEWS = {
  checkedAt: "2026-11-03",

  attention: [
    {
      id: "giant-wro",
      level: "AMBER",
      title: "US Customs order blocks imports from Giant's Taiwan factory (still in place at last report)",
      dateText: "Issued Sept 24, 2025. Latest update found: early 2026.",
      confidence: "news",
      suppliers: ["S04"],
      links: [
        { label: "Taipei Times, Sept 25, 2025", url: "https://www.taipeitimes.com/News/biz/archives/2025/09/25/2003844418" },
        { label: "Bicycle Retailer, Sept 24, 2025", url: "https://www.bicycleretailer.com/international/2025/09/24/us-customs-detaining-bikes-made-giant-over-forced-labor-allegations" },
        { label: "SGB Online, Giant's labor-reform update (Feb 2026)", url: "https://sgbonline.com/exec-giant-group-labor-reform-program-to-secure-cbp-work-release-order/" }
      ],
      what: "On Sept 24, 2025, US Customs and Border Protection issued a Withhold Release Order covering Taiwan-made Giant bicycles, parts and accessories, citing forced-labor concerns tied to Giant's Dajia plant in Taichung. Giant denies the allegations. It has filed a petition to have the order modified and has started labor reforms, and a customs meeting on March 5, 2026 was reported. I found no report that the order has been lifted, but I also could not find anything newer than early 2026.",
      why: "Our frames come from that same plant (Dajia, Taichung) and enter the US at Savannah. Giant is our only frame source on all three models, and cargo frames already run out about 15 days before the next delivery. Three frame orders are open (PO-26-1110, PO-26-1111, PO-26-1112). I could not confirm whether the order covers frames built to our design under our own contract, so this stays AMBER rather than RED.",
      todo: [
        "Ask Giant in writing today whether frames built for us at the Dajia plant are covered by the order, and whether any of our shipments have been held.",
        "Ask our customs broker whether anything of ours is held at Savannah, and what the order says about OEM goods.",
        "Ask Giant whether any of our frames could be built at a Giant plant outside Taiwan. Reports say the order does not appear to cover those.",
        "Becomes RED if the order is confirmed to cover our frames or any frame shipment is detained."
      ],
      escalatesTo: "RED",
      escalatesWhen: "the order is confirmed to cover our frames, or any frame shipment is detained",
      raises: [{ supplier: "S04", level: "AMBER" }]
    },
    {
      id: "german-ports",
      level: "YELLOW",
      title: "German port wage dispute: strikes in August and September, settlement reported but not confirmed",
      dateText: "Strikes Aug 17-18 and Sept 2-3, 2026; latest dated report Sept 27, 2026",
      confidence: "news",
      suppliers: ["S09", "S11", "S02"],
      links: [
        { label: "Maritime Executive: union rejects offer, strike vote", url: "https://maritime-executive.com/article/german-port-workers-reject-contract-and-move-to-strike-vote" },
        { label: "WSWS, Sept 27, 2026", url: "https://www.wsws.org/en/articles/2026/09/27/jicg-s27.pdf" },
        { label: "Container News: union accepts offer, indefinite strikes averted (undated)", url: "https://container-news.com/german-port-union-accepts-wage-offer-indefinite-strikes-averted/" }
      ],
      what: "Union ver.di held warning strikes at Hamburg, Bremerhaven and other German ports in August and early September. Dutch dockworkers struck at Rotterdam on Sept 4. Members rejected an employer offer and a strike vote closed Oct 1. One trade report says the union then accepted a 12-month offer, which would avert indefinite strikes, but that report is undated and says employer sign-off was still pending. I could not find a confirmed final agreement.",
      why: "Continental's tire order (PO-26-1160) is due to ship from Bremerhaven around Nov 10, and Busch & Muller's light order (PO-26-1175) from Hamburg around Nov 16. Bosch's current motor order already sailed on Oct 26, but its next orders will use Hamburg. Both parts have roughly 8 weeks of stock, so the exposure is small.",
      todo: [
        "Check ver.di or the employers' association (ZDS) for a signed agreement.",
        "Ask Continental and Busch & Muller to confirm their November sailings are on schedule.",
        "If strikes resume, check Hapag-Lloyd and other carrier advisories for the affected ports."
      ],
      raises: [{ supplier: "S09", level: "YELLOW" }, { supplier: "S11", level: "YELLOW" }]
    }
  ],

  context: [
    {
      title: "Fox Factory: aluminum constraints at auto customers, cost cuts and leadership change",
      dateText: "Q2 results call, Aug 6, 2026",
      confidence: "news",
      suppliers: ["S05"],
      links: [{ label: "MarketBeat, Q2 call highlights", url: "https://www.marketbeat.com/instant-alerts/fox-factory-q2-earnings-call-highlights-2026-08-06/" }],
      what: "Fox said aluminum supply remains a constraint on Ford F-150 production, a customer of its other business. Other coverage reports cost cuts and a CEO change. None of it says our Taiwan fork supply is affected.",
      note: "No effect on forks reported. Fox is already AMBER because of the 10-day fork gap."
    },
    {
      title: "Shimano: profit down about half in early 2026, blamed on tariffs and weak demand",
      dateText: "2026 first-quarter results",
      confidence: "news",
      suppliers: ["S06"],
      links: [{ label: "BikeTips", url: "https://biketips.com/shimano-2026-sales-drop-operating-income-tariffs/" }],
      what: "Operating income fell by roughly half year on year. I found no report of any shutdown or supply disruption at the Malaysia plant that makes our parts.",
      note: "Financial pressure only. No supply problem reported."
    },
    {
      title: "US dropped planned 50% steel and aluminum tariffs on bikes and frames; chains still covered",
      dateText: "April 2026",
      confidence: "news",
      suppliers: ["S04", "S07"],
      links: [{ label: "Washington Examiner", url: "https://www.washingtonexaminer.com/?p=4518818" }],
      what: "The administration backed off the 50% metals tariff on bicycles, e-bikes and frames, but some parts, including chains, remain subject to metals tariffs. I could not confirm current rates for Taiwan or China parts.",
      note: "Check USTR and CBP notices for the rates that apply to KMC chains and Bafang motors before costing orders."
    }
  ],

  // Supplier searches that turned up nothing that affects supply. News search only.
  nothingFound: [
    { id: "S01", note: "Cataloochee is a fictional test supplier, so there is no real news to find. Samsung SDI (its cell source) showed no disruption or recall in 2026 coverage, only new deals and plants." },
    { id: "S02", note: "No disruption found. Bosch is expanding Miskolc; no October 2026 coverage found." },
    { id: "S03", note: "No supply news found. Tariff coverage did not mention Bafang motors." },
    { id: "S07", note: "No 2026 news found." },
    { id: "S08", note: "No 2026 news found." },
    { id: "S10", note: "Only product news (new wheel lines). Nothing about supply." },
    { id: "S12", note: "No news found." },
    { id: "S13", note: "Not searched. Domestic catalog supplier with a 3-day lead time." }
  ],

  portsChecked: [
    { port: "Savannah, GA", note: "No strike or congestion found for November 2026. Older coverage (the 2024 dockworker strike, past congestion) does not apply." },
    { port: "Charleston, SC", note: "SC Ports' own newsroom (latest release Oct 27, 2026) shows no disruption. One website claimed a terminal pause in August; I could not confirm it, so it is not included." }
  ],

  limits: "This is a news search, not a complete scan. It can miss local-language news (Hungarian, Chinese, German, Italian) and anything from the last day or two. Single news reports are only watches until an official source or a second report confirms them."
};
