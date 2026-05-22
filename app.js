const URL_API = "http://localhost:3000/products"

const productForm = document.querySelector(".productForm");
const productName = productForm.querySelector(".productName");
const productPrice = productForm.querySelector(".productPrice");
const productId = productForm.querySelector(".productId");

document.addEventListener("DOMContentLoaded", () => {
    renderData();
});

function renderData(){}

productForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let dataName = productName.value;
    let dataPrice = parseFloat(productPrice.value);
    let dataId = parseInt(productId.value);
    productName.value = "";
    productPrice.value = "";
    productId.value = "";
    setServerData(URL_API, dataName, dataPrice, dataId);
})

async function setServerData(url, productName, productPrice, id){
    const newProduct = {product_name: productName, product_price: productPrice, id: id};

    const fetchData = await fetch(url, {
        method: "POST",
        headers: {"content-Type": "application/json"},
        body: JSON.stringify(newProduct)
    });
    return await fetchData.json();
}
