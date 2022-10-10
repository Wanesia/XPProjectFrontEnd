// REST API URLs to connect to back-end
const localStockApi = "http://localhost:8080/api/v1/stock";

// Table itself retrieved from the HTML document
const stockTable = document.getElementById('stockManageTable')
const tableOption = document.getElementById('stock-drop-down')
let stockArray = [];

//creates table based on the option, taking data from stockArray
async function createTable(stock) {
    if (tableOption.value === "All") {
        createRow(stock)
        console.log("all")
    } else if (stock.category === tableOption.value){
        createRow(stock)
        alert(tableOption.value)
    }
}

//Used to create the table(row by row) using data from stock. 
function createRow(stock) {
    console.log(stock.id)
    let cellCount = 0
    let rowCount = stockTable.rows.length
    let row = stockTable.insertRow(rowCount)
    let cell = row.insertCell(cellCount++)
    cell.innerHTML = stock.name
    cell = row.insertCell(cellCount);
    let inputField = document.createElement("input");
    inputField.type = "number"
    inputField.value = stock.quantity
    inputField.className = "stockTableElement"
    cell.appendChild(inputField)
    let updateButton = document.createElement('button')
    updateButton.innerText = "Update";
    updateButton.className = "stockTableElement"
    cell.appendChild(updateButton);
    updateButton.addEventListener('click', () => {
        updateStock(stock, inputField.value);
    })
}

//updates the stock quantity. triggered when the updateButton is pressed
async function updateStock(stock, newQuantity) {
    stock.quantity = newQuantity;
    const response = await restUpdateStock(stock);
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
    return jsonString;
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
    $(function () {
        $(".stockManageTable").find("tr:not(:first)").remove();
    });
}

//fetches the db if option is selected
tableOption.addEventListener('click', doFetchStock)
