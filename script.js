/* =============================================
   VIBE+ — ENHANCED SCRIPT
   Preserves all original functionality +
   adds cursor, sidebar cart, animations
   ============================================= */

let cart = [];
let timeLeft = 7200;

// ── 1. CUSTOM CURSOR ──
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');

if (cursor && cursorRing) {
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        setTimeout(() => {
            cursorRing.style.left = e.clientX + 'px';
            cursorRing.style.top = e.clientY + 'px';
        }, 60);
    });

    document.addEventListener('mousedown', () => {
        cursor.style.transform = 'translate(-50%,-50%) scale(0.7)';
        cursorRing.style.transform = 'translate(-50%,-50%) scale(0.85)';
    });
    document.addEventListener('mouseup', () => {
        cursor.style.transform = 'translate(-50%,-50%) scale(1)';
        cursorRing.style.transform = 'translate(-50%,-50%) scale(1)';
    });

    // Enlarge ring on hoverable elements
    const hoverTargets = 'button, a, input, label, .card, .bundle-card, .stack img, .card-img-wrap';
    document.querySelectorAll(hoverTargets).forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorRing.style.width = '56px';
            cursorRing.style.height = '56px';
            cursorRing.style.borderColor = 'rgba(196,255,62,0.8)';
            cursor.style.opacity = '0';
        });
        el.addEventListener('mouseleave', () => {
            cursorRing.style.width = '36px';
            cursorRing.style.height = '36px';
            cursorRing.style.borderColor = 'rgba(196,255,62,0.5)';
            cursor.style.opacity = '1';
        });
    });
}

// ── 2. NAVBAR SCROLL EFFECT ──
const navbar = document.getElementById('navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            navbar.style.background = 'rgba(8,10,15,0.97)';
        } else {
            navbar.style.background = 'rgba(8,10,15,0.82)';
        }
    });
}

// ── 3. COUNTDOWN TIMER ──
const timerDisplay = document.getElementById("countdown");
if (timerDisplay) {
    const tick = () => {
        let h = Math.floor(timeLeft / 3600);
        let m = Math.floor((timeLeft % 3600) / 60);
        let s = timeLeft % 60;
        timerDisplay.innerText = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
        if (timeLeft > 0) timeLeft--;
    };
    tick();
    setInterval(tick, 1000);
}

// ── 4. CART MANAGEMENT ──
function addToCart(name, price) {
    let item = cart.find(i => i.name === name);
    if (item) {
        item.qty++;
    } else {
        cart.push({ name, price, qty: 1 });
    }
    updateCartUI();
    showToast(`✓ ${name} added to cart`);
}

function changeQty(name, val) {
    let item = cart.find(i => i.name === name);
    if (item) {
        item.qty += val;
        if (item.qty <= 0) cart = cart.filter(i => i.name !== name);
    }
    updateCartUI();
}

function updateCartUI() {
    const listEl = document.getElementById("cart-items-list");
    const countEl = document.getElementById("cart-count");
    const totalEl = document.getElementById("cart-total-price");

    let totalPrice = 0;
    let totalQty = 0;

    if (listEl) {
        if (cart.length === 0) {
            listEl.innerHTML = `<div class="cart-empty">
                <div style="font-size:2rem;margin-bottom:12px">🛒</div>
                <p>Your cart is empty</p>
                <p style="font-size:0.8rem;margin-top:4px;color:var(--muted2)">Add some patches to get started!</p>
            </div>`;
        } else {
            listEl.innerHTML = cart.map(item => {
                totalPrice += item.price * item.qty;
                totalQty += item.qty;
                return `<div class="cart-item">
                    <div style="flex:1">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">${item.price * item.qty}k</div>
                    </div>
                    <div style="display:flex;align-items:center;gap:4px">
                        <button class="cart-qty-btn" onclick="changeQty('${item.name}',-1)">−</button>
                        <span style="font-family:var(--font-ui);font-size:0.85rem;font-weight:700;min-width:20px;text-align:center">${item.qty}</span>
                        <button class="cart-qty-btn" onclick="changeQty('${item.name}',1)">+</button>
                    </div>
                    <button class="cart-item-remove" onclick="changeQty('${item.name}',-99)">✕</button>
                </div>`;
            }).join('');

            // Recalculate (since we built string in map, recalculate here)
            totalPrice = 0; totalQty = 0;
            cart.forEach(i => { totalPrice += i.price * i.qty; totalQty += i.qty; });
        }
    }

    if (countEl) countEl.innerText = totalQty;
    if (totalEl) totalEl.innerText = totalPrice;
}

// ── 5. CART SIDEBAR OPEN/CLOSE ──
function openCart() {
    document.getElementById("cart-sidebar").classList.add("open");
    document.getElementById("cart-overlay").classList.add("open");
    updateCartUI();
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    document.getElementById("cart-sidebar").classList.remove("open");
    document.getElementById("cart-overlay").classList.remove("open");
    document.body.style.overflow = '';
}

// ── 6. CHECKOUT FORM ──
const checkoutForm = document.getElementById('checkout-form');
if (checkoutForm) {
    checkoutForm.onsubmit = function(e) {
        e.preventDefault();
        if (cart.length === 0) {
            showToast('⚠ Your cart is empty!');
            return;
        }

        const name = document.getElementById("cus-name").value;
        const address = document.getElementById("cus-address").value;
        const phone = document.getElementById("cus-phone").value;
        const payment = document.querySelector('input[name="payment"]:checked').value;
        const total = document.getElementById("cart-total-price").innerText;

        alert(`🎉 ĐẶT HÀNG THÀNH CÔNG!\n──────────────────────\nKhách hàng: ${name}\nSĐT: ${phone}\nĐịa chỉ: ${address}\nTổng tiền: ${total}k\nThanh toán: ${payment}\n──────────────────────\nCảm ơn bạn đã tin tưởng VIBE+! ⚡`);

        cart = [];
        updateCartUI();
        closeCart();
        this.reset();
    };
}

// Payment option visual toggle
document.querySelectorAll('.payment-opt').forEach(opt => {
    opt.addEventListener('click', () => {
        document.querySelectorAll('.payment-opt').forEach(o => o.style.cssText = '');
    });
});

// ── 7. LIGHTBOX ──
function openLightbox(src) {
    const lb = document.getElementById("lightbox");
    const lbImg = document.getElementById("lightbox-img");
    if (lb && lbImg) {
        lbImg.src = src;
        lb.style.display = "flex";
    }
}

document.getElementById('lightbox')?.addEventListener('click', function() {
    this.style.display = 'none';
});

// ── 8. TOAST ──
function showToast(msg) {
    let t = document.getElementById("toast");
    if (!t) {
        t = document.createElement('div');
        t.id = 'toast';
        t.className = 'toast';
        document.body.appendChild(t);
    }
    t.innerText = msg;
    t.style.display = 'block';
    t.style.animation = 'none';
    void t.offsetWidth; // reflow
    t.style.animation = 'slideUp 0.3s cubic-bezier(0.16,1,0.3,1)';
    clearTimeout(t._timeout);
    t._timeout = setTimeout(() => { t.style.display = 'none'; }, 3000);
}

// ── 9. GIFT CODE ──
function checkGiftCode() {
    const code = document.getElementById('couponInput')?.value.toUpperCase().trim();
    const resultDiv = document.getElementById('resultMessage');
    if (!resultDiv) return;

    const gifts = {
        "VIBEPRO": { msg: "🎉 Chúc mừng! Bạn nhận được Sale 10%!", color: "#c4ff3e" },
        "ENERGY99": { msg: "🎁 Tuyệt vời! Bạn nhận được Free Tote Bag!", color: "#7cffc4" },
    };

    if (!code) {
        resultDiv.innerText = "Please enter a code.";
        resultDiv.style.color = "var(--muted)";
        return;
    }

    if (gifts[code]) {
        resultDiv.innerHTML = gifts[code].msg;
        resultDiv.style.color = gifts[code].color;
    } else {
        resultDiv.innerHTML = "❌ Invalid code. Try again!";
        resultDiv.style.color = "var(--hot)";
    }
}

// Allow Enter key for gift code
document.getElementById('couponInput')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') checkGiftCode();
});

// ── 10. SCROLL REVEAL ──
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.card, .bundle-card, .review-card, .step-item, .highlight-row').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.55s ease, transform 0.55s cubic-bezier(0.16,1,0.3,1)';
    revealObserver.observe(el);
});

// ── 11. HERO IMAGE CYCLE ──
const heroImg = document.querySelector('.hero-img');
const heroImages = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg'];
let heroIdx = 0;
if (heroImg) {
    setInterval(() => {
        heroIdx = (heroIdx + 1) % heroImages.length;
        heroImg.style.opacity = '0';
        heroImg.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            heroImg.src = heroImages[heroIdx];
            heroImg.style.opacity = '1';
        }, 500);
    }, 3000);
}

// Initial cart UI update
updateCartUI();
