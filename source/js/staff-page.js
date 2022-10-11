const localEmployeeApi = "http://localhost:8080/api/v1/employee";
const localEmployeeBookingApi = "http://localhost:8080/api/v1/employee-booking";

const cookRow = document.getElementById("cook-row");
const waiterRow = document.getElementById("waiter-row");
const cashierRow = document.getElementById("cashier-row");
const bowlingRow = document.getElementById("bowling-row");
const cleaningRow = document.getElementById("cleaning-row");

const tableBody = document.getElementById("tableBody");

let employeeArr = [];
let employeeBookingArr = [];

/**
 * GET (Create --> READ <-- Update Delete)
 * @param booking
 */
function injectEmployeeBooking(booking) {
    const newCell = document.createElement("td");
    newCell.innerText = booking["employee"]["firstName"] + " " + booking["employee"]["lastName"].charAt(0) + ".";

    const positionCell = document.createElement("td");
    positionCell.innerText = booking["position"];

    function shiftTimeInserter(row) {
        if (booking["shiftTime"]) {
            row.append(positionCell, newCell);
        } else {
            row.append(
                positionCell,
                document.createElement("td"),
                newCell);
        }
    }

    switch(booking["position"]) {
        case "Cook": shiftTimeInserter(cookRow);
            break;
        case "Waiter": shiftTimeInserter(waiterRow);
            break;
        case "Cashier": shiftTimeInserter(cashierRow);
            break;
        case "Bowling": shiftTimeInserter(bowlingRow);
            break;
        case "Cleaning": shiftTimeInserter(cleaningRow);
            break;
    }
}

function addEmployeeBooking() {
    cookRow.innerHTML = "";
    waiterRow.innerHTML = "";
    cashierRow.innerHTML = "";
    bowlingRow.innerHTML = "";
    cleaningRow.innerHTML = "";
}


async function fetchEntity(url) {
    return fetch(url).then(response => response.json());
}

async function doFetch() {
    employeeArr = await fetchEntity(localEmployeeApi);
    employeeBookingArr = await fetchEntity(localEmployeeBookingApi);
    employeeBookingArr.forEach(injectEmployeeBooking);
}


doFetch().then(r => console.log(r));