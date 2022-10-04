const localStockOrderApi = "http://localhost:8080/api/v1/stock";


let textOption = stockDropDown.options[stockDropDown.selectedIndex].text;

const stockDropDown = document.getElementById('stock-drop-down')
stockDropDown.length = 0;
let defaultOption = document.createElement('Option')
defaultOption.text = 'Select Stock'

stockDropDown.add(defaultOption)
stockDropDown.selectedIndex = 0;

 fetch(localStockOrderApi)
    .then(
        function(response) {
            if (response.status !== 200) {
                console.warn('We are f*cked but we dont have to pay bitcoin' + response.status);
                return;
            }

            response.json().then(function (stock) {
                let option;

                for (let i = 0; i < stock.length; i++) {
                    option = document.createElement('option')
                    option.text = stock[i].id
                    option.text = stock[i].name
                    option.text = stock[i].quantity
                    stockDropDown.add(option);
                }
            });
        }
    )
    .catch(function(err) {
        console.error('Fetch Error -', err)
    });


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
    if  (document.getElementById("stock-drop-down").value === "Bowling") {
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





