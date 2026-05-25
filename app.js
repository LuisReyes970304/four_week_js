const URL_API = "http://localhost:3000/products"

const productForm = document.querySelector(".productForm");
const productName = productForm.querySelector(".productName");
const productPrice = productForm.querySelector(".productPrice");
const messageAlert = document.querySelector(".messageAlert");
const productList = document.querySelector(".productList");

document.addEventListener("DOMContentLoaded", () => {
    renderData(URL_API, productList);
});

productForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const dataName = productName.value.trim();
    const dataPrice = parseFloat(productPrice.value.trim());
    if (!dataName || !dataPrice ){
        alert("Todos los campos son obligatorios")
        return
    }
    productName.value = "";
    productPrice.value = "";
    setServerData(URL_API, dataName, dataPrice);
});

async function renderData(url, list){
    const response = await fetch(url);
    const data = await response.json();

    list.innerHTML = "";

    for (const product of data){
        list.innerHTML += `
        <li>
            <h2>${product.product_name}</h2>
            <p>price: ${product.product_price}</p>
            <p>id: ${product.id}</p>
        </li>
        `
    }
}


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

async function deleteProduct(url, name){
    const response = fetch(url)
    const data = await response.json();
    try {
        for(const product of data){
            if(name === product.product_name){
                const response = await fetch(url/name, {
                    method: "DELETE"
                });
            }
        } 
    }catch(error) {
        console.error("Error foud: " + error)
    }
}
