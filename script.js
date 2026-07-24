
// --- STATIC / HARDCODED PRODUCTS (FALLBACK) ---
const hardcodedProducts = [
    { 
        id: 99999, // Static offset ID to prevent any conflicts with database auto-increment IDs
        name: "Formal Pants", 
        price: 350, 
        category: "clothing", 
        variants: [
            { color: "Classic Pink", img: "pants1.jpeg" },
            { color: "Tan Khaki", img: "pants2.jpeg" },
            { color: "Black", img: "pants4.jpeg" },
            { color: "Charcoal", img: "pants5.jpeg" },
            { color: "Olive Green", img: "pants3.jpeg" },
            { color: "Slate Grey", img: "pants6.jpeg" },
            { color: "Taupe Grey", img: "pants7.jpeg" },
            { color: "Cream White", img: "pants8.jpeg" },
            { color: "Sky Blue", img: "pants9.jpeg" },
            { color: "Mint Teal", img: "pants10.jpeg" },
            { color: "Classic Beige", img: "pants11.jpeg" }
        ]
    }
];

// Initialize global products list with hardcoded defaults
let products = [...hardcodedProducts];

// Available structural sizes for the collection
const availableSizes = [28, 30, 32, 34, 36, 38];

let cart = [];
let activeProduct = null;
let selectedVariantIndex = 0;
let selectedSize = null; // Track selected size state

// Mapping specific descriptive variant names to clean CSS background fallback colors/hex values
const colorMap = {
    "classic pink": "#ebc3db",
    "tan khaki": "#b89765",
    "noir black": "#0d0d0d",
    "black": "#0d0d0d",
    "charcoal": "#2b2b2b",
    "olive green": "#556b2f",
    "slate grey": "#708090",
    "taupe grey": "#8b8589",
    "cream white": "#f5f5dc",
    "sky blue": "#87ceeb",
    "mint teal": "#5f9ea0",
    "classic beige": "#d2b48c"
};

// --- FETCH PRODUCTS FROM DATABASE API ---
async function fetchDatabaseProducts() {
    try {
        const response = await fetch('api.php?action=get_products');
        const dbProducts = await response.json();
        
        if (Array.isArray(dbProducts)) {
            // Merge hardcoded essentials with newly added products from MySQL
            products = [...hardcodedProducts, ...dbProducts];
        } else if (dbProducts && dbProducts.error) {
            console.error("Database returned an error:", dbProducts.error);
        }
    } catch (error) {
        console.error("Failed to fetch products from backend database:", error);
    } finally {
        // Render whatever we have available (at least fallback options)
        renderProducts(products);
    }
}

// --- PRODUCT GRID RENDERING ---
function renderProducts(items) {
    const grid = document.getElementById('productGrid');
    if (!grid) return;
    
    grid.innerHTML = items.map(p => {
        const defaultImage = p.variants && p.variants[0] ? p.variants[0].img : '';
        const variantList = p.variants || [];
        
        return `
            <div class="card" onclick="openQuickView(${p.id})">
                <div class="image-container">
                    <img src="${defaultImage}" alt="${p.name}">
                </div>
                <div class="card-info">
                    <h3>${p.name}</h3>
                    <p>R${p.price.toLocaleString()}</p>
                    <div class="variant-dots">
                        ${variantList.map(v => {
                            const bg = colorMap[v.color.toLowerCase()] || v.color.toLowerCase();
                            return `<span class="dot" style="background-color: ${bg}" title="${v.color}"></span>`;
                        }).join('')}
                    </div>
                    <button class="add-btn" onclick="event.stopPropagation(); openQuickView(${p.id})">View Options</button>
                </div>
            </div>
        `;
    }).join('');
}

// --- QUICK VIEW MODAL LOGIC ---
function openQuickView(id) {
    activeProduct = products.find(p => p.id === id);
    if (!activeProduct) return;
    
    selectedVariantIndex = 0; // Reset focus back to the default variation on open
    selectedSize = null;      // Reset size choice state on modal load
    
    document.getElementById('modalTitle').innerText = activeProduct.name;
    document.getElementById('modalPrice').innerText = `R${activeProduct.price.toLocaleString()}`;
    
    updateModalGallery();
    renderSizeSelectors();
    document.body.classList.add('modal-active');
}

function closeQuickView() {
    document.body.classList.remove('modal-active');
    activeProduct = null;
}

function updateModalGallery() {
    const mainImg = document.getElementById('modalMainImage');
    const selectorContainer = document.getElementById('colorSelectors');
    
    if (!activeProduct || !activeProduct.variants || activeProduct.variants.length === 0) return;

    const currentVariant = activeProduct.variants[selectedVariantIndex];
    
    // Updates the primary displayed modal preview image
    mainImg.src = currentVariant.img;
    mainImg.alt = `${activeProduct.name} - ${currentVariant.color}`;
    
    // Generate clickable variant choice switches
    selectorContainer.innerHTML = activeProduct.variants.map((v, idx) => {
        const bg = colorMap[v.color.toLowerCase()] || v.color.toLowerCase();
        return `
            <button class="color-chip ${idx === selectedVariantIndex ? 'active' : ''}" 
                    onclick="selectVariant(${idx})">
                <span class="chip-preview" style="background-color: ${bg}"></span>
                ${v.color}
            </button>
        `;
    }).join('');
}

function selectVariant(index) {
    selectedVariantIndex = index;
    updateModalGallery();
}

// Render sizes dynamically into the layout wrapper interface
function renderSizeSelectors() {
    const sizeContainer = document.getElementById('sizeSelectors');
    if (!sizeContainer) return;

    sizeContainer.innerHTML = availableSizes.map(size => `
        <button class="size-chip ${selectedSize === size ? 'active' : ''}" onclick="selectSize(${size})">
            ${size}
        </button>
    `).join('');
}

function selectSize(size) {
    selectedSize = size;
    renderSizeSelectors();
}

// Target variant and size selection handling inside opened display modal window
function addSelectedToCart() {
    if (!activeProduct) return;
    
    // Enforce selection of item sizing before completing validation loops
    if (!selectedSize) {
        alert("Please select a size before adding to bag.");
        return;
    }

    const variant = activeProduct.variants[selectedVariantIndex];
    addToCart(activeProduct, variant.color, variant.img, selectedSize);
    closeQuickView();
}

function addToCart(product, chosenColor, chosenImg, chosenSize) {
    cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        color: chosenColor,
        img: chosenImg,
        size: chosenSize
    });
    updateCartUI();
    if (!document.body.classList.contains('cart-active')) toggleCart();
}

function updateCartUI() {
    const list = document.getElementById('cartList');
    const total = document.getElementById('cartTotal');
    
    list.innerHTML = cart.map((item, idx) => `
        <div class="cart-item">
            <div style="display: flex; gap: 12px; align-items: center;">
                <img src="${item.img}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 6px;">
                <div>
                    <div style="font-weight:600">${item.name}</div>
                    <div style="font-size:0.75rem; color: var(--primary)">Color: ${item.color} | Size: ${item.size}</div>
                    <div style="font-size:0.8rem; color:var(--text-dim)">R${item.price.toLocaleString()}</div>
                </div>
            </div>
            <button class="icon-btn" onclick="removeItem(${idx})" style="font-size:0.8rem">Remove</button>
        </div>
    `).join('');
    
    const sum = cart.reduce((acc, item) => acc + item.price, 0);
    total.innerText = `R${sum.toLocaleString()}`;
}

function removeItem(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function toggleCart() {
    document.body.classList.toggle('cart-active');
}

// --- NAVIGATION & SEARCH HELPERS ---
function toggleTheme() {
    document.body.classList.toggle('light-theme');
}

function handleCheckout() {
    if (cart.length === 0) return alert("Your bag is empty");
    alert("Redirecting to Secure Gateway...");
}

function toggleSearch() {
    const container = document.querySelector('.search-container');
    const input = document.getElementById('searchInput');
    
    container.classList.toggle('active');
    
    if (container.classList.contains('active')) {
        input.focus();
    } else {
        input.value = "";
        renderProducts(products);
    }
}

function handleSearch(event) {
    const query = event.target.value.toLowerCase();
    
    const filtered = products.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        (p.variants && p.variants.some(v => v.color.toLowerCase().includes(query)))
    );
    
    renderProducts(filtered);
    
    if (query !== "") {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    }
}

function filterItems(cat, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    
    if (cat === 'all') {
        renderProducts(products);
    } else {
        renderProducts(products.filter(p => p.category === cat));
    }
}

// --- INITIALIZE APPLICATION ---
fetchDatabaseProducts();

