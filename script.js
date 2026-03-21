let cart = 0;

function addToCart(){
    cart++;
    document.getElementById("cart-count").innerText = cart;
}

/* COUNTDOWN */
let time = 7200;
setInterval(()=>{
    let h = Math.floor(time/3600);
    let m = Math.floor((time%3600)/60);
    let s = time%60;

    document.getElementById("countdown").innerText =
        `${h.toString().padStart(2,'0')}:`+
        `${m.toString().padStart(2,'0')}:`+
        `${s.toString().padStart(2,'0')}`;

    if(time>0) time--;
},1000);

/* MODAL */
function openCheckout(name, price){
    document.getElementById("modal").style.display="block";
    document.getElementById("product-name").innerText=name;
    document.getElementById("product-price").innerText=price;
    addToCart();
}

function closeModal(){
    document.getElementById("modal").style.display="none";
}

function confirmOrder(){
    showToast("Đặt hàng thành công!");
    closeModal();
}

/* TOAST */
function showToast(msg){
    let t = document.getElementById("toast");
    t.innerText = msg;
    t.style.display="block";
    setTimeout(()=>t.style.display="none",2000);
}

/* LIKE */
function toggleLike(el){
    el.style.color = el.style.color==="red"?"black":"red";
}
