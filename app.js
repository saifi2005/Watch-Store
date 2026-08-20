document.addEventListener("DOMContentLoaded", () => {

    initHeroSlider();
    renderFeaturedProducts();
    renderNewArrivals();

    updateCartCount();
    updateWishlistCount();

    initMobileMenu();
    initSearch();
    initNewsletter();

});


/* =========================
   STORAGE
========================= */

function getCart() {
    return JSON.parse(localStorage.getItem("chronovaCart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("chronovaCart", JSON.stringify(cart));
}

function getWishlist() {
    return JSON.parse(localStorage.getItem("chronovaWishlist")) || [];
}

function saveWishlist(wishlist) {
    localStorage.setItem(
        "chronovaWishlist",
        JSON.stringify(wishlist)
    );
}


/* =========================
   CART COUNT
========================= */

function updateCartCount() {

    const cart = getCart();

    const count = cart.reduce(
        (total, item) => total + Number(item.quantity || 0),
        0
    );

    const element = document.getElementById("cartCount");

    if (element) {
        element.textContent = count;
    }
}


/* =========================
   WISHLIST COUNT
========================= */

function updateWishlistCount() {

    const wishlist = getWishlist();

    const element = document.getElementById("wishlistCount");

    if (element) {
        element.textContent = wishlist.length;
    }
}


/* =========================
   ADD CART
========================= */

function addToCart(productId) {

    const product = products.find(
        item => item.id === Number(productId)
    );

    if (!product) return;

    const cart = getCart();

    const existing = cart.find(
        item => item.id === product.id
    );

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            quantity: 1
        });
    }

    saveCart(cart);
    updateCartCount();

    showToast(`${product.name} added to cart`);
}


/* =========================
   WISHLIST
========================= */

function toggleWishlist(productId) {

    const wishlist = getWishlist();

    const id = Number(productId);

    const index = wishlist.indexOf(id);

    if (index !== -1) {

        wishlist.splice(index, 1);

        showToast("Removed from wishlist");

    } else {

        wishlist.push(id);

        showToast("Added to wishlist");

    }

    saveWishlist(wishlist);

    updateWishlistCount();

    renderFeaturedProducts();
    renderNewArrivals();

    if (typeof renderWishlistPage === "function") {
        renderWishlistPage();
    }
}


/* =========================
   PRODUCT CARD
========================= */

function createProductCard(product) {

    const wishlist = getWishlist();

    const isWishlisted =
        wishlist.includes(product.id);

    return `
        <article class="product-card">

            <div class="product-image">

                ${
                    product.discount
                    ? `<span class="sale-badge">-${product.discount}%</span>`
                    : ""
                }

                ${
                    product.newArrival
                    ? `<span class="new-badge">NEW</span>`
                    : ""
                }

                <button
                    class="wishlist-btn ${isWishlisted ? "active" : ""}"
                    onclick="toggleWishlist(${product.id})"
                    aria-label="Wishlist"
                >
                    ${isWishlisted ? "♥" : "♡"}
                </button>

                <a href="product-detail.html?id=${product.id}">
                    <img
                        src="${product.image}"
                        alt="${product.name}"
                        loading="lazy"
                    >
                </a>

                <button
                    class="quick-add"
                    onclick="addToCart(${product.id})"
                >
                    Add To Cart
                </button>

            </div>

            <div class="product-info">

                <div class="product-brand">
                    ${product.brand}
                </div>

                <h3>
                    <a href="product-detail.html?id=${product.id}">
                        ${product.name}
                    </a>
                </h3>

                <div class="product-rating">
                    <span class="stars">★★★★★</span>
                    <span>(${product.reviewCount})</span>
                </div>

                <div class="product-price">

                    <strong>
                        $${product.price.toFixed(2)}
                    </strong>

                    <del>
                        $${product.originalPrice.toFixed(2)}
                    </del>

                </div>

            </div>

        </article>
    `;
}


/* =========================
   FEATURED
========================= */

function renderFeaturedProducts() {

    const container =
        document.getElementById("featuredProducts");

    if (!container) return;

    const featured =
        products
            .filter(product => product.featured)
            .slice(0, 8);

    container.innerHTML =
        featured.map(createProductCard).join("");
}


/* =========================
   NEW ARRIVALS
========================= */

function renderNewArrivals() {

    const container =
        document.getElementById("newArrivals");

    if (!container) return;

    const newProducts =
        products
            .filter(product => product.newArrival)
            .slice(0, 8);

    container.innerHTML =
        newProducts.map(createProductCard).join("");
}


/* =========================
   HERO SLIDER
========================= */

function initHeroSlider() {

    const slides =
        document.querySelectorAll(".hero-slide");

    const dots =
        document.querySelectorAll("#heroDots button");

    const next =
        document.getElementById("heroNext");

    const prev =
        document.getElementById("heroPrev");

    if (!slides.length) return;

    let current = 0;

    function showSlide(index) {

        slides.forEach(slide =>
            slide.classList.remove("active")
        );

        dots.forEach(dot =>
            dot.classList.remove("active")
        );

        slides[index].classList.add("active");

        if (dots[index]) {
            dots[index].classList.add("active");
        }

        current = index;
    }

    function nextSlide() {

        let index = current + 1;

        if (index >= slides.length) {
            index = 0;
        }

        showSlide(index);
    }

    function previousSlide() {

        let index = current - 1;

        if (index < 0) {
            index = slides.length - 1;
        }

        showSlide(index);
    }

    if (next) {
        next.addEventListener("click", nextSlide);
    }

    if (prev) {
        prev.addEventListener("click", previousSlide);
    }

    dots.forEach((dot, index) => {

        dot.addEventListener(
            "click",
            () => showSlide(index)
        );

    });

    setInterval(nextSlide, 6000);
}


/* =========================
   MOBILE MENU
========================= */

function initMobileMenu() {

    const button =
        document.getElementById("menuToggle");

    const nav =
        document.getElementById("mainNav");

    if (!button || !nav) return;

    button.addEventListener("click", () => {

        nav.classList.toggle("open");
        button.classList.toggle("active");

    });
}


/* =========================
   SEARCH
========================= */

function initSearch() {

    const toggle =
        document.querySelector(".search-toggle");

    const panel =
        document.getElementById("searchPanel");

    const close =
        document.getElementById("closeSearch");

    const input =
        document.getElementById("globalSearch");

    const suggestions =
        document.getElementById("searchSuggestions");

    if (!toggle || !panel || !input) return;

    toggle.addEventListener("click", () => {

        panel.classList.toggle("open");

        if (panel.classList.contains("open")) {

            setTimeout(() => {
                input.focus();
            }, 150);

        }

    });

    if (close) {

        close.addEventListener("click", () => {
            panel.classList.remove("open");
        });

    }

    input.addEventListener("input", () => {

        const query =
            input.value.trim().toLowerCase();

        if (!query) {

            suggestions.innerHTML = "";

            return;
        }

        const matches =
            products
                .filter(product =>
                    product.name.toLowerCase().includes(query) ||
                    product.brand.toLowerCase().includes(query) ||
                    product.category.toLowerCase().includes(query) ||
                    product.gender.toLowerCase().includes(query) ||
                    product.movement.toLowerCase().includes(query)
                )
                .slice(0, 6);

        if (!matches.length) {

            suggestions.innerHTML = `
                <div class="no-search">
                    No watches found for "${query}"
                </div>
            `;

            return;
        }

        suggestions.innerHTML =
            matches.map(product => `
                <a
                    href="product-detail.html?id=${product.id}"
                    class="search-result"
                >

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                    >

                    <div>
                        <strong>${product.name}</strong>
                        <span>
                            ${product.category} • $${product.price}
                        </span>
                    </div>

                </a>
            `).join("");

    });
}


/* =========================
   NEWSLETTER
========================= */

function initNewsletter() {

    const form =
        document.getElementById("newsletterForm");

    if (!form) return;

    form.addEventListener("submit", event => {

        event.preventDefault();

        const input =
            document.getElementById("newsletterEmail");

        const email = input.value.trim();

        if (!email) return;

        localStorage.setItem(
            "chronovaNewsletter",
            email
        );

        showToast(
            "Welcome to the Chronova Circle!"
        );

        form.reset();

    });
}


/* =========================
   TOAST
========================= */

function showToast(message) {

    const toast =
        document.getElementById("toast");

    const text =
        document.getElementById("toastMessage");

    if (!toast || !text) return;

    text.textContent = message;

    toast.classList.add("show");

    clearTimeout(window.toastTimer);

    window.toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);
}