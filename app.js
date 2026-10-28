(() => {
  "use strict";

  const config = window.CRAVE_CONFIG;
  const products = window.CRAVE_PRODUCTS || [];
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const money = (amount) => new Intl.NumberFormat(config.currencyLocale, {
    style: "currency", currency: config.currency, maximumFractionDigits: 0
  }).format(amount);
  const escapeHTML = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[char]));
  const cartKey = "craveSipCart_v1";

  let cart = loadCart();
  let activeFilter = "all";
  let lastFocus = null;
  let checkoutValues = {};

  function loadCart() {
    try {
      const saved = JSON.parse(localStorage.getItem(cartKey) || "[]");
      return Array.isArray(saved) ? saved.filter(item => products.some(p => p.id === item.id) && Number(item.qty) > 0).map(item => ({
        id: item.id, qty: Math.min(99, Math.floor(Number(item.qty))), size: item.size || products.find(p => p.id === item.id)?.size
      })) : [];
    } catch {
      return [];
    }
  }

  function saveCart() {
    try { localStorage.setItem(cartKey, JSON.stringify(cart)); } catch { /* storage may be unavailable */ }
    updateCartCount();
  }

  function getProduct(id) {
    return products.find(product => product.id === id);
  }

  function cartSubtotal() {
    return cart.reduce((sum, item) => {
      const product = getProduct(item.id);
      return sum + (product ? product.price * item.qty : 0);
    }, 0);
  }

  function updateCartCount() {
    $("#cartCount").textContent = cart.reduce((sum, item) => sum + item.qty, 0);
  }

  function productCard(product) {
    return `
      <article class="product-card" data-category="${escapeHTML(product.category)}">
        <div class="product-image product-image-${escapeHTML(product.colour || "berry")}">
          <img src="${escapeHTML(product.image)}" alt="${escapeHTML(product.imageAlt || product.name)}" loading="lazy">
          ${product.badge ? `<span class="product-badge">${escapeHTML(product.badge)}</span>` : ""}
          <button class="quick-add" data-add="${escapeHTML(product.id)}" aria-label="Add ${escapeHTML(product.name)} to bag">+</button>
        </div>
        <div class="product-info">
          <div class="product-meta"><span>${escapeHTML(product.category)}</span><span>${escapeHTML(product.size)}</span></div>
          <h3>${escapeHTML(product.name)}</h3>
          <p>${escapeHTML(product.description)}</p>
          <div class="product-buy"><strong>${money(product.price)}</strong><button class="add-button" data-add="${escapeHTML(product.id)}">Add to bag <span aria-hidden="true">+</span></button></div>
        </div>
      </article>`;
  }

  function renderProducts() {
    const available = products.filter(product => product.available && (activeFilter === "all" || product.category === activeFilter));
    $("#productGrid").innerHTML = available.map(productCard).join("");
    $("#menuCount").textContent = available.length;
    $$(".filter-button").forEach(button => {
      const selected = button.dataset.filter === activeFilter;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
  }

  function showToast(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("is-visible"), 2600);
  }

  function addToCart(id) {
    const product = getProduct(id);
    if (!product || !product.available) return;
    const existing = cart.find(item => item.id === id && item.size === product.size);
    if (existing) existing.qty = Math.min(99, existing.qty + 1);
    else cart.push({ id, qty: 1, size: product.size });
    saveCart();
    renderCart();
    showToast(`${product.name} added to your bag ✳`);
  }

  function setQuantity(id, size, quantity) {
    const item = cart.find(entry => entry.id === id && entry.size === size);
    if (!item) return;
    if (quantity <= 0) cart = cart.filter(entry => entry !== item);
    else item.qty = Math.min(99, quantity);
    saveCart();
    renderCart();
    renderCheckoutReview();
  }

  function renderCart() {
    const contents = $("#cartContents");
    if (!cart.length) {
      contents.innerHTML = `<div class="empty-cart"><span class="empty-cart-icon">♡</span><h3>Your bag is looking a little thirsty.</h3><p>Add a sip or two and we'll take it from there.</p><button class="button button-dark" id="emptyCartBrowse">Browse the menu</button></div>`;
      $("#cartFooter").classList.add("is-empty");
      $("#cartSubtotal").textContent = money(0);
      $("#checkoutButton").disabled = true;
      const browse = $("#emptyCartBrowse");
      if (browse) browse.addEventListener("click", closeCart);
      return;
    }
    $("#cartFooter").classList.remove("is-empty");
    $("#checkoutButton").disabled = false;
    contents.innerHTML = cart.map(item => {
      const product = getProduct(item.id);
      if (!product) return "";
      return `<div class="cart-line">
        <img src="${escapeHTML(product.image)}" alt="" loading="lazy">
        <div class="cart-line-info"><strong>${escapeHTML(product.name)}</strong><small>${escapeHTML(item.size)} · ${money(product.price)} each</small>
          <div class="quantity-control"><button data-qty="-1" data-id="${escapeHTML(item.id)}" data-size="${escapeHTML(item.size)}" aria-label="Decrease ${escapeHTML(product.name)} quantity">−</button><span>${item.qty}</span><button data-qty="1" data-id="${escapeHTML(item.id)}" data-size="${escapeHTML(item.size)}" aria-label="Increase ${escapeHTML(product.name)} quantity">+</button></div>
        </div>
        <div class="cart-line-end"><strong>${money(product.price * item.qty)}</strong><button class="remove-item" data-remove="${escapeHTML(item.id)}" data-size="${escapeHTML(item.size)}">Remove</button></div>
      </div>`;
    }).join("");
    $("#cartSubtotal").textContent = money(cartSubtotal());
  }

  function openCart() {
    lastFocus = document.activeElement;
    $("#drawerBackdrop").hidden = false;
    $("#cartDrawer").classList.add("is-open");
    $("#cartDrawer").setAttribute("aria-hidden", "false");
    document.body.classList.add("overlay-open");
    $("#closeCart").focus();
  }

  function closeCart() {
    $("#drawerBackdrop").hidden = true;
    $("#cartDrawer").classList.remove("is-open");
    $("#cartDrawer").setAttribute("aria-hidden", "true");
    document.body.classList.remove("overlay-open");
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }

  function openCheckout() {
    if (!cart.length) return;
    checkoutValues = getFormValues();
    closeCart();
    $("#checkoutModal").classList.add("is-open");
    $("#checkoutModal").setAttribute("aria-hidden", "false");
    document.body.classList.add("overlay-open");
    renderCheckoutReview();
    $("#checkoutModal").querySelector('input[name="fullName"]').focus();
  }

  function closeCheckout() {
    $("#checkoutModal").classList.remove("is-open");
    $("#checkoutModal").setAttribute("aria-hidden", "true");
    document.body.classList.remove("overlay-open");
  }

  function getFormValues() {
    const form = $("#checkoutForm");
    return Object.fromEntries(new FormData(form).entries());
  }

  function renderCheckoutReview() {
    const target = $("#checkoutReview");
    if (!target) return;
    const items = cart.map(item => {
      const product = getProduct(item.id);
      return product ? `<div><span>${item.qty} × ${escapeHTML(product.name)} <small>(${escapeHTML(item.size)})</small></span><strong>${money(product.price * item.qty)}</strong></div>` : "";
    }).join("");
    target.innerHTML = `<div class="review-title"><strong>In your bag</strong><span>${cart.reduce((sum, item) => sum + item.qty, 0)} item(s)</span></div>${items}<div class="review-subtotal"><span>Subtotal</span><strong>${money(cartSubtotal())}</strong></div><div class="review-delivery"><span>Delivery fee</span><strong>To be confirmed</strong></div>`;
  }

  function validateForm() {
    const form = $("#checkoutForm");
    let firstInvalid = null;
    $$(".field", form).forEach(field => {
      const input = $("input, textarea, select", field);
      const error = $(".field-error", field);
      if (!input || !error) return;
      input.removeAttribute("aria-invalid");
      error.textContent = "";
      if (input.required && !input.value.trim()) {
        error.textContent = "Please complete this field.";
        input.setAttribute("aria-invalid", "true");
        firstInvalid ||= input;
      } else if (input.name === "phone" && input.value.trim() && input.value.replace(/[^\d+]/g, "").length < 7) {
        error.textContent = "Enter a valid contact number.";
        input.setAttribute("aria-invalid", "true");
        firstInvalid ||= input;
      }
    });
    if (!cart.length) {
      $("#formError").textContent = "Your bag is empty. Add a drink before checkout.";
      return false;
    }
    $("#formError").textContent = "";
    if (firstInvalid) {
      firstInvalid.focus();
      return false;
    }
    return true;
  }

  function orderReference() {
    const date = new Date();
    const stamp = `${date.getFullYear().toString().slice(-2)}${String(date.getMonth()+1).padStart(2,"0")}${String(date.getDate()).padStart(2,"0")}`;
    const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
    return `CS-${stamp}-${suffix}`;
  }

  function buildOrderMessage(values, reference) {
    const lines = [
      `Hi ${config.businessName}! I'd like to place an order.`,
      "",
      `ORDER REQUEST: ${reference}`,
      "",
      "MY ORDER"
    ];
    cart.forEach(item => {
      const product = getProduct(item.id);
      if (!product) return;
      lines.push(`• ${product.name} (${item.size})`);
      lines.push(`  ${item.qty} × ${money(product.price)} = ${money(product.price * item.qty)}`);
    });
    lines.push("", `Subtotal: ${money(cartSubtotal())}`);
    if (Number.isFinite(config.deliveryFee) && config.deliveryFee >= 0) {
      lines.push(`Delivery fee: ${money(config.deliveryFee)}`);
      lines.push(`Estimated total: ${money(cartSubtotal() + config.deliveryFee)}`);
    } else {
      lines.push("Delivery fee: To be confirmed");
      lines.push("Final total: Please confirm after checking delivery location");
    }
    lines.push("", "CUSTOMER DETAILS");
    lines.push(`Name: ${values.fullName.trim()}`);
    lines.push(`Phone: ${values.phone.trim()}`);
    lines.push(`Delivery address: ${values.address.trim()}, ${values.area.trim()}, ${values.city.trim()}, ${values.state.trim()}`);
    if (values.landmark.trim()) lines.push(`Landmark/directions: ${values.landmark.trim()}`);
    if (values.instructions.trim()) lines.push(`Delivery instructions: ${values.instructions.trim()}`);
    if (values.date) lines.push(`Preferred date: ${values.date}`);
    if (values.time) lines.push(`Preferred time: ${values.time}`);
    lines.push("", "Please confirm product availability, final pricing, delivery fee and delivery timing. I understand this is an order request until confirmed. Thank you!");
    return lines.join("\n");
  }

  function showFinalReview(values, reference, message) {
    const itemRows = cart.map(item => {
      const product = getProduct(item.id);
      return product ? `<div class="final-review-row"><span>${item.qty} × ${escapeHTML(product.name)} <small>${escapeHTML(item.size)}</small></span><strong>${money(product.price * item.qty)}</strong></div>` : "";
    }).join("");
    $("#finalReview").innerHTML = `
      <div class="reference-chip">Order request ${escapeHTML(reference)}</div>
      <div class="final-review-items">${itemRows}</div>
      <div class="final-review-row final-review-subtotal"><span>Subtotal</span><strong>${money(cartSubtotal())}</strong></div>
      <div class="final-review-row"><span>Delivery fee</span><strong>${Number.isFinite(config.deliveryFee) ? money(config.deliveryFee) : "To be confirmed"}</strong></div>
      <div class="final-customer"><strong>Deliver to</strong><p>${escapeHTML(values.fullName)} · ${escapeHTML(values.phone)}</p><p>${escapeHTML(values.address)}, ${escapeHTML(values.area)}, ${escapeHTML(values.city)}, ${escapeHTML(values.state)}</p>${values.landmark ? `<p>Landmark: ${escapeHTML(values.landmark)}</p>` : ""}${values.instructions ? `<p>Instructions: ${escapeHTML(values.instructions)}</p>` : ""}</div>
      <p class="form-note">The message will be prefilled in WhatsApp. Your order is not sent until you press Send there.</p>`;
    $("#openWhatsApp").dataset.message = message;
    closeCheckout();
    $("#orderPreviewModal").classList.add("is-open");
    $("#orderPreviewModal").setAttribute("aria-hidden", "false");
    document.body.classList.add("overlay-open");
    $("#openWhatsApp").focus();
  }

  function closePreview() {
    $("#orderPreviewModal").classList.remove("is-open");
    $("#orderPreviewModal").setAttribute("aria-hidden", "true");
    document.body.classList.remove("overlay-open");
  }

  function sendToWhatsApp() {
    const number = String(config.whatsappNumber || "").replace(/\D/g, "");
    if (!number) {
      showToast("WhatsApp number isn't configured yet.");
      return;
    }
    const message = $("#openWhatsApp").dataset.message || "";
    if (!message) {
      showToast("Please review your order again.");
      return;
    }
    const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    closePreview();
    showToast("WhatsApp is opening. Press Send there to submit your request.");
  }

  function groupOrder() {
    const message = [
      "Hi Crave & Sip! I'm interested in a group order.",
      "",
      "Event type: [party / office / church / family / other]",
      "Event date: [please add date]",
      "Estimated quantity: [please add quantity]",
      "Delivery area: [please add area]",
      "",
      "Please share available drinks, pricing, delivery arrangements and timing. Thank you!"
    ].join("\n");
    const number = String(config.whatsappNumber || "").replace(/\D/g, "");
    if (!number) return showToast("WhatsApp number isn't configured yet.");
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }

  // Main interactions
  $("#productGrid").addEventListener("click", event => {
    const button = event.target.closest("[data-add]");
    if (button) addToCart(button.dataset.add);
  });

  $(".filter-list").addEventListener("click", event => {
    const button = event.target.closest("[data-filter]");
    if (!button) return;
    activeFilter = button.dataset.filter;
    renderProducts();
  });

  $("#cartContents").addEventListener("click", event => {
    const qtyButton = event.target.closest("[data-qty]");
    const removeButton = event.target.closest("[data-remove]");
    if (qtyButton) {
      const item = cart.find(entry => entry.id === qtyButton.dataset.id && entry.size === qtyButton.dataset.size);
      if (item) setQuantity(item.id, item.size, item.qty + Number(qtyButton.dataset.qty));
    }
    if (removeButton) setQuantity(removeButton.dataset.remove, removeButton.dataset.size, 0);
  });

  $("#cartTrigger").addEventListener("click", openCart);
  $("#viewBagButton").addEventListener("click", openCart);
  $("#closeCart").addEventListener("click", closeCart);
  $("#drawerBackdrop").addEventListener("click", closeCart);
  $("#continueShopping").addEventListener("click", closeCart);
  $("#checkoutButton").addEventListener("click", openCheckout);
  $("#closeCheckout").addEventListener("click", closeCheckout);
  $("#backToBag").addEventListener("click", () => { closeCheckout(); openCart(); });
  $("#closePreview").addEventListener("click", closePreview);
  $("#editOrder").addEventListener("click", () => { closePreview(); $("#checkoutModal").classList.add("is-open"); $("#checkoutModal").setAttribute("aria-hidden", "false"); document.body.classList.add("overlay-open"); });
  $("#openWhatsApp").addEventListener("click", sendToWhatsApp);
  $("#groupOrderButton").addEventListener("click", groupOrder);

  $("#checkoutForm").addEventListener("input", event => {
    if (event.target.matches("input, textarea")) {
      const field = event.target.closest(".field");
      if (field) {
        $(".field-error", field).textContent = "";
        event.target.removeAttribute("aria-invalid");
      }
      checkoutValues = getFormValues();
    }
  });

  $("#checkoutForm").addEventListener("submit", event => {
    event.preventDefault();
    if (!validateForm()) return;
    const values = getFormValues();
    const reference = orderReference();
    const message = buildOrderMessage(values, reference);
    showFinalReview(values, reference, message);
  });

  const menuToggle = $("#menuToggle");
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    $("#primaryNav").classList.toggle("is-open", !isOpen);
    menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  });
  $$("#primaryNav a").forEach(link => link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    $("#primaryNav").classList.remove("is-open");
  }));

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      if ($("#orderPreviewModal").classList.contains("is-open")) closePreview();
      else if ($("#checkoutModal").classList.contains("is-open")) closeCheckout();
      else if ($("#cartDrawer").classList.contains("is-open")) closeCart();
    }
  });

  $("#year").textContent = new Date().getFullYear();
  renderProducts();
  renderCart();
  updateCartCount();
})();