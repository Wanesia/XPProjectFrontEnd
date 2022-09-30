// REST API URLs to connect to back-end
const localStockApi = "http://localhost:8080/api/v1/stock";

// Table itself retrieved from the HTML document
const stockTable = document.getElementById('stockManageTable')

let stockArray = [];

function createTable(stock) {

    let cellCount = 0
    let rowCount = stockTable.rows.length
    console.log("rowcount = " + rowCount)

    let row = stockTable.insertRow(rowCount)

    let cell = row.insertCell(cellCount++)
    cell.innerHTML = stock.name

    cell = row.insertCell(cellCount++);
    let inputField = document.createElement("input");
    inputField.type = "number"
    inputField.value = stock.quantity
    cell.appendChild(inputField)
}

async function fetchStock(url) {
    return fetch(url).then(response => response.json())
}

async function doFetchStock() {
    stockArray = await fetchStock(localStockApi)
    stockArray.forEach(createTable)
}

document.addEventListener('keydown', doFetchStock)