let qty = 1;
const unit = 299;

const qtyEl = document.getElementById("qty");
const lineQtyEl = document.getElementById("lineQty");
const totalEl = document.getElementById("total");
const image = document.getElementById("productImage");

function render() {
  qtyEl.textContent = String(qty);
  lineQtyEl.textContent = `${qty}x`;
  totalEl.textContent = `$${unit * qty}`;
}

document.getElementById("plus").addEventListener("click", () => {
  qty += 1;
  render();
});

document.getElementById("minus").addEventListener("click", () => {
  qty = Math.max(1, qty - 1);
  render();
});

document.getElementById("add").addEventListener("click", () => {
  image.style.transform = "scale(1.04) rotate(-2deg)";
  setTimeout(() => {
    image.style.transform = "scale(1) rotate(0deg)";
  }, 180);
});

render();
