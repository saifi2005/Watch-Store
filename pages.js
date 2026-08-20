document.addEventListener("DOMContentLoaded", () => {

    renderProductsPage();
    renderProductDetail();
    renderCartPage();
    renderWishlistPage();

    initLogin();
    initContactForm();

    updateCartCount();
    updateWishlistCount();

});


/* =====================================================
   PRODUCTS PAGE
===================================================== */

function renderProductsPage() {

    const container =
        document.getElementById("productsContainer");

    if (!container) return;

    const searchParams =
        new URLSearchParams(window.location.search);

    let list = [...products];

    const category =
        searchParams.get("category");

    const sort =
        searchParams.get("sort");

    const discount =
        searchParams.get("discount");


    /* URL CATEGORY */

    if (category) {

        if (
            category === "Men" ||
            category === "Women"
        ) {

            list = list.filter(
                product => product.gender === category
            );

        } else {

            list = list.filter(
                product => product.category === category
            );

        }

    }


    /* DISCOUNT */

    if (discount === "true") {

        list = list.filter(
            product => product.discount > 0
        );

    }


    /* NEWEST */

    if (sort === "newest") {

        list = list.filter(
            product => product.newArrival
        );

    }


    const searchInput =
        document.getElementById("productSearch");

    const categorySelect =
        document.getElementById("categoryFilter");

    const genderSelect =
        document.getElementById("genderFilter");

    const sortSelect =
        document.getElementById("sortProducts");


    function applyFilters() {

        let filtered = [...products];


        const search =
            searchInput
                ? searchInput.value.trim().toLowerCase()
                : "";


        const selectedCategory =
            categorySelect
                ? categorySelect.value
                : "";


        const selectedGender =
            genderSelect
                ? genderSelect.value
                : "";


        const selectedSort =
            sortSelect
                ? sortSelect.value
                : "";


        /* SEARCH */

        if (search) {

            filtered =
                filtered.filter(product =>

                    product.name
                        .toLowerCase()
                        .includes(search)

                    ||

                    product.brand
                        .toLowerCase()
                        .includes(search)

                    ||

                    product.category
                        .toLowerCase()
                        .includes(search)

                    ||

                    product.gender
                        .toLowerCase()
                        .includes(search)

                );

        }


        /* CATEGORY */

        if (selectedCategory) {

            filtered =
                filtered.filter(
                    product =>
                        product.category === selectedCategory
                );

        }


        /* GENDER */

        if (selectedGender) {

            filtered =
                filtered.filter(
                    product =>
                        product.gender === selectedGender
                );

        }


        /* PRICE LOW */

        if (selectedSort === "price-low") {

            filtered.sort(
                (a, b) =>
                    a.price - b.price
            );

        }


        /* PRICE HIGH */

        if (selectedSort === "price-high") {

            filtered.sort(
                (a, b) =>
                    b.price - a.price
            );

        }


        /* RATING */

        if (selectedSort === "rating") {

            filtered.sort(
                (a, b) =>
                    b.rating - a.rating
            );

        }


        /* NEWEST */

        if (selectedSort === "newest") {

            filtered =
                filtered.filter(
                    product =>
                        product.newArrival
                );

        }


        renderProductResults(
            filtered,
            container
        );

    }


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            applyFilters
        );

    }


    if (categorySelect) {

        categorySelect.addEventListener(
            "change",
            applyFilters
        );

    }


    if (genderSelect) {

        genderSelect.addEventListener(
            "change",
            applyFilters
        );

    }


    if (sortSelect) {

        sortSelect.addEventListener(
            "change",
            applyFilters
        );

    }


    renderProductResults(
        list,
        container
    );

}


/* =====================================================
   RENDER PRODUCT RESULTS
===================================================== */

function renderProductResults(
    list,
    container
) {

    const count =
        document.getElementById("productCount");


    if (count) {

        count.textContent =
            `${list.length} Watches`;

    }


    if (!list.length) {

        container.innerHTML = `

            <div class="empty-results">

                <h3>No watches found</h3>

                <p>
                    Try another category or search term.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        list
            .map(createProductCard)
            .join("");

}


/* =====================================================
   PRODUCT DETAIL
===================================================== */

function renderProductDetail() {

    const container =
        document.getElementById("productDetail");

    if (!container) return;


    const params =
        new URLSearchParams(
            window.location.search
        );


    const id =
        Number(
            params.get("id")
        );


    const product =
        products.find(
            item => item.id === id
        );


    if (!product) {

        container.innerHTML = `

            <div class="empty-results">

                <h2>Product Not Found</h2>

                <p>
                    The watch you are looking for
                    does not exist.
                </p>

                <a
                    href="products.html"
                    class="btn btn-dark"
                >
                    Back To Shop
                </a>

            </div>

        `;

        return;

    }


    document.title =
        `${product.name} — CHRONOVA`;


    container.innerHTML = `

        <div class="detail-image">

            ${
                product.discount
                ? `
                    <span class="detail-sale">
                        -${product.discount}%
                    </span>
                `
                : ""
            }

            <img
                src="${product.image}"
                alt="${product.name}"
            >

        </div>


        <div class="detail-content">

            <span class="eyebrow dark">
                ${product.category.toUpperCase()}
            </span>


            <div class="detail-brand">
                ${product.brand}
            </div>


            <h1>
                ${product.name}
            </h1>


            <div class="detail-rating">

                <span class="stars">
                    ★★★★★
                </span>

                <span>
                    ${product.rating}
                </span>

                <span>
                    (${product.reviewCount} Reviews)
                </span>

            </div>


            <div class="detail-price">

                <strong>
                    $${product.price.toFixed(2)}
                </strong>

                ${
                    product.originalPrice
                    ? `
                        <del>
                            $${product.originalPrice.toFixed(2)}
                        </del>
                    `
                    : ""
                }

            </div>


            <p class="detail-description">

                A refined CHRONOVA timepiece designed
                for everyday elegance. Built with premium
                materials and precision engineering.

            </p>


            <div class="stock-info">

                ${
                    product.stock <= 10
                    ? `Only ${product.stock} left in stock`
                    : `In Stock — ${product.stock} available`
                }

            </div>


            <div class="quantity-control">

                <button id="minusQuantity">
                    −
                </button>

                <span id="detailQuantity">
                    1
                </span>

                <button id="plusQuantity">
                    +
                </button>

            </div>


            <div class="detail-actions">

                <button
                    class="btn btn-gold"
                    id="detailAddCart"
                >
                    Add To Cart
                </button>


                <button
                    class="detail-wishlist"
                    id="detailWishlist"
                >
                    ${
                        getWishlist().includes(product.id)
                        ? "♥ In Wishlist"
                        : "♡ Add To Wishlist"
                    }
                </button>

            </div>


            <div class="specifications">

                <h3>
                    Specifications
                </h3>


                <div class="spec-grid">

                    <div>
                        <span>Movement</span>
                        <strong>
                            ${product.movement}
                        </strong>
                    </div>


                    <div>
                        <span>Case Size</span>
                        <strong>
                            ${product.caseSize}
                        </strong>
                    </div>


                    <div>
                        <span>Case Material</span>
                        <strong>
                            ${product.caseMaterial}
                        </strong>
                    </div>


                    <div>
                        <span>Strap</span>
                        <strong>
                            ${product.strapMaterial}
                        </strong>
                    </div>


                    <div>
                        <span>Glass</span>
                        <strong>
                            ${product.glass}
                        </strong>
                    </div>


                    <div>
                        <span>Water Resistance</span>
                        <strong>
                            ${product.waterResistance}
                        </strong>
                    </div>


                    <div>
                        <span>Dial Color</span>
                        <strong>
                            ${product.dialColor}
                        </strong>
                    </div>


                    <div>
                        <span>Gender</span>
                        <strong>
                            ${product.gender}
                        </strong>
                    </div>

                </div>

            </div>

        </div>

    `;


    /* QUANTITY */

    let quantity = 1;


    const quantityDisplay =
        document.getElementById(
            "detailQuantity"
        );


    const minusButton =
        document.getElementById(
            "minusQuantity"
        );


    const plusButton =
        document.getElementById(
            "plusQuantity"
        );


    if (minusButton) {

        minusButton.addEventListener(
            "click",
            () => {

                if (quantity > 1) {

                    quantity--;

                    quantityDisplay.textContent =
                        quantity;

                }

            }
        );

    }


    if (plusButton) {

        plusButton.addEventListener(
            "click",
            () => {

                if (quantity < product.stock) {

                    quantity++;

                    quantityDisplay.textContent =
                        quantity;

                }

            }
        );

    }


    /* ADD TO CART */

    const addCartButton =
        document.getElementById(
            "detailAddCart"
        );


    if (addCartButton) {

        addCartButton.addEventListener(
            "click",
            () => {

                const cart =
                    getCart();


                const existing =
                    cart.find(
                        item =>
                            item.id === product.id
                    );


                if (existing) {

                    existing.quantity +=
                        quantity;

                } else {

                    cart.push({

                        id: product.id,

                        quantity: quantity

                    });

                }


                saveCart(cart);

                updateCartCount();


                showToast(
                    `${quantity} × ${product.name} added to cart`
                );

            }
        );

    }


    /* WISHLIST */

    const wishlistButton =
        document.getElementById(
            "detailWishlist"
        );


    if (wishlistButton) {

        wishlistButton.addEventListener(
            "click",
            () => {

                toggleWishlist(
                    product.id
                );


                const isSaved =
                    getWishlist().includes(
                        product.id
                    );


                wishlistButton.textContent =
                    isSaved
                    ? "♥ In Wishlist"
                    : "♡ Add To Wishlist";

            }
        );

    }


    renderRelatedProducts(product);

}


/* =====================================================
   RELATED PRODUCTS
===================================================== */

function renderRelatedProducts(
    currentProduct
) {

    const container =
        document.getElementById(
            "relatedProducts"
        );


    if (!container) return;


    const related =
        products
            .filter(product =>

                product.id !==
                    currentProduct.id

                &&

                (
                    product.category ===
                        currentProduct.category

                    ||

                    product.gender ===
                        currentProduct.gender
                )

            )
            .slice(0, 4);


    container.innerHTML =
        related
            .map(createProductCard)
            .join("");

}


/* =====================================================
   CART
===================================================== */

function renderCartPage() {

    const container =
        document.getElementById(
            "cartContainer"
        );


    if (!container) return;


    const cart =
        getCart();


    if (!cart.length) {

        container.innerHTML = `

            <div class="empty-cart">

                <div class="empty-icon">
                    🛒
                </div>

                <h2>
                    Your Cart Is Empty
                </h2>

                <p>
                    Looks like you haven't added
                    any watches yet.
                </p>

                <a
                    href="products.html"
                    class="btn btn-dark"
                >
                    Continue Shopping
                </a>

            </div>

        `;

        return;

    }


    let subtotal = 0;


    const itemsHTML =
        cart
            .map(item => {

                const product =
                    products.find(
                        product =>
                            product.id === item.id
                    );


                if (!product) return "";


                const total =
                    product.price *
                    item.quantity;


                subtotal += total;


                return `

                    <div class="cart-item">

                        <a
                            href="product-detail.html?id=${product.id}"
                            class="cart-image"
                        >

                            <img
                                src="${product.image}"
                                alt="${product.name}"
                            >

                        </a>


                        <div class="cart-info">

                            <span>
                                ${product.category}
                            </span>

                            <h3>
                                ${product.name}
                            </h3>

                            <strong>
                                $${product.price.toFixed(2)}
                            </strong>

                        </div>


                        <div class="cart-quantity">

                            <button
                                onclick="changeCartQuantity(${product.id}, -1)"
                            >
                                −
                            </button>

                            <span>
                                ${item.quantity}
                            </span>

                            <button
                                onclick="changeCartQuantity(${product.id}, 1)"
                            >
                                +
                            </button>

                        </div>


                        <div class="cart-total">
                            $${total.toFixed(2)}
                        </div>


                        <button
                            class="remove-cart"
                            onclick="removeFromCart(${product.id})"
                            aria-label="Remove item"
                        >
                            ×
                        </button>

                    </div>

                `;

            })
            .join("");


    const shipping =
        subtotal >= 150
        ? 0
        : 15;


    const grandTotal =
        subtotal + shipping;


    container.innerHTML = `

        <div class="cart-layout">


            <div class="cart-items">

                <div class="cart-heading">

                    <h2>
                        Your Shopping Cart
                    </h2>

                    <span>
                        ${cart.length} items
                    </span>

                </div>


                ${itemsHTML}

            </div>


            <aside class="cart-summary">

                <h2>
                    Order Summary
                </h2>


                <div>

                    <span>
                        Subtotal
                    </span>

                    <strong>
                        $${subtotal.toFixed(2)}
                    </strong>

                </div>


                <div>

                    <span>
                        Shipping
                    </span>

                    <strong>
                        ${
                            shipping === 0
                            ? "FREE"
                            : "$15.00"
                        }
                    </strong>

                </div>


                <hr>


                <div class="grand-total">

                    <span>
                        Total
                    </span>

                    <strong>
                        $${grandTotal.toFixed(2)}
                    </strong>

                </div>


                <button
                    class="btn btn-gold checkout-btn"
                    onclick="checkout()"
                >
                    Proceed To Checkout
                </button>


                <a
                    href="products.html"
                    class="continue-shopping"
                >
                    ← Continue Shopping
                </a>

            </aside>


        </div>

    `;

}


/* =====================================================
   CHANGE CART QUANTITY
===================================================== */

function changeCartQuantity(
    productId,
    amount
) {

    const cart =
        getCart();


    const item =
        cart.find(
            item =>
                item.id === Number(productId)
        );


    if (!item) return;


    const product =
        products.find(
            product =>
                product.id === Number(productId)
        );


    item.quantity += amount;


    /* STOCK LIMIT */

    if (
        product &&
        item.quantity > product.stock
    ) {

        item.quantity =
            product.stock;

        showToast(
            "Maximum available stock reached"
        );

    }


    if (item.quantity <= 0) {

        const index =
            cart.indexOf(item);

        cart.splice(
            index,
            1
        );

    }


    saveCart(cart);

    updateCartCount();

    renderCartPage();

}


/* =====================================================
   REMOVE FROM CART
===================================================== */

function removeFromCart(
    productId
) {

    let cart =
        getCart();


    cart =
        cart.filter(
            item =>
                item.id !==
                Number(productId)
        );


    saveCart(cart);

    updateCartCount();


    showToast(
        "Removed from cart"
    );


    renderCartPage();

}


/* =====================================================
   CHECKOUT
===================================================== */

function checkout() {

    const cart =
        getCart();


    if (!cart.length) {

        showToast(
            "Your cart is empty"
        );

        return;

    }


    showToast(
        "Checkout is ready — connect your payment gateway."
    );

}


/* =====================================================
   WISHLIST
===================================================== */

function renderWishlistPage() {

    const container =
        document.getElementById(
            "wishlistContainer"
        );


    if (!container) return;


    const wishlist =
        getWishlist();


    if (!wishlist.length) {

        container.innerHTML = `

            <div class="empty-cart">

                <div class="empty-icon">
                    ♡
                </div>

                <h2>
                    Your Wishlist Is Empty
                </h2>

                <p>
                    Save your favorite watches here.
                </p>

                <a
                    href="products.html"
                    class="btn btn-dark"
                >
                    Explore Watches
                </a>

            </div>

        `;

        return;

    }


    const savedProducts =
        products.filter(
            product =>
                wishlist.includes(
                    product.id
                )
        );


    container.innerHTML = `

        <div class="wishlist-grid">

            ${
                savedProducts
                    .map(createProductCard)
                    .join("")
            }

        </div>

    `;

}


/* =====================================================
   LOGIN
===================================================== */

function initLogin() {

    const form =
        document.getElementById(
            "loginForm"
        );


    if (!form) return;


    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const email =
                document
                    .getElementById("loginEmail")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("loginPassword")
                    .value
                    .trim();


            if (!email || !password) {

                showToast(
                    "Please enter email and password."
                );

                return;

            }


            localStorage.setItem(
                "chronovaUser",
                JSON.stringify({
                    email: email
                })
            );


            showToast(
                "Welcome back to CHRONOVA!"
            );


            setTimeout(
                () => {

                    window.location.href =
                        "index.html";

                },
                1000
            );

        }
    );

}


/* =====================================================
   CONTACT
===================================================== */

function initContactForm() {

    const form =
        document.getElementById(
            "contactForm"
        );


    if (!form) return;


    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const name =
                document
                    .getElementById("contactName")
                    .value
                    .trim();


            const email =
                document
                    .getElementById("contactEmail")
                    .value
                    .trim();


            const message =
                document
                    .getElementById("contactMessage")
                    .value
                    .trim();


            if (
                !name ||
                !email ||
                !message
            ) {

                showToast(
                    "Please complete all fields."
                );

                return;

            }


            showToast(
                "Thank you. Your message has been received."
            );


            form.reset();

        }
    );

}