const OWNER_CODE = "owner123";
const STORAGE_KEY = "attidash-orders";

const orderForm = document.querySelector("#orderForm");
const formMessage = document.querySelector("#formMessage");
const ownerPanel = document.querySelector("#ownerPanel");
const ownerOpen = document.querySelector("#ownerOpen");
const ownerClose = document.querySelector("#ownerClose");
const ownerUnlock = document.querySelector("#ownerUnlock");
const ownerCode = document.querySelector("#ownerCode");
const ownerMessage = document.querySelector("#ownerMessage");
const ownerLogin = document.querySelector("#ownerLogin");
const dashboard = document.querySelector("#dashboard");
const requestList = document.querySelector("#requestList");
const clearOrders = document.querySelector("#clearOrders");

function getOrders() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

function saveOrders(orders) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

function escapeHTML(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}

function renderOrders() {
  const orders = getOrders();

  if (orders.length === 0) {
    requestList.innerHTML = '<div class="empty-state">No food requests yet. New demo requests will appear here.</div>';
    return;
  }

  requestList.innerHTML = orders
    .map(
      (order) => `
        <article class="request-card">
          <strong>${escapeHTML(order.name)}</strong>
          <div>${escapeHTML(order.request)}</div>
          <div class="request-time">Sent ${order.time}</div>
        </article>
      `
    )
    .join("");
}

function openOwnerPanel() {
  ownerPanel.classList.add("open");
  ownerPanel.setAttribute("aria-hidden", "false");
  ownerCode.focus();
}

function closeOwnerPanel() {
  ownerPanel.classList.remove("open");
  ownerPanel.setAttribute("aria-hidden", "true");
  ownerMessage.textContent = "";
}

orderForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(orderForm);
  const order = {
    name: formData.get("customerName").trim(),
    request: formData.get("foodRequest").trim(),
    time: new Date().toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }),
  };

  const orders = [order, ...getOrders()];
  saveOrders(orders);
  orderForm.reset();
  formMessage.textContent = "Request sent! The owner dashboard has been updated.";
  renderOrders();
});

ownerOpen.addEventListener("click", openOwnerPanel);
ownerClose.addEventListener("click", closeOwnerPanel);
ownerPanel.addEventListener("click", (event) => {
  if (event.target === ownerPanel) {
    closeOwnerPanel();
  }
});

ownerUnlock.addEventListener("click", () => {
  if (ownerCode.value === OWNER_CODE) {
    ownerLogin.classList.add("hidden");
    dashboard.classList.remove("hidden");
    ownerMessage.textContent = "";
    renderOrders();
  } else {
    ownerMessage.textContent = "Incorrect owner code. Try owner123 for this demo.";
  }
});

clearOrders.addEventListener("click", () => {
  saveOrders([]);
  renderOrders();
});

renderOrders();
