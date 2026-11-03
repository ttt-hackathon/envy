# Workshop house rules

- We are business people, not programmers. Explain what you're doing in plain English.
- These are real companies. Never invent an event or show sample alerts about them.
  Every warning needs a real source link and date. For test data, use only
  Cataloochee Cell Works.
- Never write our API key into any file. This repository is public.
- Everything must work with a double-click on index.html and also at our live link.
- When we say "save to GitHub", commit and push with a short note.
  When we say "get the latest", pull first.

## How our dashboard fits together

Our team builds ONE dashboard together. Each person owns one section of it.

- index.html is the dashboard: the page frame, the layout and an empty box for each
  section. Only the dashboard owner edits it.
- Each section lives in its own file in the sections folder, such as
  sections/weather.js. Only that section's owner edits it.
- A section file draws its content into the box on index.html with the same name.
  For example, sections/weather.js fills <div id="weather">. index.html loads every
  section with a line like <script src="sections/weather.js"></script>.
- If a section's box isn't on index.html yet, the section should still load
  without errors; it simply shows up once the dashboard owner adds the box.
- Our purchasing data is in data/laurel-ridge-data.js, available as
  window.LAUREL_RIDGE. index.html loads it before any section. Use it instead of
  reading the CSV files, so everything works with a double-click.
- Keep each section's styles inside its own file, with names that start with the
  section's name, so sections don't change each other's look.

## Our team's plan

One person builds everything, so one owner (Larry) for index.html and every section.
Build in the order below so something always works. Skip stretch goals until all
five are done; the map is the first one to add.

### What we're watching (warning signs)

1. Storms and quakes: typhoons, hurricanes, earthquakes, floods near supplier cities
   and ports (Taiwan, Savannah, Charleston, Hamburg, Rotterdam, Genoa).
2. Port and shipping trouble: congestion, closures, carrier cancellations.
3. Strikes: dockworkers, truckers, rail, plant workers.
4. Supplier trouble: fire, shutdown, recall, bankruptcy or financial news.
5. Trade and politics: tariffs, export limits, Taiwan Strait tension.
6. Our own data: stock that runs out before the next order arrives, slipped ship
   dates, lead times getting longer.
7. Cataloochee also: news on Samsung SDI (South Korea) cell supply and battery recalls.

The first build covers at least two real kinds: storms/quakes and supplier news.

### Sources, best first

1. Official forecasts: National Hurricane Center, National Weather Service,
   Taiwan Central Weather Administration, USGS, GDACS.
2. Port and carrier notices: Georgia Ports Authority, South Carolina Ports,
   Taichung, Kaohsiung, Hamburg, Rotterdam, Genoa; shipping-line advisories.
3. Government trade announcements (Federal Register, trade representative).
4. News searches by supplier name and city.
5. Company releases and filings.

An official source can trigger an alert alone. A single news report is only a
"watch" until a second or official source confirms it. Every item needs a real
source link and date. Drop items older than about 7 days.
Claude searches and saves findings to a data file the page reads (browsers block
most live fetches). To refresh: "check the sources again."

### Risk levels and alert rule

Seriousness = how bad the event is x how exposed we are. Exposed means: sole-source
part, stock runs out before the next order arrives, part goes into many bikes
(batteries and brakes go into all three), or on-time rate under about 90%.

- RED: confirmed event at the supplier's site, port or route AND the part is
  sole-source or already has a stock gap. Any serious confirmed event at Cataloochee
  is automatically red. Action: call the supplier today, ask for order status and
  expedite or air freight, tell production which models are at risk.
- AMBER: credible but unconfirmed warning, or a confirmed event with 8+ weeks of
  cover. Action: check order status within 48 hours, consider ordering earlier.
- YELLOW: early signs (forecast storm days out, rising lead time, slipped ship date).
  Watch only.
- GREEN: nothing found.

Starting red flags from our data (as of Nov 2, 2026): cargo frames (out ~Nov 23, next
arrival Dec 8), commuter frames (out ~Nov 30, arrival Dec 8), forks (out ~Dec 7,
arrival Dec 17), brakes and wheelsets (about 1 day of margin), batteries (3 weeks,
one supplier).

The alert email has: a subject like "[RED] Supplier: what happened"; what happened
(2 sentences, source link, date); what's at risk (parts, which bikes stop, when stock
runs out); what to do (2 or 3 steps); weekly revenue at risk from product prices.
Test alerts use Cataloochee Cell Works only.

### Dashboard sections (all owned by Larry; one file each in sections/)

Built in this order:

1. supplier-table: all 13 suppliers, risk level and plain-English why, with stock
   gaps from our own data. Box id: supplier-table.
2. weather: storms and quakes feed, each item with link, date, confidence.
3. news: supplier, strike and port news feed, each item with link, date, confidence.
4. risk: combines stock gaps and live warnings into each supplier's level.
5. alert: the red rule and the ready-to-send email for whichever supplier is red.

Plus a summary bar at the top of index.html (counts of red/amber/yellow and the most
urgent issue). Then save to GitHub and check the live link.
