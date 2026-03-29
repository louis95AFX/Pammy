const products = [
            { id: 1, name: "Midnight Silk Hoodie", price: 1299, category: "clothing", img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=400&q=80" },
            { id: 2, name: "Urban Velocity Sneakers", price: 2450, category: "shoes", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80" },
            { id: 3, name: "Gold-Trimmed Palette Cap", price: 450, category: "accessories", img: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=400&q=80" },
            { id: 4, name: "Ivory Linen Trousers", price: 1800, category: "clothing", img: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=400&q=80" }
        ];

        let cart = [];

        function renderProducts(items) {
            const grid = document.getElementById('productGrid');
            grid.innerHTML = items.map(p => `
                <div class="card">
                    <div class="image-container">
                        <img src="${p.img}" alt="${p.name}">
                    </div>
                    <div class="card-info">
                        <h3>${p.name}</h3>
                        <p>R${p.price.toLocaleString()}</p>
                        <button class="add-btn" onclick="addToCart(${p.id})">Add to Bag</button>
                    </div>
                </div>
            `).join('');
        }

        function filterItems(cat, btn) {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            if(cat === 'all') renderProducts(products);
            else renderProducts(products.filter(p => p.category === cat));
        }

        function addToCart(id) {
            const product = products.find(p => p.id === id);
            cart.push(product);
            updateCartUI();
            if(!document.body.classList.contains('cart-active')) toggleCart();
        }

        function updateCartUI() {
            const list = document.getElementById('cartList');
            const total = document.getElementById('cartTotal');
            list.innerHTML = cart.map((item, idx) => `
                <div class="cart-item">
                    <div>
                        <div style="font-weight:600">${item.name}</div>
                        <div style="font-size:0.8rem; color:var(--text-dim)">R${item.price}</div>
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

        function toggleTheme() {
            document.body.classList.toggle('light-theme');
        }

        function handleCheckout() {
            if(cart.length === 0) return alert("Your bag is empty");
            alert("Redirecting to Secure Gateway...");
            // Here you would integrate PayFast or Yoco SDK
        }

        function toggleSearch() {
    const container = document.querySelector('.search-container');
    const input = document.getElementById('searchInput');
    
    container.classList.toggle('active');
    
    if (container.classList.contains('active')) {
        input.focus();
    } else {
        input.value = ""; // Clear search on close
        renderProducts(products); // Reset grid
    }
}

function handleSearch(event) {
    const query = event.target.value.toLowerCase();
    
    // Filter the original products array
    const filtered = products.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.category.toLowerCase().includes(query)
    );
    
    renderProducts(filtered);
    
    // Optional: Reset active filter buttons UI
    if (query !== "") {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    }
}
        // Initialize
        renderProducts(products);