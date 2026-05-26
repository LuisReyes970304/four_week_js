const URL_API = "http://localhost:3000/products"

const productForm = document.querySelector(".productForm");
const productName = productForm.querySelector(".productName");
const productPrice = productForm.querySelector(".productPrice");
const messageAlert = document.querySelector(".messageAlert");
const productList = document.querySelector(".productList");

const deleteForm = document.querySelector(".deleteForm");
const deleteId = deleteForm.querySelector(".deleteId");


document.addEventListener("DOMContentLoaded", () => {
    getData(URL_API, productList);
});

productForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const dataName = productName.value.trim();
    const dataPrice = parseFloat(productPrice.value.trim());
    if (!dataName || !dataPrice ){
        alert("Fill out all the filds")
        return
    }
    productName.value = "";
    productPrice.value = "";
    postServerData(URL_API, dataName, dataPrice);
});

deleteForm.addEventListener("submit", (e) => {
    e.preventDefault();
    deleteProduct();
})

async function getData(url, list){
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


async function postServerData(url, productName, productPrice){
    const newProduct = {product_name: productName, product_price: productPrice};

    try {
        const fetchData = await fetch(url, {
            method: "POST",
            headers: {"content-Type": "application/json"},
            body: JSON.stringify(newProduct)
        });
        return await fetchData.json();
    } catch (error) {
        console.error("Error found: " + error)
    }
}

async function deleteProduct() {
    let id = deleteId.value.trim(); 
    deleteId.value = "";
    if (!id) return alert("Write the product to delete...");

    try {
        const response = await fetch(`${URL_API}/${id}`, {
            method: "DELETE"
        });

        if (response.ok) {
            console.log("Product deleted");
            deleteName.value = "";
        } else {
            console.error("Id not found");
        }
    } catch (error) {
        console.error("Error deleting: ", error);
    }
}

async function updateProduct(){
    try{
        const response = await fetch()
    } catch (error) {
        console.error("Error updating: ", error)
    }
}