// ---- Data structures ----
const pq = new PriorityQueue(["Emergency", "Senior", "Normal"]); // priority queue
const undoStack = new Stack();                                    // undo stack
const PREFIX = { Emergency: "E", Senior: "S", Normal: "N" };
const counters = { E: 0, S: 0, N: 0 };
let nowServing = null, served = [];

const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const findInQ = token => {
  for (const c of pq.levels) {
    const i = pq.queues[c].items.findIndex(p => p.token === token);
    if (i >= 0) return { q: pq.queues[c], i, p: pq.queues[c].items[i] };
  }
};
const toast = msg => { $("toast").textContent = msg; };

// ---- Actions ----
function register(e) {
  e.preventDefault();
  const category = document.querySelector('input[name="cat"]:checked').value, k = PREFIX[category];
  counters[k]++;
  const p = {
    token: k + "-" + String(counters[k]).padStart(2, "0"),
    name: $("name").value.trim(), age: $("age").value,
    problem: $("problem").value.trim(), category, arrival: Date.now()
  };
  pq.enqueue(p);                       // enqueue in priority queue
  undoStack.push({ type: "add", p });  // push on stack
  toast("");
  e.target.reset();
  render();
}
function callNext() {
  const p = pq.dequeue();              // highest priority first
  if (!p) return toast("No patients are waiting.");
  p.wait = Date.now() - p.arrival;
  undoStack.push({ type: "call", p, prev: nowServing });
  served.push(p); nowServing = p;
  toast(""); render();
}
function cancelToken(token) {
  const f = findInQ(token); if (!f) return;
  f.q.removeAt(f.i);
  undoStack.push({ type: "cancel", p: f.p, i: f.i });
  render();
}
function skipToken(token) {
  const f = findInQ(token);
  if (!f || f.i === f.q.size() - 1) return toast("Already last in its queue.");
  f.q.removeAt(f.i); f.q.enqueue(f.p);
  undoStack.push({ type: "skip", p: f.p, i: f.i });
  toast(""); render();
}
function undo() {
  const a = undoStack.pop();           // stack pop
  if (!a) return toast("Nothing to undo.");
  const q = pq.queues[a.p.category];
  if (a.type === "add") { q.removeAt(q.indexOf(a.p)); counters[PREFIX[a.p.category]]--; }
  if (a.type === "call") { served.pop(); nowServing = a.prev; q.insertAt(0, a.p); }
  if (a.type === "cancel") q.insertAt(a.i, a.p);
  if (a.type === "skip") { q.removeAt(q.indexOf(a.p)); q.insertAt(a.i, a.p); }
  toast(""); render();
}
// ---- Render ----
function render() {
  const next = pq.peek();
  pq.levels.forEach(c => {
    const items = pq.queues[c].toArray();
    $("c" + PREFIX[c]).textContent = items.length;
    $("q" + c).innerHTML = items.length ? items.map(p => `
      <li class="${p === next ? "next" : ""}">
        <div class="top"><span class="chip">${p.token}</span>${p === next ? '<span class="tag">Next to be called</span>' : ""}</div>
        <div class="who"><b>${esc(p.name)}</b>, ${esc(p.age)} yrs<br>${esc(p.problem)}</div>
        <div class="btns"><button data-skip="${p.token}">Skip</button><button class="cancel" data-cancel="${p.token}">Cancel</button></div>
      </li>`).join("") : '<li class="empty">No patients waiting</li>';
  });
  $("nowServing").textContent = nowServing ? nowServing.token : "None yet";
  $("nowInfo").textContent = nowServing
    ? `${nowServing.name}, ${nowServing.age} yrs: ${nowServing.problem} (${nowServing.category})`
    : 'Press "Call next patient" to start.';
  $("sServed").textContent = served.length;
  $("sWaiting").textContent = pq.size();
  const avg = served.length ? served.reduce((s, p) => s + p.wait, 0) / served.length / 1000 : 0;
  $("sAvg").textContent = avg < 90 ? Math.round(avg) + "s" : (avg / 60).toFixed(1) + "m";
  $("undoCount").textContent = undoStack.size();
}

$("form").addEventListener("submit", register);
$("callBtn").addEventListener("click", callNext);
$("undoBtn").addEventListener("click", undo);
document.querySelector(".queues").addEventListener("click", e => {
  if (e.target.dataset.cancel) cancelToken(e.target.dataset.cancel);
  if (e.target.dataset.skip) skipToken(e.target.dataset.skip);
});
render();
