const localStockOrderApi = "http://localhost:8080/api/v1/stock";

const stockDropDown = document.getElementById('stock-drop-down')

window.onload = loadIntoTable();

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

        let tableBody = document.getElementById("table_body")
        data.map(stock => {
            let tr = document.createElement("tr")
            tr.innerHTML = `
                <td>${stock.name}</td>
                <td>${stock.quantity}</td>
                <td><input type="number" value='${index}'/></td>
            `
            tableBody.appendChild(tr)
        })

    });

}


let value = stockDropDown.value
let text = stockDropDown.options[stockDropDown.selectedIndex].text

function showStocktable() {
    if  (document.getElementById("stock-drop-down").value === "Bowling" && json.value.name === "bowling") {
        loadIntoTable()
    }

    else if (document.getElementById("stock-drop-down").value === "Air Hockey") {
        loadIntoTable()
    }
    else {
        loadIntoTable()
    }
}

stockDropDown.addEventListener('click', showStocktable)





