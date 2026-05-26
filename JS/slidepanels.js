// ===============================
// SLIDE-IN PANELS: KURV, GEMTE, LOGIN
// ===============================

// Finder elementer i HTML
const overlay = document.querySelector("#panelOverlay");
const panels = document.querySelectorAll(".slide-panel");
const openBtns = document.querySelectorAll("[data-panel-open]");
const closeBtns = document.querySelectorAll(".panel-close");

const cartCountEl = document.querySelector("#cartCount");
const savedCountEl = document.querySelector("#savedCount");
const cartItemsEl = document.querySelector("#cartItems");
const savedItemsEl = document.querySelector("#savedItems");
const cartTotalEl = document.querySelector("#cartTotal");

// Henter data fra localStorage
function getItems(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

// Gemmer data i localStorage
function saveItems(key, items) {
  localStorage.setItem(key, JSON.stringify(items));
}

// Opdaterer tal i menuen
function updateCounts() {
  const cart = getItems("cart");
  const saved = getItems("saved");

  if (cartCountEl) cartCountEl.textContent = cart.length;
  if (savedCountEl) savedCountEl.textContent = saved.length;
}

// Åbner et panel
function openPanel(type) {
  closePanels();

  const panel = document.querySelector(`#${type}Panel`);
  if (!panel) return;

  panel.classList.add("is-open");
  overlay.classList.add("is-open");

  renderCart();
  renderSaved();
}

// Lukker alle panels
function closePanels() {
  panels.forEach((panel) => panel.classList.remove("is-open"));
  if (overlay) overlay.classList.remove("is-open");
}

// Tilføj produkt til kurv — max 1 af hvert produkt
function addToCart(product) {
  const cart = getItems("cart");

  const alreadyInCart = cart.some((item) => String(item.id) === String(product.id));

  if (alreadyInCart) {
    alert("Dette produkt er allerede i kurven");
    return;
  }

  cart.push(product);
  saveItems("cart", cart);

  updateCounts();
  renderCart();
}

// Tilføj produkt til gemte — max 1 af hvert produkt
function addToSaved(product) {
  const saved = getItems("saved");

  const alreadySaved = saved.some((item) => String(item.id) === String(product.id));

  if (alreadySaved) {
    removeFromSaved(product.id);
    return;
  }

  saved.push(product);
  saveItems("saved", saved);

  updateCounts();
  renderSaved();
}

// Fjerner fra kurv
function removeFromCart(id) {
  const cart = getItems("cart").filter((item) => String(item.id) !== String(id));
  saveItems("cart", cart);

  updateCounts();
  renderCart();
}

// Fjerner fra gemte
function removeFromSaved(id) {
  const saved = getItems("saved").filter((item) => String(item.id) !== String(id));
  saveItems("saved", saved);

  updateCounts();
  renderSaved();
}
// Flytter produkt fra gemte til kurv
function moveToCart(product) {
  // Tilføj til kurv
  addToCart(product);

  // Fjern fra gemte
  removeFromSaved(product.id);

  // Opdater visning
  updateCounts();
  renderCart();
  renderSaved();
}
// Viser produkter i kurv-panelet
function renderCart() {
  const cart = getItems("cart");

  if (!cartItemsEl) return;

  if (cart.length === 0) {
    cartItemsEl.innerHTML = `<p>Din kurv er tom.</p>`;
    if (cartTotalEl) cartTotalEl.textContent = "0 DKK";
    return;
  }

  cartItemsEl.innerHTML = cart
    .map(
      (item) => `
        <div class="panel-product">
            <div class="panel-product-img">
                ${item.image ? `<img src="${item.image}" alt="${item.name}">` : ""}
            </div>

            <div class="panel-product-info">
                <p>${item.name}</p>
                <p>STR. ${item.size || ""}</p>
                <p>${item.price} DKK</p>
                <p>${item.color || ""}</p>
                <button onclick="removeFromCart('${item.id}')">Fjern</button>
            </div>
        </div>
    `,
    )
    .join("");

  const total = cart.reduce((sum, item) => sum + Number(item.price || 0), 0);
  if (cartTotalEl) cartTotalEl.textContent = `${total} DKK`;
}

// Viser produkter i gemte-panelet
function renderSaved() {
  const saved = getItems("saved");

  if (!savedItemsEl) return;

  if (saved.length === 0) {
    savedItemsEl.innerHTML = `<p>Du har ingen gemte produkter.</p>`;
    return;
  }

  savedItemsEl.innerHTML = saved
    .map(
      (item) => `
    <div class="panel-product">
      <div class="panel-product-img">
        ${item.image ? `<img src="${item.image}" alt="${item.name}">` : ""}
      </div>

      <div class="panel-product-info">
        <p>${item.name}</p>
        <p>STR. ${item.size || ""}</p>
        <p>${item.price} DKK</p>
        <p>${item.color || ""}</p>

        <button onclick="removeFromSaved('${item.id}')">Fjern</button>
   <button onclick='moveToCart(${JSON.stringify(item)})'>FLYT TIL KURV</button>
      </div>
    </div>
  `,
    )
    .join("");
}

// Klik på menu-links
openBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    openPanel(btn.dataset.panelOpen);
  });
});

// Klik på luk-knap
closeBtns.forEach((btn) => {
  btn.addEventListener("click", closePanels);
});

// Klik på mørk baggrund
if (overlay) {
  overlay.addEventListener("click", closePanels);
}

// Escape lukker panel
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closePanels();
});

// Gør funktioner globale, så andre JS-filer kan bruge dem
window.addToCart = addToCart;
window.addToSaved = addToSaved;
window.removeFromCart = removeFromCart;
window.removeFromSaved = removeFromSaved;
window.moveToCart = moveToCart;

// Start

updateCounts();
renderCart();
renderSaved();

// ===============================
// LOGIN VALIDATION
// ===============================

const loginForm = document.querySelector("#loginForm");
const loginEmail = document.querySelector("#loginEmail");
const loginPassword = document.querySelector("#loginPassword");
const loginError = document.querySelector("#loginError");

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!loginEmail.value || !loginPassword.value) {
      loginError.textContent = "Udfyld både e-mail og adgangskode";
      return;
    }

    loginError.textContent = "";
    alert("Du er nu logget ind");
    closePanels();
  });
}
