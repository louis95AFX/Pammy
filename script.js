const products = [
            { id: 1, name: "Midnight Silk Hoodie", price: 1299, category: "clothing", img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=400&q=80" },
            { id: 2, name: "Urban Velocity Sneakers", price: 2450, category: "shoes", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80" },
            { id: 3, name: "Gold-Trimmed Palette Cap", price: 450, category: "accessories", img: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=400&q=80" },
            { id: 4, name: "Ivory Linen Trousers", price: 1800, category: "clothing", img: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=400&q=80" },
            { id: 5, name: "Brown", price: 1800, category: "bags", img: "1.jpeg" },
            { id: 6, name: "White", price: 1800, category: "bags", img: "2.jpeg" },
            { id: 7, name: "Black bag", price: 1800, category: "bags", img: "3.jpeg" },
            { id: 8, name: "Colored Bags", price: 1800, category: "bags", img: "4.jpeg" },
            { id: 9, name: "Red & White", price: 1800, category: "bags", img: "5.jpeg" },
            { id: 10, name: "Blue", price: 1800, category: "bags", img: "6.jpeg" },
            { id: 11, name: "Colored bags", price: 1800, category: "bags", img: "7.jpeg" },
            { id: 12, name: "Brown & White", price: 1800, category: "bags", img: "8.jpeg" },
            { id: 13, name: "Colored bags", price: 1800, category: "bags", img: "9.jpeg" },
            { id: 14, name: "The Pammy Sculpted Bucket Bag", price: 1800, category: "bags", img: "10.jpeg" },

            { id: 15, name: "Brown Bucket Bag", price: 1800, category: "bags", img: "11.jpeg" },
            { id: 16, name: "Baindasishu", price: 1800, category: "bags", img: "12.jpeg" },
            { id: 17, name: "Essorted Colored", price: 1800, category: "bags", img: "13.jpeg" },
            { id: 18, name: "Colored Bags", price: 1800, category: "bags", img: "14.jpeg" },
            { id: 19, name: "Vuillard", price: 1800, category: "bags", img: "15.jpeg" },
            { id: 20, name: "Essorted Colors", price: 1800, category: "bags", img: "16.jpeg" },
            { id: 21, name: "Heart Bags", price: 1800, category: "bags", img: "17.jpeg" },
            { id: 22, name: "Brown & White", price: 1800, category: "bags", img: "18.jpeg" },
            { id: 23, name: "Colored bags", price: 1800, category: "bags", img: "19.jpeg" },
            { id: 24, name: "Clutch Bag", price: 1800, category: "bags", img: "20.jpeg" },
            { id: 25, name: "Heart Bags", price: 1800, category: "bags", img: "17.jpeg" },

            { id: 26, name: "White", price: 1800, category: "bags", img: "21.jpeg" },
            { id: 27, name: "Colored bags", price: 1800, category: "bags", img: "22.jpeg" },
            { id: 28, name: "Clutch Bag", price: 1800, category: "bags", img: "23.jpeg" }
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