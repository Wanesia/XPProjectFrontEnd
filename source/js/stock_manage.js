
// REST API URLs to connect to back-end
//const localStockApi = "http://localhost:8080/api/v1/stock";

// Table itself retrieved from the HTML document
const manageStockTable = document.getElementById('stockManageTable')

let stockArray = []

function createRow(stock) {
    // Row which is currently being generated established by the entity stock name from the back-end
    const rowCount = stock.name;
    const quantity = stock.quantity
    // Generating row itself, no cells yet
    let row1 = manageStockTable.insertCell(1)
    let row1_2 = manageStockTable.insertCell(2)

}

function doFetchStock() {
    const name1 = stock.name
    const quantity1 = stock.quantity
    let table = manageStockTable;
    let row1 = table.insertRow(1);
    let cell1 = row1.insertCell(0)
    let cell2 = row1.insertCell(1)
    cell1.innerHTML = name1
    cell2.innerHTML = quantity1
}

/*async function fetchStock(url) {
    return fetch(url).then(response => reponse.json())
}

async function doFetchStock() {
    stockArray = await fetchStock(localStockApi)
    stockArray.forEach(createRow)
}*/

document.addEventListener('keydown', doFetchStock)