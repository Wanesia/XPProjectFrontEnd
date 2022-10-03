const localStockOrderApi = "http://localhost:8080/api/v1/stock";

window.onload = loadIntoTable();
const stockArr = []

function loadIntoTable() {
    console.log("Loading table");
    fetch(localStockOrderApi).then(response => {
        console.log(response);
        return response.json();
    }).then(data => {
        console.log(data);
        // get a reference to the table
        let stockTable = document.getElementById("stock-order");
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
                <td><input id = "${fieldName}" type="number" value='${index}'/></td>
                <td><button class="button-to-order" onclick="order('${stock.id}','${stock.name}','${fieldName}', '${stock.quantity}', '${quantityFieldName}')">Order</button></td> 
            `
            tableBody.appendChild(tr)
        })

    });

}

function order(id, name, fieldName, quantity, quantityFieldName){
    let value = document.getElementById(fieldName).value;
    let updatedQuantity = parseInt(value) + parseInt(quantity);
 console.log(id, name, fieldName, value);
 let localStockOrderApiPutUrl = localStockOrderApi + "/" + id + "?name=" + name + "&quantity=" + updatedQuantity;
fetch(localStockOrderApiPutUrl,{
    method:'PUT'
    }).then(response => {
let updatedResponse = response.json();
let newQuantity = updatedResponse.quantity;
console.log(updatedResponse);
    })
    //get the promise, and be able to callback to update data in realtime
}










