
const API_URL = "http://localhost:3000/products"; 


const productForm = document.getElementById("productForm");
const productIdInput = document.getElementById("productId");
const productNameInput = document.getElementById("productName");
const productPriceInput = document.getElementById("productPrice");
const formSubmitBtn = document.getElementById("formSubmitBtn");
const syncApiBtn = document.getElementById("syncApiBtn");
const productList = document.getElementById("productList");
const messageContainer = document.getElementById("messageContainer");




/**
 * 
 * @param {string} message
 * @param {string} type 
 */
const showMessage = (message, type) => {
    messageContainer.textContent = message;
    messageContainer.className = type;
    messageContainer.style.display = "block";
    
    setTimeout(() => {
        messageContainer.style.display = "none";
    }, 3000);
};


const saveToLocalStorage = () => {
    localStorage.setItem("products", JSON.stringify(productsArray));
    console.log("Local Storage actualizado:", JSON.parse(localStorage.getItem("products")));
};

/**
 * Uploads the products from local storage to the productsArray and renders them.
 */
const loadFromLocalStorage = () => {
    const storedProducts = localStorage.getItem("products");
    if (storedProducts) {
        productsArray = JSON.parse(storedProducts);
        console.log("Datos recuperados de Local Storage con éxito.");
        renderProducts();
    }
};

const renderProducts = () => {

    productList.innerHTML = "";

    productsArray.forEach(product => {
        const li = document.createElement("li");
        li.id = `prod-${product.id}`;
        const textNode = document.createTextNode(`${product.name} - $${product.price}`);
        li.appendChild(textNode);
        const actionsContainer = document.createElement("div");

        const editBtn = document.createElement("button");
        editBtn.textContent = "Editar";
        editBtn.className = "btn-edit";
        editBtn.addEventListener("click", () => setupEditMode(product));
        actionsContainer.appendChild(editBtn);

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Eliminar";
        deleteBtn.className = "btn-delete";
        deleteBtn.addEventListener("click", () => deleteProductHandler(product.id));
        actionsContainer.appendChild(deleteBtn);


        li.appendChild(actionsContainer);
        productList.appendChild(li);
    });
};


const setupEditMode = (product) => {
    productIdInput.value = product.id;
    productNameInput.value = product.name;
    productPriceInput.value = product.price;
    formSubmitBtn.textContent = "Actualizar Producto";
    formSubmitBtn.style.backgroundColor = "#FFC107";
    formSubmitBtn.style.color = "black";
    showMessage(`Editando el producto: ${product.name}`, "success");
};

const resetForm = () => {
    productIdInput.value = "";
    productForm.reset();
    formSubmitBtn.textContent = "Agregar Producto";
    formSubmitBtn.style.backgroundColor = "#007BFF";
    formSubmitBtn.style.color = "white";
};


const fetchProductsFromApi = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("No se pudo obtener la información del servidor.");
        
        const data = await response.json();
        productsArray = data; 
        
        saveToLocalStorage(); 
        renderProducts();    
        showMessage("Datos sincronizados con la API con éxito.", "success");
        console.log("GET exitoso. Servidor responde:", data);
    } catch (error) {
        console.error("Error en GET:", error.message);
        showMessage(`Error de conexión API: ${error.message}. Usando caché local.`, "error");
    }
};


const createProductApi = async (newProduct) => {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newProduct)
        });
        if (!response.ok) throw new Error("Error al guardar el producto en el servidor.");

        const createdProduct = await response.json();
        console.log("POST exitoso. Elemento creado:", createdProduct);
        return createdProduct;
    } catch (error) {
        console.error("Error en POST:", error.message);
        throw error; 
    }
};


const updateProductApi = async (id, updatedData) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData)
        });
        if (!response.ok) throw new Error("No se pudo actualizar el elemento en el servidor.");

        const updatedProduct = await response.json();
        console.log(" PUT exitoso. Elemento modificado:", updatedProduct);
        return updatedProduct;
    } catch (error) {
        console.error("Error en PUT:", error.message);
        throw error;
    }
};


const deleteProductHandler = async (id) => {
    try {
        
        const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error("No se pudo eliminar el elemento del servidor.");

        productsArray = productsArray.filter(prod => prod.id !== id);
        

        saveToLocalStorage();

        const itemToRemove = document.getElementById(`prod-${id}`);
        if (itemToRemove) {
            productList.removeChild(itemToRemove);
        }

        showMessage(" Producto eliminado correctamente.", "success");
        console.log(` DELETE exitoso del ID: ${id}`);
    } catch (error) {
        console.error("Error en DELETE:", error.message);
        showMessage(`No se pudo eliminar: ${error.message}`, "error");
    }
};

productForm.addEventListener("submit", async (event) => {
    event.preventDefault(); 

    const name = productNameInput.value.trim();
    const price = parseFloat(productPriceInput.value);
    const id = productIdInput.value; 

    if (name === "" || isNaN(price) || price <= 0) {
        showMessage(" Por favor, ingrese un nombre válido y un precio mayor a 0.", "error");
        return;
    }

    const productData = { name, price: price.toFixed(2) };

    if (id) {

        try {
            const updatedProduct = await updateProductApi(id, productData);
            productsArray = productsArray.map(p => p.id == id ? updatedProduct : p);
            
            saveToLocalStorage();
            renderProducts();
            resetForm();
            showMessage("Producto actualizado con éxito.", "success");
        } catch (error) {
            showMessage("No se pudo actualizar el producto remoto.", "error");
        }
    } else {
        try {
            const newProduct = await createProductApi(productData);
            productsArray.push(newProduct);
            
            saveToLocalStorage();
            renderProducts();
            resetForm();
            showMessage(" Producto agregado con éxito.", "success");
        } catch (error) {
            showMessage("Error al sincronizar el nuevo producto con la API.", "error");
        }
    }
});

syncApiBtn.addEventListener("click", fetchProductsFromApi);

document.addEventListener("DOMContentLoaded", () => {
    loadFromLocalStorage();
    fetchProductsFromApi();
});