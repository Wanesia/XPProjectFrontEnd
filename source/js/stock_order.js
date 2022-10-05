const localStockOrderApi = "http://localhost:8080/api/v1/stock";

const tableOption = document.getElementById('stock-drop-down')

function loadIntoTable() {
    console.log("Loading table");
    fetch(localStockOrderApi).then(response => {
        console.log(response);
        return response.json();
    }).then(data => {
        console.log(data);
       populateTable(data);
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
                <td width="30%"><input id = "${fieldName}" type="number" value='${index}'/></td>
                <td><button class="button-to-order" onclick="order('${stock.id}','${stock.name}','${fieldName}', '${stock.quantity}', '${quantityFieldName}')">Order</button></td> 
            `
    tableBody.appendChild(tr);
})
}

function order(id, name, fieldName, quantity, quantityFieldName){
    let value = document.getElementById(fieldName).value;
    let updatedQuantity = parseInt(value) + parseInt(quantity);
    console.log(id, name, fieldName, value);
    let localStockOrderApiPutUrl = localStockOrderApi + "/" + id + "?name=" + name + "&quantity=" + updatedQuantity;
    fetch(localStockOrderApiPutUrl,{
        method:'PUT'
    }).then(response => {
        return response.json();
    }).then(data => {
        let newQuantity = data.quantity;
        console.log(data);
        console.log(quantityFieldName,
            document.getElementById(quantityFieldName).innerText);
        console.log(newQuantity);
    document.getElementById(quantityFieldName).innerText = newQuantity;
    })
}

function showByCategory() {
    var value = tableOption.options[tableOption.selectedIndex].value;
    console.log(value);
    let categoryValue = "?category=" + value;
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



