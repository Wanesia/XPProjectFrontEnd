const localStockOrderApi = "http://localhost:8080/api/v1/stock";

const tableOption = document.getElementById('stock-drop-down')

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
/* =================================== */

function loadIntoTable() {
    console.log("Loading table");
    fetch(localStockOrderApi).then(response => {
        console.log(response);
        return response.json();
    }).then(data => {
        console.log(data);
        showByCategory();
    });
}

function populateTable(data) {
    let index = 0;
    let idCounter = 0;
    let tableBody = document.getElementById("table_body")
    data.map(stock => {
        let fieldName = "number" + idCounter++;
        let quantityFieldName = "quantity" + idCounter;
        let tr = document.createElement("tr")
        tr.innerHTML = `
                <td>${stock.id}</td>
                <td>${stock.name}</td>
                <td id="${quantityFieldName}">${stock.quantity}</td>
                <td><button class="button-to-order" onclick="sell('${stock.id}','${stock.name}','${fieldName}', '${stock.quantity}', '${quantityFieldName}')">Sell</button></td> 
            `
        tableBody.appendChild(tr);
    })
}

function sell(id, name, fieldName, quantity, quantityFieldName){
    // let value = document.getElementById(fieldName).value;
    let updatedQuantity = quantity-1
    // console.log(id, name, fieldName, value);
    let localStockOrderApiPutUrl = localStockOrderApi + "/" + id + "?name=" + name + "&quantity=" + updatedQuantity;
    fetch(localStockOrderApiPutUrl,{
        method:'PUT'
    }).then(response => {
        return response.json();
    }).then(data => {
        let newQuantity = data.quantity;
        // console.log(data);
        // console.log(quantityFieldName,
        //     document.getElementById(quantityFieldName).innerText);
        // console.log(newQuantity);
        // document.getElementById(quantityFieldName).innerText = newQuantity;
         document.location.reload();
    })

}

function showByCategory() {
    let categoryValue = "?category=Beverage";
    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: localStockOrderApi + categoryValue,
        dataType: 'json',
        cache: false,
        timeout: 600000,
        success: function (data) {
            console.log(data);
            clear();
            populateTable(data);
        },
        error: function (e) {
            console.log(e);
        }
    });
}

function clear() {
    $("#table_body").empty();
}

document.getElementById("addBeverage").addEventListener('click',()=>{
        // If the modal is being displayed, hide it and stop the rest of the function from executing
        if (!(tableModal.style.display === "none")) {
            tableModal.style.display = "none";
            return;
        }
        // If the modal is not being displayed, display it
        tableModal.style.display = "block";
        tableModalTitle.innerText = "Add Beverage";


        // Close window on button click
        closeTableModalButton.addEventListener('click', () => {tableModal.style.display = "none"});
    }
)




