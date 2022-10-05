const modal = document.getElementById("modal");

// REST API URLs to connect to back-end
const localTableApi = "http://localhost:8080/api/v1/hockey-table";
const localHockeyBookingApi = "http://localhost:8080/api/v1/hockey-booking";

// Table from HTML doc
const tableBody = document.getElementById("tableBody");
// HTML button
const buttCreateTable = document.getElementById("generateTable")//button to create mockup
// HTML date input
let datePicker = document.getElementById("date");

let tableArr = [];
let bookingArr = [];

/**
 * Used as callback function on cell event listener.
 * Will either show or hide a modal (pop-up window).
 */
function handleModal() {
    // If the modal is being displayed, hide it and stop the rest of the function from executing
    if (!(modal.style.display === "none")) {
        modal.style.display = "none";
        return;
    }
    // If the modal is not being displayed, display it
    modal.style.display = "block";
    // Get references to all elements in the modal from HTML using IDs
    // Title
    const modalTitle = document.getElementById("modalTitle");
    // Input fields
    const startDateTime = document.getElementById("startDateTime");
    const endDateTime = document.getElementById("endDateTime");
    const customerName = document.getElementById("customer");
    const customerTelephone = document.getElementById("customerTelephone");
    // Buttons
    const bookButton = document.getElementById("bookButton");
    const confirmChangesButton = document.getElementById("confirmChangesButton");
    const cancelButton = document.getElementById("cancelButton");
    const closeButton = document.getElementById("closeButton");

    closeButton.addEventListener('click', handleModal);
}

function loadIndividualCell(cell, bookingArr, rowCount) {

    cell.addEventListener('click', handleModal);
    cell.classList.add("interactive-cell");

    function formatCellText(isFree) {
        if (!isFree) {
            cell.innerText = "Booked";
            cell.setAttribute("style","background-color: #f25459; text-align: center;");
            return;
        }
        cell.innerText = "Free";
        cell.setAttribute("style","background-color: #8be78b; text-align: center; color: black;");
    }

    formatCellText(true);

    // forEach won't work here because it does not support break
    for (let booking of bookingArr) {
        if (booking['hockeyTable']['id'] === rowCount) {
            let bookingStartDateTime = new Date(Date.parse(booking['startDateTime']));
            let bookingEndDateTime = new Date(Date.parse(booking['endDateTime']));
            let selectedStartDateTime = new Date(datePicker.value);
            let selectedEndDateTime = new Date(datePicker.value);
            selectedStartDateTime.setHours(cell.timeSlot);
            selectedEndDateTime.setHours(cell.timeSlot + 1);

            if (bookingStartDateTime <= selectedStartDateTime && bookingEndDateTime >= selectedEndDateTime) {
                formatCellText(false);
                break;
            }
        }
    }
}

function createRow(table) {
    // Row which is currently being generated established by the entity ID from the back-end
    const rowCount = table.id;
    // Generating row itself, no cells yet.
    let row = tableBody.insertRow(rowCount - 1)
    // Generate the first cell, used for the row number
    let tableNumber = row.insertCell();
    // Establish first cell text as the table number
    tableNumber.innerText = rowCount;
    // Populate all 12 timeslots with cells
    for (let i = 1; i < 13; i++) {
        row.insertCell(i);
        // Create new "timeSlot" property for all cells where we store their respective time slot.
        // Assign start hour into new property (e.g. 9 + 1 = 10:00 )
        row.cells.item(i).timeSlot = 9 + i;
        loadIndividualCell(row.cells.item(i), bookingArr, rowCount);
    }
}

async function fetchBookings(url) {
    return fetch(url).then(response => response.json());
}

async function fetchTables(url) {
    return fetch(url).then(response => response.json());
}
async function doFetch() {
    tableArr = await fetchTables(localTableApi);
    bookingArr = await fetchBookings(localHockeyBookingApi);
    // Empty table body to prevent duplicates on subsequent generations
    tableBody.innerHTML = "";
    tableArr.forEach(createRow);
}
buttCreateTable.addEventListener('click', doFetch)

document.getElementById('date').valueAsDate = new Date();