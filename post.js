const postEl = document.getElementById("post");
const yearEl = document.getElementById("year");
yearEl.textContent = new Date().getFullYear();

function escapeHtml(str){
  return (str || "").replace(/[&<>"']/g, (m) => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[m]));
}

function getId(){
  const u = new URL(location.href);
  return u.searchParams.get("id");
}

function getOtherId(id){
  if (!id) return null;
  if (id.includes("-ku-")) return id.replace("-ku-", "-de-");
  if (id.includes("-de-")) return id.replace("-de-", "-ku-");
  return null;
}

function getSwitchLabel(id){
  if (id.includes("-ku-")) return "Auf Deutsch lesen";
  if (id.includes("-de-")) return "Bi Kurdî bixwîne";
  return "Diğer dil";
}

async function init(){
  const id = getId();
  if (!id){
    postEl.innerHTML = `<h1>Nûçe peyda nebû</h1><p>Parametreya ID nîne.</p>`;
    return;
  }

  const res = await fetch("./data/news.json");
  const all = await res.json();

  const n = all.find(x => x.id === id);
  if (!n){
    postEl.innerHTML = `<h1>Nûçe peyda nebû</h1><p>Girêdayî vê ID'yê çi naverok nehatin dîtin.</p>`;
    return;
  }

  const otherId = getOtherId(n.id);
  const otherExists = otherId && all.some(x => x.id === otherId);
  const switchHtml = otherExists
    ? `<div style="margin:10px 0 6px;">
         <a class="chip" href="./post.html?id=${encodeURIComponent(otherId)}">${escapeHtml(getSwitchLabel(n.id))}</a>
       </div>`
    : "";

  document.title = n.title;

  postEl.innerHTML = `
    <div class="meta">
  <span class="badge">${escapeHtml(n.category)}</span>
  <span>${escapeHtml(n.dateText || n.date || "")}</span>

  ${n.city ? `<span>•</span><span>${escapeHtml(n.city)}</span>` : ""}

  ${n.venue ? `<span>•</span><span>${escapeHtml(n.venue)}</span>` : ""}

  ${n.startTime ? `<span>•</span><span>${escapeHtml(n.startTime)}</span>` : ""}

  ${Number.isFinite(n.durationMin) ? `<span>•</span><span>${escapeHtml(String(n.durationMin))} dk</span>` : ""}

  <span>•</span>
  <span>${escapeHtml(n.source || "")}</span>
</div>


    ${switchHtml}

    <h1 style="margin:12px 0 8px;">${escapeHtml(n.title)}</h1>
    <p style="color:var(--muted); margin:0 0 12px;">${escapeHtml(n.summary)}</p>

    <div class="content">
      ${escapeHtml(n.content).replace(/\n\n/g, "<br><br>")}
    </div>
  `;
}

init();
