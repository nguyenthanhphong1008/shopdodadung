const products = [
  { id: 1, name: "Bút bi xanh Thiên Long", price: 5000, category: "but", label: "Bút viết", emoji: "🖊️", image: "images/pen.jpg", bg: "#eaf2ff", tag: "Bán chạy" },
  { id: 2, name: "Bút chì HB", price: 4000, category: "but", label: "Bút viết", emoji: "✏️", image: "images/pencil.jpg", bg: "#fff2dc" },
  { id: 3, name: "Bút highlight 4 màu", price: 28000, category: "but", label: "Bút viết", emoji: "🖍️", image: "images/highlight.jpg", bg: "#f9eafa", tag: "Mới" },
  { id: 4, name: "Vở kẻ ngang 200 trang", price: 18000, category: "vo", label: "Vở & sổ", emoji: "📓", image: "images/book200.jpg", bg: "#e8f5ed" },
  { id: 5, name: "Sổ tay mini", price: 25000, category: "vo", label: "Vở & sổ", emoji: "📒", image: "images/so.jpg", bg: "#fff0e6" },
  { id: 6, name: "Thước kẻ 20cm", price: 7000, category: "dungcu", label: "Dụng cụ học tập", emoji: "📏", image: "images/cc.jpg", bg: "#eaf3f8" },
  { id: 7, name: "Bộ compa học sinh", price: 22000, category: "dungcu", label: "Dụng cụ học tập", emoji: "📐", image: "images/compa.jpg", bg: "#f1edff" },
  { id: 8, name: "Hộp bút vải", price: 35000, category: "khac", label: "Khác", emoji: "🧰", image: "images/hopbut.jpg", bg: "#f9e9ed", tag: "Ưa thích" },
  { id: 9, name: "Tẩy trắng nhỏ", price: 5000, category: "dungcu", label: "Dụng cụ học tập", emoji: "🧽", image: "images/tay.jpg", bg: "#f2f2ed" },
  { id: 10, name: "Giấy note nhiều màu", price: 15000, category: "khac", label: "Khác", emoji: "🗒️", image: "images/note.jpg", bg: "#fff5d9" },
  { id: 11, name: "Bút lông bảng", price: 12000, category: "but", label: "Bút viết", emoji: "🖋️", image: "images/long.jpg", bg: "#e9f0ff" },
  { id: 12, name: "Bìa hồ sơ", price: 9000, category: "khac", label: "Khác", emoji: "📁", image: "images/hs.jpeg", bg: "#e9f5ef" }
];

let cart = [];
let activeCategory = "all";
const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const cartPanel = document.getElementById("cartPanel");
const overlay = document.getElementById("overlay");

const money = value => value.toLocaleString("vi-VN") + "₫";

function renderProducts() {
  const keyword = searchInput.value.trim().toLowerCase();
  const filtered = products.filter(product => {
    const matchCategory = activeCategory === "all" || product.category === activeCategory;
    const matchName = product.name.toLowerCase().includes(keyword);
    return matchCategory && matchName;
  });

  productGrid.innerHTML = filtered.map(product => `
    <article class="product-card">
      <div class="product-image" style="background:${product.bg}">
        ${product.tag ? `<span class="tag">${product.tag}</span>` : ""}
        <img src="${product.image}" alt="${product.name}" loading="lazy">
      </div>
      <div class="product-info">
        <span class="product-category">${product.label}</span>
        <h3>${product.name}</h3>
        <div class="product-bottom">
          <span class="price">${money(product.price)}</span>
          <button class="add-button" onclick="addToCart(${product.id})" aria-label="Thêm ${product.name}">+</button>
        </div>
      </div>
    </article>
  `).join("");

  document.getElementById("emptyMessage").hidden = filtered.length !== 0;
}

function addToCart(id) {
  const found = cart.find(item => item.id === id);
  if (found) found.quantity++;
  else cart.push({ ...products.find(product => product.id === id), quantity: 1 });
  renderCart();
  showToast("Đã thêm sản phẩm vào giỏ hàng!");
}

function changeQuantity(id, amount) {
  const item = cart.find(product => product.id === id);
  if (!item) return;
  item.quantity += amount;
  if (item.quantity <= 0) cart = cart.filter(product => product.id !== id);
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  renderCart();
}

function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  document.getElementById("cartCount").textContent = count;
  document.getElementById("cartTotal").textContent = money(total);

  const cartItems = document.getElementById("cartItems");
  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="empty-message">Giỏ hàng đang trống 🛒<br>Hãy chọn vài món đồ nhé!</p>';
    return;
  }

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-emoji" style="background:${item.bg}"><img src="${item.image}" alt="${item.name}"></div>
      <div>
        <h4>${item.name}</h4>
        <small>${money(item.price)}</small>
        <div class="quantity">
          <button onclick="changeQuantity(${item.id}, -1)">−</button>
          <span>${item.quantity}</span>
          <button onclick="changeQuantity(${item.id}, 1)">+</button>
        </div>
      </div>
      <button class="remove" onclick="removeFromCart(${item.id})">Xóa</button>
    </div>
  `).join("");
}

function openCart() {
  cartPanel.classList.add("show");
  overlay.classList.add("show");
}
function closeCart() {
  cartPanel.classList.remove("show");
  overlay.classList.remove("show");
}
let toastTimer;
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

document.getElementById("categoryFilters").addEventListener("click", event => {
  const button = event.target.closest(".filter");
  if (!button) return;
  activeCategory = button.dataset.category;
  document.querySelectorAll(".filter").forEach(item => item.classList.remove("active"));
  button.classList.add("active");
  renderProducts();
});

searchInput.addEventListener("input", renderProducts);
document.getElementById("openCart").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);
document.getElementById("checkoutButton").addEventListener("click", () => {
  if (cart.length === 0) {
    showToast("Giỏ hàng của bạn đang trống!");
    return;
  }
  alert("Đặt hàng thành công! Cảm ơn bạn đã mua sắm tại Stationery Shop.");
  cart = [];
  renderCart();
  closeCart();
});

renderProducts();
renderCart();
