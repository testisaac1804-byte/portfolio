// Renders the link ranking from the Worker's counter endpoint (/stats.json).
const summaryElement = document.querySelector("#stats-summary");
const listElement = document.querySelector("#stats-list");

function formatDate (value) {
  const date = new Date(value);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function addRow (link, index) {
  const row = document.createElement("li");

  const rank = document.createElement("span");
  rank.className = "rank";
  rank.textContent = "#" + (index + 1);

  const target = document.createElement("span");
  target.className = "target";
  // textContent, never innerHTML: the destination is data that came in over the network
  target.textContent = link.u;

  const count = document.createElement("span");
  count.className = "count";
  count.textContent = String(link.n);

  const meta = document.createElement("span");
  meta.className = "meta";
  meta.textContent = "last opened " + formatDate(link.last);

  row.append(rank, target, count, meta);
  return row;
}

async function load () {
  let data;
  try {
    const response = await fetch("/stats.json", { headers: { accept: "application/json" } });
    if (!response.ok) throw new Error("HTTP " + response.status);
    data = await response.json();
  } catch (error) {
    // the counter endpoints only ship with the analytics config, so a 404 here means
    // "not switched on yet" rather than something being broken
    summaryElement.textContent = error.message === "HTTP 404"
      ? "Stats are not switched on yet."
      : "Could not load stats: " + error.message;
    return;
  }

  const links = Array.isArray(data.links) ? data.links : [];
  if (links.length === 0) {
    summaryElement.textContent = "No links opened yet.";
    return;
  }
  const total = typeof data.total === "number" ? data.total : links.reduce((sum, l) => sum + l.n, 0);
  summaryElement.textContent =
    total + " open" + (total === 1 ? "" : "s") + " across " + links.length + " link" + (links.length === 1 ? "" : "s");

  listElement.replaceChildren(...links.map(addRow));
}

load();
