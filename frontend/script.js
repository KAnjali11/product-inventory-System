const API_URL = "http://localhost:5000/products";
const form = document.getElementById("productForm");
const table = document.getElementById("productTable");
const successMessage = document.getElementById("successMessage");

let filtered = false;
let products = [];


function showMessage(msg){
    successMessage.textContent = msg;
    setTimeout(()=> successMessage.textContent = "", 2000);
}

async function loadProducts(){

 document.getElementById("loadingMessage").style.display="block";

 let url = API_URL;

 if(filtered){
  url = API_URL + "?lowStock=true";
 }

 const res = await fetch(url);
 products = await res.json();

 document.getElementById("loadingMessage").style.display="none";

 renderTable();
}
form.addEventListener("submit", async function(e){

    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const price = document.getElementById("price").value;
    const quantity = document.getElementById("quantity").value;

    if(name === ""){
        showMessage("Product name cannot be empty!");
        return;
    }

    if(price <= 0){
        showMessage("Price must be positive!");
        return;
    }

    if(quantity < 0){
        showMessage("Quantity cannot be negative!");
        return;
    }

    // 👇 DUPLICATE CHECK YAHAN ADD KARNA HAI
    const existingProduct = products.find(
        p => p.name.toLowerCase() === name.toLowerCase()
    );

    if(existingProduct){
        showMessage("Product already exists!");
        return;
    }

    await fetch(API_URL,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            name,
            price,
            quantity
        })
    });

    showMessage("Product added successfully!");
    form.reset();
    loadProducts();

});
form.addEventListener("reset", function(){
 showMessage("Form cleared!");
});
function renderTable(){

    table.innerHTML = "";

    // YAHAN ADD KARNA HAI
    let lowStockCount = products.filter(p => p.quantity < 10).length;

    if(lowStockCount > 0){
        document.getElementById("warningMessage").textContent =
        "Warning: Some products are low in stock!";
    } else {
        document.getElementById("warningMessage").textContent = "";
    }

    if(products.length === 0){

        table.innerHTML = `
        <tr>
        <td colspan="4">No products to display</td>
        </tr>
        `;

        updateCounter();
        return;
    }

    products.forEach((product)=>{

        const row = document.createElement("tr");

        if(product.quantity < 10){
            row.classList.add("low-stock");
        }

        row.innerHTML = `
        <td>${product.name}</td>
        <td>₹${product.price}</td>
        <td>${product.quantity}</td>
        <td>
            <button onclick="updateQuantity('${product._id}')">Update</button>
            <button onclick="deleteProduct('${product._id}')">Delete</button>
        </td>
        `;

        table.appendChild(row);

    });

    updateCounter();

}

async function updateQuantity(id){

    const newQuantity = prompt("Enter new quantity:");

    if(newQuantity === null) return;

    if(newQuantity < 0){
        showMessage("Quantity cannot be negative!");
        return;
    }

    await fetch(API_URL + "/" + id,{

        method:"PUT",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            quantity:newQuantity
        })

    });

    showMessage("Quantity updated successfully!");

    loadProducts();

}

async function deleteProduct(id){

    const confirmDelete = confirm("Are you sure you want to delete this product?");

    if(!confirmDelete) return;

    await fetch(API_URL + "/" + id,{
        method:"DELETE"
    });

    showMessage("Product deleted successfully!");

    loadProducts();

}

function showLowStock(){

    filtered = true;
    loadProducts();

}

function showAll(){

    filtered = false;
    loadProducts();

}

function updateCounter(){

    const heading = document.getElementById("inventoryHeading");

    heading.textContent = `Inventory (${products.length} items)`;

}

loadProducts();