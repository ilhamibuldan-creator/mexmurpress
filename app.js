const listEl = document.getElementById("list");
const qEl = document.getElementById("q");
const yearEl = document.getElementById("year");

let allNews = [];
let activeCategory = "Hemû";
let query = "";

yearEl.textContent = new Date().getFullYear();

function escapeHtml(str){
  return (str || "").replace(/[&<>"']/g, (m) => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[m]));
}

function render(items){
  if (!items.length){
    listEl.innerHTML = `<div class="card"><h3>Nehat dîtin</h3><p>Filtreyi değiştir veya arama kelimesini kontrol et.</p></div>`;
    return;
  }

  listEl.innerHTML = items.map(n => `
    <article class="card">
      <div class="meta">
  <span class="badge">${escapeHtml(n.category)}</span>
  <span>${escapeHtml(n.dateText || n.date || "")}</span>

  ${n.city ? `<span>•</span><span>${escapeHtml(n.city)}</span>` : ""}

  ${n.startTime ? `<span>•</span><span>${escapeHtml(n.startTime)}</span>` : ""}

  ${Number.isFinite(n.durationMin) ? `<span>•</span><span>${escapeHtml(String(n.durationMin))} dk</span>` : ""}

  <span>•</span>
  <span>${escapeHtml(n.source || "")}</span>
</div>

      <h3>${escapeHtml(n.title || "")}</h3>
      <p>${escapeHtml(n.summary || "")}</p>
      <a href="./post.html?id=${encodeURIComponent(n.id)}">Berdewamiya wê bixwîne</a>
    </article>
  `).join("");
}

function apply(){
  const filtered = allNews
    .filter(n => activeCategory === "Hemû" ? true : n.category === activeCategory)
    .filter(n => {
      const hay = `${n.title || ""} ${n.summary || ""} ${n.content || ""}`.toLowerCase();
      return hay.includes(query.toLowerCase());
    })
    .sort((a,b) => (b.date || "").localeCompare(a.date || ""));

  render(filtered);
}

async function init(){
  const res = await fetch("./data/news.json");
  allNews = await res.json();
  apply();
}

// kategori butonları
document.querySelectorAll("[data-category]").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("[data-category]").forEach(b => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    activeCategory = btn.dataset.category;
    apply();
  });
});

// arama
qEl.addEventListener("input", (e) => {
  query = e.target.value.trim();
  apply();
});

init();
