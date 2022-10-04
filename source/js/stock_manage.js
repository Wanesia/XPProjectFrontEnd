// REST API URLs to connect to back-end
const localStockApi = "http://localhost:8080/api/v1/stock";

// Table itself retrieved from the HTML document
const stockTable = document.getElementById('stockManageTable')

let stockArray = [];

function createTable(stock) {
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

async function updateStock(stock, newQuantity) {
    stock.quantity = newQuantity;
    console.log(stock)
    const response = await restUpdateStock(stock);
    console.log(response)
}

async function restUpdateStock(stock) {
    const url = localStockApi + "/" + stock.id;

    const fetchOptions = {
        method: 'PUT',
        headers: {
            'Content-Type':'application/json'
        },
        body: ""
    }

    const jsonString = JSON.stringify(stock);
    console.log("kjlksdjfld" + jsonString)
    fetchOptions.body = jsonString;

    console.log(url+fetchOptions)
    const response = await fetch(url, fetchOptions)
    console.log(response)

    return jsonString;
}

async function fetchStock(url) {
    return fetch(url).then(response => response.json())
}

async function doFetchStock() {
    stockArray = await fetchStock(localStockApi)
    stockArray.forEach(createTable)
}