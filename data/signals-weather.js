// Storm and quake findings, saved by Claude after checking real sources.
// To refresh: ask Claude to "check the storm and quake sources again".
// Every entry has a real source link and date. Nothing here is invented.
// Used by sections/weather.js as window.LR_WEATHER.
window.LR_WEATHER = {
  checkedAt: "2026-11-03",

  // What we looked at, and what it said. "official" sources can trigger an alert on their own;
  // "news" is only a watch until an official source or a second report confirms it.
  checks: [
    {
      area: "US Southeast coast (Savannah and Charleston ports)",
      source: "National Hurricane Center, Atlantic outlook",
      confidence: "official",
      date: "2026-11-03",
      link: "https://www.nhc.noaa.gov/gtwo.php?basin=atlc&fdays=7",
      result: "Nothing threatening. One weak low may form near Bermuda (20% in 48 hours, 40% in 7 days), well offshore. The outlook mentions no threat to Georgia or South Carolina.",
      status: "clear",
      suppliers: ["S03", "S04", "S05", "S06", "S07", "S08", "S02", "S09", "S10", "S11", "S12"]
    },
    {
      area: "Savannah, GA",
      source: "National Weather Service active alerts",
      confidence: "official",
      date: "2026-11-03",
      link: "https://api.weather.gov/alerts/active?point=32.08,-81.09",
      result: "No active watches, warnings or advisories.",
      status: "clear",
      suppliers: ["S03", "S04", "S05", "S06", "S07", "S08"]
    },
    {
      area: "Charleston, SC",
      source: "National Weather Service active alerts",
      confidence: "official",
      date: "2026-11-03",
      link: "https://api.weather.gov/alerts/active?point=32.78,-79.93",
      result: "No active watches, warnings or advisories.",
      status: "clear",
      suppliers: ["S02", "S09", "S10", "S11", "S12"]
    },
    {
      area: "Taiwan (Taichung, Tainan, Kaohsiung)",
      source: "USGS earthquake catalog, magnitude 5 or higher",
      confidence: "official",
      date: "2026-11-03",
      link: "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minmagnitude=5&starttime=2026-10-27&endtime=2026-11-04&minlatitude=20&maxlatitude=28&minlongitude=118&maxlongitude=126",
      result: "No earthquakes of magnitude 5 or higher in the area around Taiwan from Oct 27 to Nov 3.",
      status: "clear",
      suppliers: ["S04", "S05", "S07", "S08"]
    },
    {
      area: "Taiwan typhoons",
      source: "News search (Taiwan's Central Weather Administration not checked directly)",
      confidence: "news",
      date: "2026-11-03",
      link: "https://focustaiwan.tw/society/202610210017",
      result: "No typhoon warning for November found. The latest storm was Champi in late October (see below). Check the Central Weather Administration directly before relying on this.",
      status: "partial",
      suppliers: ["S04", "S05", "S07", "S08"]
    },
    {
      area: "Worldwide disaster alerts",
      source: "GDACS (UN/EU disaster alert system)",
      confidence: "official",
      date: "2026-11-03",
      link: "https://www.gdacs.org/",
      result: "Only the first part of the feed was read. In that part, nothing involved our supplier countries except two minor (Green) forest-fire notices in China dated Oct 31. A magnitude 6 quake in Japan on Oct 31 was deep (352 km) and Green. Our Japan link is Shimano's headquarters, but our parts ship from Malaysia.",
      status: "partial",
      suppliers: []
    },
    {
      area: "Hungary, Germany, Switzerland, Italy (European suppliers)",
      source: "News search (national weather services not checked directly)",
      confidence: "news",
      date: "2026-11-03",
      link: "https://www.meteoalarm.org/",
      result: "No current severe-weather warnings found for these countries. The search results were mostly older or low-quality, so this is not confirmed. MeteoAlarm and the national services (DWD, MeteoSwiss, OMSZ) should be checked directly.",
      status: "partial",
      suppliers: ["S02", "S09", "S10", "S11", "S12"]
    }
  ],

  // Real recent events. These are older than the 7-day rule, so they give context
  // and do NOT raise any supplier's risk level on their own.
  recent: [
    {
      title: "Super Typhoon Champi swept past Taiwan's northeast",
      date: "2026-10-24",
      confidence: "news",
      link: "https://www.thestar.com.my/aseanplus/aseanplus-news/2026/10/24/precautions-taken-as-champi-sweeps-by-island",
      what: "Taiwan closed offices and schools in Taipei and cancelled 931 flights. One person died and 94 were injured. About 1,300 people were evacuated from mountains. West-coast high-speed rail kept running. The storm stayed offshore and weakened from 298 to about 155 km/h. The report says nothing about the ports of Taichung or Kaohsiung or about factories.",
      suppliers: ["S04", "S05", "S07", "S08"],
      note: "No port or factory disruption was reported in what we found. Several of our Taiwan orders are at sea or about to ship, so ask Giant, Fox, Tektro and KMC to confirm their sailings did not slip."
    },
    {
      title: "Typhoon Champi expected to worsen port congestion in China",
      date: "2026-10-21",
      confidence: "news",
      link: "https://www.spglobal.com/energy/en/news-research/latest-news/shipping/102126-super-typhoon-champi-raises-china-port-congestion-concerns",
      what: "S&P Global reported that market participants saw delays of about 4 days at Shanghai and Ningbo before the storm and expected them to worsen afterward.",
      suppliers: ["S03"],
      note: "Single news report, not confirmed by a port notice. Bafang ships from Shanghai. Its two open orders (PO-26-1098 and PO-26-1099) were due to ship Oct 20, so ask Bafang or its forwarder to confirm the vessel left."
    }
  ]
};
