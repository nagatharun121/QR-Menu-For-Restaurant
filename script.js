let menuData = null;
let activeCategory = "all";

const menuEl = document.getElementById("menu");
const filtersEl = document.getElementById("filters");
const searchBox = document.getElementById("searchBox");
const clearSearch = document.getElementById("clearSearch");
const resultInfo = document.getElementById("resultInfo");

async function loadMenu() {
  try {
    const response = await fetch("menu.json");
    if (response.ok) {
      menuData = await response.json();
    } else {
      throw new Error('Network response was not ok');
    }
  } catch (error) {
    // fallback: try embedded JSON in the page (works when opened via file://)
    const embedded = document.getElementById('menu-json');
    if (embedded && embedded.textContent.trim()) {
      try {
        menuData = JSON.parse(embedded.textContent);
      } catch (e) {
        console.error('Failed to parse embedded menu JSON', e);
      }
    }
    if (!menuData) {
      menuEl.innerHTML = `<div class="empty">Unable to load menu. Please run this project through a local server.</div>`;
      console.error(error);
      return;
    }
  }

  document.getElementById("restaurantName").textContent = menuData.restaurant.name;
  document.getElementById("tagline").textContent = menuData.restaurant.tagline;

  if (menuData.restaurant.phone) {
    const btn = document.getElementById("callBtn");
    btn.href = `tel:${menuData.restaurant.phone}`;
    btn.hidden = false;
  }

  renderFilters();
  renderMenu();
}

function renderFilters() {
  filtersEl.innerHTML = `
    <button class="filter active" data-category="all">🍽️ All</button>
    ${menuData.categories.map(c =>
      `<button class="filter" data-category="${c.id}">${c.icon} ${c.name}</button>`
    ).join("")}
  `;

  filtersEl.querySelectorAll(".filter").forEach(btn => {
    btn.addEventListener("click", () => {
      activeCategory = btn.dataset.category;
      filtersEl.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderMenu();
    });
  });
}

function categoryId(category) {
  return category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function renderMenu() {
  const search = searchBox.value.trim().toLowerCase();

  const visible = menuData.items.filter(item => {
    const categoryMatch = activeCategory === "all" || categoryId(item.category) === activeCategory;
    const searchMatch = !search || item.name.toLowerCase().includes(search) || item.category.toLowerCase().includes(search);
    return categoryMatch && searchMatch;
  });

  resultInfo.textContent = `${visible.length} item${visible.length === 1 ? "" : "s"} shown`;

  if (!visible.length) {
    menuEl.innerHTML = `<div class="empty">No dishes found. Try another search.</div>`;
    return;
  }

  const groups = {};
  visible.forEach(item => {
    if (!groups[item.category]) groups[item.category] = [];
    groups[item.category].push(item);
  });

  menuEl.innerHTML = Object.entries(groups).map(([category, items]) => {
    const meta = menuData.categories.find(c => c.source_name === category) || {name: category, icon: "🍽️"};
    return `
      <section class="category" id="${categoryId(category)}">
        <div class="category-head">
          <span class="category-icon">${meta.icon}</span>
          <h2>${meta.name}</h2>
          <span class="category-line"></span>
        </div>
        <div class="grid">
          ${items.map(itemCard).join("")}
        </div>
      </section>
    `;
  }).join("");
}

function itemCard(item) {
  const typeLabel = item.type === "veg" ? "VEG" : item.type === "nonveg" ? "NON-VEG" : "";
  return `
    <article class="item">
      <div>
        <div class="item-name">${escapeHtml(item.name)}</div>
        ${typeLabel ? `<div class="item-type"><span class="dot ${item.type}"></span>${typeLabel}</div>` : ""}
      </div>
      <div class="price">₹${item.price}</div>
    </article>
  `;
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, ch => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
  }[ch]));
}

searchBox.addEventListener("input", renderMenu);
clearSearch.addEventListener("click", () => {
  searchBox.value = "";
  renderMenu();
  searchBox.focus();
});

loadMenu();
