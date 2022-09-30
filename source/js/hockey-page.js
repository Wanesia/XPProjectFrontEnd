// REST API URLs to connect to back-end
const localTableApi = "http://localhost:8080/api/v1/hockey-table";
const localHockeyBookingApi = "http://localhost:8080/api/v1/hockey-booking";

// Table from HTML doc
const bookingTable = document.getElementById("bookingtable3")
// HTML button
const buttCreateTable = document.getElementById("generateTable")//button to create mockup
// HTML date input
let datePicker = document.getElementById("date");

let tableArr = [];
let bookingArr = [];

function createHockeyTableCountColumn(row, rowcount) {
    // Generate the first cell, used for the row number
    let tableNumber = row.insertCell();
    // Establish first cell text as the table number
    tableNumber.innerText = rowcount;
}

// Adds button with eventListeners
// Needs documentation, but it's 2 AM so not now
function addButton(cell, bookingArr, rowCount) {
    let bookingButton = document.createElement('button');
    bookingButton.innerText = "Book now";
    bookingButton.setAttribute('style','background-color: #157d31');
    bookingButton.addEventListener('click',function bookButtonAction() {
        bookingButton.innerText = "Booked";
        bookingButton.setAttribute('style', 'background-color: #7d1515');
    });
    // forEach won't work here because it does not support break
    for (let booking of bookingArr) {
        if (booking['hockeyTable']['id'] === rowCount) {
            let bookingStartDateTime = new Date(Date.parse(booking['startDateTime']));
            let bookingEndDateTime = new Date(Date.parse(booking['endDateTime']));
            let selectedStartDateTime = new Date(datePicker.value);
            let selectedEndDateTime = new Date(datePicker.value);
            selectedStartDateTime.setHours(cell.timeSlot);
            selectedEndDateTime.setHours(cell.timeSlot + 1);

            console.log(
                "\nbs: " + bookingStartDateTime,
                "\nbe: " + bookingEndDateTime,
                "\nsd: " + selectedStartDateTime,
                "\nsdp: " + selectedEndDateTime);

            if (bookingStartDateTime <= selectedStartDateTime && bookingEndDateTime >= selectedEndDateTime) {
                bookingButton.innerText = "Booked";
                bookingButton.setAttribute('style','background-color: #7d1515');
                bookingButton.addEventListener('dblclick', function bookButtonAction(){
                    bookingButton.innerText = "Book now";
                    bookingButton.setAttribute('style','background-color: #157d31');
                });
                cell.appendChild(bookingButton);
                break;
            }
        }
        cell.appendChild(bookingButton);
    }
}

function createRow(table) {
    // Row which is currently being generated established by the entity ID from the back-end
    const rowCount = table.id;
    // Generating row itself, no cells yet.
    let row = bookingTable.insertRow(rowCount)
    createHockeyTableCountColumn(row, rowCount);
    // Populate all 12 timeslots with cells
    for (let i = 1; i < 13; i++) {
        row.insertCell(i);
        // Create new "timeSlot" property for all cells where we store their respective time slot.
        // Assign start hour into new property (e.g. 9 + 1 = 10:00 )
        row.cells.item(i).timeSlot = 9 + i;
        addButton(row.cells.item(i), bookingArr, rowCount);
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
    tableArr.forEach(createRow);
}
buttCreateTable.addEventListener('click', doFetch)

