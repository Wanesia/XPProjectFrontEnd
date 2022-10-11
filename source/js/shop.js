const localStockApi = "http://localhost:8080/api/v1/stock";

const tableBody = document.getElementById("table_body")

/* ============== Booking Modal ============== */
// Modal itself
const modal = document.getElementById("modal");
// Title
const modalTitle = document.getElementById("modalTitle");
// Input fields
const startDateTime = document.getElementById("startDateTime");
const endDateTime = document.getElementById("endDateTime");
const customerFirstName = document.getElementById("customerFirstName");
const customerLastName = document.getElementById("customerLastName");
const customerTelephone = document.getElementById("customerTelephone");
// Buttons
const bookButton = document.getElementById("bookButton");
const confirmChangesButton = document.getElementById("confirmChangesButton");
const cancelButton = document.getElementById("cancelButton");
const closeButton = document.getElementById("closeButton");
const editBeverageModalButton = document.getElementById("editBeverageModalButton");
const addBeverageModalButton = document.getElementById("addBeverageModalButton");
const deleteBeverageModalButton = document.getElementById("deleteBeverageModalButton");
const modalBeverageQuantity =document.getElementById("newBeverageQuantity");
const modalBeverageQuantityLabel =document.getElementById("newBeverageQuantityLabel")

/* =================================== */

/* ============== Table Modal ============== */
// Modal itself
const tableModal = document.getElementById("tableModal");
// Title
const tableModalTitle = document.getElementById("tableModalTitle");
// Input fields
const tableModalText = document.getElementById("tableModalText");
// Buttons
const openTableButton = document.getElementById("openTableButton");
const closeTableButton = document.getElementById("closeTableButton");
const closeTableModalButton = document.getElementById("closeTableModalButton");
const beverageName = document.getElementById("newBeverageName");
const beveragePrice = document.getElementById("newBeveragePrice");
const beverageQuantity = document.getElementById("newBeverageQuantity");

/* =================================== */



async function createTable(stock) {
    if (stock.category === "Beverage"){
        createRow(stock)
    }
}

function createRow(stock) {
    let rowCount = tableBody.rows.length
    let row = tableBody.insertRow(rowCount)
    let cellCount = 0

    // inserting at each cell from the 1st column the stock item name
    let cell = row.insertCell(cellCount++)
    cell.innerHTML = stock.name

    // inserting at each cell from the 2nd column the stock item quantity, in an input html element
    cell = row.insertCell(cellCount++)
    cell.innerHTML = stock.quantity
    cell = row.insertCell(cellCount++)
    cell.innerHTML = stock.price
    // inserting at each cell from the 2nd column an update button to update the stock quantity
    let sellButton = document.createElement('button')
    sellButton.innerText = "Sell"
    sellButton.classList = "button-to-sell"
    cell = row.insertCell(cellCount++)
    cell.appendChild(sellButton);
    // inserting at each cell from the 3rd column an order button to confirm the stock items order
    cell = row.insertCell(cellCount++)
    let editButton = document.createElement('button')
    editButton.innerText = "Edit"
    editButton.classList = "button-to-edit"
    cell.appendChild(editButton);
    // button to edit stock 
    editButton.addEventListener('click', () =>{
        edit(stock)
    })
    // button to sell item
    sellButton.addEventListener('click', () =>{
        sell(stock)
    })

}

//gets the json array of objects
async function fetchStock(url) {
    return fetch(url).then(response => response.json())
}

//populates an array of stock and creates a table
async function doFetchStock() {
    clear()
    stockArray = await fetchStock(localStockApi)
    stockArray.forEach(createTable)
}

function sell(stock) {
    // let value = document.getElementById(fieldName).value;
    let updatedQuantity = stock.quantity - 1
    // console.log(id, name, fieldName, value);
    let localStockApiPutUrl = localStockApi + "/" + stock.id + "?name=" + stock.name + "&quantity=" + updatedQuantity;
    fetch(localStockApiPutUrl, {
        method: 'PUT'
    }).then(response => {
        return response.json();
    }).then(() => {
        document.location.reload();
    })
}

async function edit(stock) {
    // If the modal is being displayed, hide it and stop the rest of the function from executing
    if (!(tableModal.style.display === "none")) {
        tableModal.style.display = "none";
        return;
    }
    // modalBeverageQuantity.style.display = "none";
    modalBeverageQuantityLabel.style.display = "none";
    addBeverageModalButton.style.display = "none";
    editBeverageModalButton.style.display = "block";
    deleteBeverageModalButton.style.display = "block";

    // If the modal is not being displayed, display it
    tableModal.style.display = "block";
    tableModalTitle.innerText = "Edit Beverage";
    // Close window on button click
    closeTableModalButton.addEventListener('click', () => {
        tableModal.style.display = "none"
    });
    beverageName.value = stock.name;
    beveragePrice.value = stock.price;

    editBeverageModalButton.addEventListener('click', ()=>{
        alert("i'll edit "+stock.name + " "+stock.price +" to "+ beverageName.value +" "+beveragePrice.value)
        updateBeverage(stock, beverageName.value,beveragePrice.value)
    })
    deleteBeverageModalButton.addEventListener('click', ()=>{
        deleteStock(stock.id).then(r=>{
            console.log(r)
        })
    })
}

function updateBeverage(stock, newName, newPrice) {
    stock.name = newName;
    stock.price = parseInt(newPrice);
    restUpdateStock(stock);
}

async function restUpdateStock(stock) {
    const fetchOptions = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        }, body: ""}
    fetchOptions.body = JSON.stringify(stock);
    console.log(JSON.stringify(stock))
    // console.log(url)
    const response = await fetch(localStockApi + "/beverageStock/" + stock.id, fetchOptions)
    if (response.ok) {
        document.location.reload();
    }
    return response;
}

async function deleteStock(id) {
    const fetchOptions = {
        method: "DELETE",
        headers: {
            "Content-type": "application/json"
        },
        body: ""
    }
    const response = await fetch(localStockApi + "/" + id, fetchOptions);
    // Refresh page on reload
    if (response.ok) {
        document.location.reload();
    }
    return response;
}

async function restAddStock(name, quantity, price) {
    const fetchOptions = {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: ""
    }
    const addBeverage = {
        "name":	name,
        "quantity":	quantity,
        "category":	"Beverage",
        "price": price
    }

    fetchOptions.body = JSON.stringify(addBeverage);
    const response = await fetch(localStockApi + "/", fetchOptions);
    // Refresh page on reload
    if (response.ok) {
        document.location.reload();
    }
    return response;
}

function clear() {
    $("#table_body").empty();
}



document.getElementById("addBeverage").addEventListener('click', () => {
        // If the modal is being displayed, hide it and stop the rest of the function from executing
        if (!(tableModal.style.display === "none")) {
            tableModal.style.display = "none";
            return;
        }
        beverageName.value = ""
        beverageQuantity.value =""
        beveragePrice.value=""
        // modalBeverageQuantity.style.display = "block";
        modalBeverageQuantityLabel.style.display = "inline-block";
        document.getElementById("editBeverageModalButton").style.display = "none";
        document.getElementById("deleteBeverageModalButton").style.display = "none";
        // If the modal is not being displayed, display it
        tableModal.style.display = "block";
        tableModalTitle.innerText = "Add Beverage";
        addBeverageModalButton.style.display = "block"
        addBeverageModalButton.addEventListener('click', async function(){
            restAddStock(beverageName.value, beverageQuantity.value, beveragePrice.value).then(r  =>{
                console.log(r);
                document.location.reload()
            })

        })
        // Close window on button click
        closeTableModalButton.addEventListener('click', () => {
            tableModal.style.display = "none"
        });
    }
)




