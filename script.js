/* Campus Board Digital Notice Board
   Beginner-friendly demo using browser localStorage.
   For a shared, production app, connect this UI to your existing backend/database.
*/
const STORAGE_KEY = "campusBoardNotices_v1";

const sampleNotices = [
  {
    id: "sample-1",
    title: "Internal Assessment Schedule",
    category: "Examination",
    description: "The internal assessment schedule will be shared by each department. Students should check with their faculty coordinator and bring their college ID card.",
    date: dateOffset(2),
    link: "",
    pinned: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 8
  },
  {
    id: "sample-2",
    title: "Web Development Workshop",
    category: "Events",
    description: "A beginner-friendly workshop covering HTML, CSS, JavaScript, and building your first responsive website. Register with your class representative.",
    date: dateOffset(1),
    link: "",
    pinned: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24
  },
  {
    id: "sample-3",
    title: "Internship Opportunities",
    category: "Placement",
    description: "Students interested in internships should prepare an updated resume and portfolio. Check the placement cell for eligibility and application details.",
    date: dateOffset(0),
    link: "",
    pinned: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 36
  },
  {
    id: "sample-4",
    title: "Library Timings",
    category: "General",
    description: "Please follow the library's posted opening hours and return borrowed books by their due dates. Contact library staff for renewals.",
    date: dateOffset(-1),
    link: "",
    pinned: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 72
  }
];

function dateOffset(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function loadNotices() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) return JSON.parse(saved);
  } catch (error) {
    console.warn("Could not read saved notices:", error);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleNotices));
  return [...sampleNotices];
}

let notices = loadNotices();
let adminMode = false;

const elements = {
  adminToggle: document.getElementById("adminToggle"),
  adminPanel: document.getElementById("adminPanel"),
  form: document.getElementById("noticeForm"),
  noticeId: document.getElementById("noticeId"),
  title: document.getElementById("titleInput"),
  category: document.getElementById("categoryInput"),
  description: document.getElementById("descriptionInput"),
  date: document.getElementById("dateInput"),
  link: document.getElementById("linkInput"),
  pinned: document.getElementById("pinnedInput"),
  saveButton: document.getElementById("saveButton"),
  cancelEdit: document.getElementById("cancelEdit"),
  search: document.getElementById("searchInput"),
  categoryFilter: document.getElementById("categoryFilter"),
  sortFilter: document.getElementById("sortFilter"),
  grid: document.getElementById("noticeGrid"),
  empty: document.getElementById("emptyState"),
  resultLabel: document.getElementById("resultLabel"),
  totalCount: document.getElementById("totalCount"),
  recentCount: document.getElementById("recentCount"),
  pinnedCount: document.getElementById("pinnedCount"),
  toast: document.getElementById("toast")
};

function saveNotices() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notices));
}

function safeText(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}

function formatDate(value) {
  if (!value) return "Date not set";
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return "Date not set";
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function validLink(rawLink) {
  if (!rawLink) return "";
  try {
    const url = new URL(rawLink);
    return ["http:", "https:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

function getFilteredNotices() {
  const query = elements.search.value.trim().toLowerCase();
  const category = elements.categoryFilter.value;
  const filtered = notices.filter(notice => {
    const searchable = `${notice.title} ${notice.description} ${notice.category}`.toLowerCase();
    return (!query || searchable.includes(query)) && (category === "All" || notice.category === category);
  });
  filtered.sort((a, b) => {
    if (Boolean(a.pinned) !== Boolean(b.pinned)) return a.pinned ? -1 : 1;
    const dateDifference = new Date(b.date || 0) - new Date(a.date || 0);
    return elements.sortFilter.value === "oldest" ? -dateDifference : dateDifference;
  });
  return filtered;
}

function renderNotices() {
  const filtered = getFilteredNotices();
  const now = Date.now();
  const weekAgo = now - 7 * 24 * 60 * 60 * 1000;

  elements.totalCount.textContent = notices.length;
  elements.recentCount.textContent = notices.filter(item => Number(item.createdAt) >= weekAgo).length;
  elements.pinnedCount.textContent = notices.filter(item => item.pinned).length;
  elements.resultLabel.textContent = `Showing ${filtered.length} of ${notices.length}`;
  elements.grid.innerHTML = filtered.map(notice => {
    const attachment = validLink(notice.link);
    return `
      <article class="notice-card">
        <div class="card-top">
          <span class="category" data-category="${safeText(notice.category)}">${safeText(notice.category)}</span>
          ${notice.pinned ? '<span class="important">★ IMPORTANT</span>' : ""}
        </div>
        <h3>${safeText(notice.title)}</h3>
        <p>${safeText(notice.description)}</p>
        <div class="card-bottom">
          <span class="date">◷ ${safeText(formatDate(notice.date))}</span>
          ${attachment ? `<a class="notice-link" href="${safeText(attachment)}" target="_blank" rel="noopener noreferrer">Open attachment ↗</a>` : ""}
        </div>
        ${adminMode ? `<div class="card-actions"><button class="text-btn" type="button" data-edit="${safeText(notice.id)}">Edit notice</button><button class="text-btn delete" type="button" data-delete="${safeText(notice.id)}">Delete</button></div>` : ""}
      </article>`;
  }).join("");

  elements.empty.classList.toggle("hidden", filtered.length !== 0);
  elements.grid.classList.toggle("hidden", filtered.length === 0);
  elements.adminPanel.classList.toggle("hidden", !adminMode);
  elements.adminToggle.textContent = adminMode ? "Exit admin mode" : "Admin mode";
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => elements.toast.classList.remove("show"), 2400);
}

function resetForm() {
  elements.form.reset();
  elements.noticeId.value = "";
  elements.date.value = dateOffset(0);
  elements.saveButton.textContent = "Publish notice";
  elements.cancelEdit.classList.add("hidden");
}

function editNotice(id) {
  const notice = notices.find(item => item.id === id);
  if (!notice) return;
  elements.noticeId.value = notice.id;
  elements.title.value = notice.title;
  elements.category.value = notice.category;
  elements.description.value = notice.description;
  elements.date.value = notice.date || dateOffset(0);
  elements.link.value = notice.link || "";
  elements.pinned.checked = Boolean(notice.pinned);
  elements.saveButton.textContent = "Save changes";
  elements.cancelEdit.classList.remove("hidden");
  elements.adminPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  elements.title.focus();
}

elements.adminToggle.addEventListener("click", () => {
  adminMode = !adminMode;
  renderNotices();
  if (adminMode) showToast("Demo admin mode enabled on this device.");
});

elements.form.addEventListener("submit", event => {
  event.preventDefault();
  const title = elements.title.value.trim();
  const description = elements.description.value.trim();
  const rawLink = elements.link.value.trim();
  if (!title || !description || !elements.date.value) {
    showToast("Please complete all required fields.");
    return;
  }
  if (rawLink && !validLink(rawLink)) {
    showToast("Please enter a valid http:// or https:// link.");
    return;
  }

  const existingId = elements.noticeId.value;
  const existing = notices.find(item => item.id === existingId);
  const notice = {
    id: existingId || `notice-${Date.now()}-${Math.random().toString(16).slice(2, 7)}`,
    title,
    category: elements.category.value,
    description,
    date: elements.date.value,
    link: rawLink,
    pinned: elements.pinned.checked,
    createdAt: existing ? existing.createdAt : Date.now()
  };

  if (existing) {
    notices = notices.map(item => item.id === existingId ? notice : item);
    showToast("Notice updated successfully.");
  } else {
    notices.unshift(notice);
    showToast("Notice published successfully.");
  }
  saveNotices();
  resetForm();
  renderNotices();
});

elements.cancelEdit.addEventListener("click", resetForm);
elements.search.addEventListener("input", renderNotices);
elements.categoryFilter.addEventListener("change", renderNotices);
elements.sortFilter.addEventListener("change", renderNotices);

elements.grid.addEventListener("click", event => {
  const editButton = event.target.closest("[data-edit]");
  const deleteButton = event.target.closest("[data-delete]");
  if (editButton) editNotice(editButton.dataset.edit);
  if (deleteButton) {
    const id = deleteButton.dataset.delete;
    const notice = notices.find(item => item.id === id);
    if (!notice) return;
    if (window.confirm(`Delete "${notice.title}"?`)) {
      notices = notices.filter(item => item.id !== id);
      saveNotices();
      renderNotices();
      showToast("Notice deleted.");
    }
  }
});

document.getElementById("clearFilters").addEventListener("click", () => {
  elements.search.value = "";
  elements.categoryFilter.value = "All";
  elements.sortFilter.value = "newest";
  renderNotices();
});

document.getElementById("year").textContent = new Date().getFullYear();
elements.date.value = dateOffset(0);
renderNotices();
