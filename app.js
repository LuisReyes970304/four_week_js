const URL_API = "http://localhost:3000/products"

const productForm = document.querySelector(".productForm");
const productName = productForm.querySelector(".productName");
const productPrice = productForm.querySelector(".productPrice");
const messageAlert = document.querySelector(".messageAlert");

document.addEventListener("DOMContentLoaded", () => {
    renderData();
});

function renderData(){}

productForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const dataName = productName.value.trim();
    let dataPrice = parseFloat(productPrice.value.trim());
    if (!dataName || !dataPrice ){
        alert("Todos los campos son obligatorios")
        return
    }
    productName.value = "";
    productPrice.value = "";
    setServerData(URL_API, dataName, dataPrice);
})

async function setServerData(url, productName, productPrice){
    const newProduct = {product_name: productName, product_price: productPrice};

    try {
        const fetchData = await fetch(url, {
            method: "POST",
            headers: {"content-Type": "application/json"},
            body: JSON.stringify(newProduct)
        });
        return await fetchData.json();
    } catch (error) {
        console.error("error " + error)
    }
}

async function deleteProduct(){
    
}
