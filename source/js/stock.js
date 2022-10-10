// REST API URLs to connect to back-end
const localStockApi = "http://localhost:8080/api/v1/stock";

// Table itself retrieved from the HTML document
const stockTable = document.getElementById('stockManageTable')
// Drop down for categorising the table
const tableOption = document.getElementById('stock-drop-down')
// Empty array to be filled with the JSON stock objects
let stockArray;

//creates table based on the option, taking data from stockArray
async function createTable(stock) {
    if (tableOption.value === "All") {
        createRow(stock)
    } else if (stock.category === tableOption.value){
        createRow(stock)

    }
}
//Used to create the table(row by row) using data from stock.
function createRow(stock) {
    let rowCount = stockTable.rows.length
    let row = stockTable.insertRow(rowCount)
    let cellCount = 0

    // inserting at each cell from the 1st column the stock item name
    let cell = row.insertCell(cellCount++)
    cell.innerHTML = stock.name

    // inserting at each cell from the 2nd column the stock item quantity, in an input html element
    cell = row.insertCell(cellCount++)
    let inputFieldUpdate = document.createElement("input");
    inputFieldUpdate.type = "number"
    inputFieldUpdate.value = stock.quantity
    inputFieldUpdate.className = "stockTableElement"
    cell.appendChild(inputFieldUpdate)
    // inserting at each cell from the 2nd column an update button to update the stock quantity
    let updateButton = document.createElement('button')
    updateButton.innerText = "Update"
    updateButton.className = "stockTableElement"
    cell.appendChild(updateButton);

    // inserting at each cell from the 3rd column an input field to order stock items
    cell = row.insertCell(cellCount)
    let inputFieldOrder = document.createElement("input");
    inputFieldOrder.type = "number"
    inputFieldOrder.value = 0
    inputFieldOrder.className = "stockTableElement"
    cell.appendChild(inputFieldOrder)
    // inserting at each cell from the 3rd column an order button to confirm the stock items order
    let orderButton = document.createElement('button')
    orderButton.innerText = "Order"
    orderButton.className = "stockTableElement"
    cell.appendChild(orderButton);

    // button to update stock quantity
    updateButton.addEventListener('click', () => {
        if(inputFieldUpdate.value < stock.quantity) {
            updateStock(stock, inputFieldUpdate.value);
            showByCategory();
        }
    })
    // button to order stock item in quantity
    orderButton.addEventListener('click', () => {
        if(inputFieldOrder.value > 0) {
            let newStockQuantity = parseInt(stock.quantity) + parseInt(inputFieldOrder.value)
            updateStock(stock, newStockQuantity);
            showByCategory();
        }
    })
}

function showByCategory() {
    var value = tableOption.options[tableOption.selectedIndex].value;
    console.log(value);
    let categoryValue = "?category=" + value;
    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: localStockApi + categoryValue,
        dataType: 'json',
        cache: false,
        timeout: 600000,
        success: function (data) {
            console.log(data);
            clear();
        },
        error: function (e) {
            console.log(e);
        }
    });
}

//updates the stock quantity. triggered when the updateButton is pressed
async function updateStock(stock, newQuantity) {
    stock.quantity = newQuantity;
    //const response =
    await restUpdateStock(stock);
}
//sends the PUT request with the new info attached in the body
async function restUpdateStock(stock) {
    const url = localStockApi + "/" + stock.id;
    const fetchOptions = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: ""
    }
    const jsonString = JSON.stringify(stock);
    fetchOptions.body = jsonString;
    const response = await fetch(url, fetchOptions)
    //return jsonString;
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

//clears the table before it is repopulated. uses jquery, so you'll need to add it in your html
function clear() {
    $(".stockManageTable").find("tr:not(:first)").empty();
}

//fetches the db if option is selected
tableOption.addEventListener('click', doFetchStock)