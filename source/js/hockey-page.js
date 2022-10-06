/* REST API URLs to connect to back-end */
const localTableApi = "http://localhost:8080/api/v1/hockey-table";
const localHockeyBookingApi = "http://localhost:8080/api/v1/hockey-booking";
// Arrays to store JSON data from back-end
let tableArr = [];
let bookingArr = [];
/* =================================== */

/* ========== Main elements ========== */
// Table from HTML template
const tableBody = document.getElementById("tableBody");
// HTML button to generate table
const generateTable = document.getElementById("generateTable");
// HTML date input
let datePicker = document.getElementById("date");
/* =================================== */

/* ============== Modal ============== */
// Modal itself
const modal = document.getElementById("modal");
// Title
const modalTitle = document.getElementById("modalTitle");
// Input fields
const startDateTime = document.getElementById("startDateTime");
const endDateTime = document.getElementById("endDateTime");
const customerFirstName = document.getElementById("customerFirstName");
const customerLastName = document.getElementById("customerLastName");
const customerTelephone = document.getElementById("customerTelephone");
// Buttons
const bookButton = document.getElementById("bookButton");
const confirmChangesButton = document.getElementById("confirmChangesButton");
const cancelButton = document.getElementById("cancelButton");
const closeButton = document.getElementById("closeButton");
/* =================================== */

// Load table by default on window render
document.addEventListener("DOMContentLoaded", () => {
    generateTable.click();
});

async function putRequest(evt, id) {
    const fetchOptions = {
        method: "PUT",
        headers: {
            "Content-type": "application/json"
        },
        body: ""
    }
    const urlStartDateTime = "startDateTime=" + startDateTime.value + ":00";
    const urlEndDateTime = "endDateTime=" + endDateTime.value + ":00";
    const urlFirstName = "firstName=" + customerFirstName.value;
    const urlLastName = "lastName=" + customerLastName.value;
    const urlPhoneNumber = "phoneNumber=" + customerTelephone.value;

    const url = localHockeyBookingApi + "/" + id + "?"
        + urlStartDateTime + "&"
        + urlEndDateTime + "&"
        + urlFirstName + "&"
        + urlLastName + "&"
        + urlPhoneNumber

    const response = await fetch(url, fetchOptions);
    // Refresh page on reload
    if (response.ok) {
        document.location.reload();

        /*
        FIX NEEDED
        */
        datePicker.value = startDateTime.value;
        /*
        FIX NEEDED
        */
    }
    return response;
}

async function deleteRequest(evt, id) {
    const fetchOptions = {
        method: "DELETE",
        headers: {
            "Content-type": "application/json"
        },
        body: ""
    }

    const response = await fetch(localHockeyBookingApi + "/" + id, fetchOptions);

    // Refresh page on reload
    if (response.ok) {
        document.location.reload();

        /*
        FIX NEEDED
        */
        datePicker.value = startDateTime.value;
        /*
        FIX NEEDED
        */
    }
    return response;
}

async function postRequest(evt, row) {
    const fetchOptions = {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: ""
    }

    console.log(row);

    const newBooking = {
        "startDateTime": startDateTime.value
            .replace('T', ' ') + ":00",
        "endDateTime": endDateTime.value
            .replace('T', ' ') + ":00",
        "customer": {
            "firstName": customerFirstName.value,
            "lastName": customerLastName.value,
            "phoneNumber": customerTelephone.value,
        },
        "hockeyTable": {
            "id": row,
            "booked": false,
            "inOrder": true
        }
    }

    fetchOptions.body = JSON.stringify(newBooking);
    const response = await fetch(localHockeyBookingApi, fetchOptions);
    // Refresh page on reload
    if (response.ok) {
        document.location.reload();

        /*
        FIX NEEDED
        */
        datePicker.value = startDateTime.value;
        /*
        FIX NEEDED
        */
    }
    return response;
}

/**
 * Takes care of the logic behind the pop-up window that appears when clicking a cell.
 * @param cell HTML element representing the cell that has been selected
 * @param rowCount Integer representing the row where the cell resides
 * @param isBooked Boolean that is passed for conditional logic for a booked vs. a free cell.
 * @param booking Optional object that represents the booking itself, if any.
 */
function handleModal(cell, rowCount, isBooked, booking) {
    // Handle modal logic
    cell.addEventListener('click', () => {
        // If the modal is being displayed, hide it and stop the rest of the function from executing
        if (!(modal.style.display === "none")) {
            modal.style.display = "none";
            return;
        }
        // If the modal is not being displayed, display it
        modal.style.display = "block";
        modalTitle.innerText = "Hockey Table " + rowCount;

        // If the selected cell corresponds to a booking
        if (isBooked) {
            // Empty input fields from potential previous values
            startDateTime.value = null;
            endDateTime.value = null;
            customerFirstName.value = "";
            customerLastName.value = "";
            customerTelephone.value = "";
            // Set datetime input fields values to booking values
            startDateTime.value = booking.startDateTime;
            endDateTime.value = booking.endDateTime;
            // If there is a customer, set input field values to customer particulars
            if (booking['customer']['id'] !== null) {
                customerFirstName.value = booking['customer']['firstName'];
                customerLastName.value = booking['customer']['lastName'];
                customerTelephone.value = booking['customer']['phoneNumber'];
            }
            // Show buttons for PUT and DELETE, hide POST
            bookButton.setAttribute("style", "display: none");
            confirmChangesButton.setAttribute("style", "display: block");
            cancelButton.setAttribute("style", "display: block");

            confirmChangesButton.addEventListener("click", function (evt) {
                putRequest(evt, booking['id']).then(r => console.log(r));
            });

            cancelButton.addEventListener("click", function(evt) {
                deleteRequest(evt, booking['id']).then(r => console.log(r));
            });

        // If the selected cell does not correspond to a booking
        } else {
            // Empty input fields from potential previous values
            startDateTime.value = null;
            endDateTime.value = null;
            customerFirstName.value = "";
            customerLastName.value = "";
            customerTelephone.value = "";
            // Store two variables with date objects from datePicker
            let selectedStartDateTime = new Date(datePicker.value);
            let selectedEndDateTime = new Date(datePicker.value);

            /*
            FIX NEEDED
            */
            // Assign hours to dates, adding 2 hours because javascript, weird conversion from GMT+2 to UTC
            selectedStartDateTime.setHours(cell.timeSlot + 2);
            selectedEndDateTime.setHours(cell.timeSlot + 3);

            // ValueAsDate does not appear to work on Chrome, will have to find a workaround
            startDateTime.valueAsDate = selectedStartDateTime;
            endDateTime.valueAsDate = selectedEndDateTime;
            /*
            FIX NEEDED
            */

            // Show button for POST and hide buttons for PUT and DELETE
            bookButton.setAttribute("style", "display: block");
            confirmChangesButton.setAttribute("style", "display: none");
            cancelButton.setAttribute("style", "display: none");

            // Prepare POST method on bookButton
            bookButton.addEventListener('click', function(evt) {
                postRequest(evt, rowCount).then(r => console.log(r));
            });
        }
    });
    // Close window on button click
    closeButton.addEventListener('click', () => {modal.style.display = "none"});
}

/**
 * Determines whether a cell is booked or not at table generation.
 * Taken advantage of to also add modal pop-up on click event to each one of them
 * @param cell
 * @param bookingArr
 * @param rowCount
 */
function loadIndividualCell(cell, bookingArr, rowCount) {

    cell.classList.add("interactive-cell");

    function establishCellState(isFree, booking) {
        if (!isFree) {
            cell.innerText = "Booked";
            cell.setAttribute("style","background-color: #f25459; text-align: center;");
            handleModal(cell, rowCount, true, booking);
            return;
        }
        cell.innerText = "Free";
        cell.setAttribute("style","background-color: #8be78b; text-align: center; color: black;");
        handleModal(cell, rowCount, false, null);
    }

    // forEach won't work here because it does not support break
    let booked = false;
    for (let booking of bookingArr) {
        if (booking['hockeyTable']['id'] === rowCount) {
            let bookingStartDateTime = new Date(Date.parse(booking['startDateTime']));
            let bookingEndDateTime = new Date(Date.parse(booking['endDateTime']));
            let selectedStartDateTime = new Date(datePicker.value);
            let selectedEndDateTime = new Date(datePicker.value);
            selectedStartDateTime.setHours(cell.timeSlot);
            selectedEndDateTime.setHours(cell.timeSlot + 1);

            if (bookingStartDateTime < selectedEndDateTime && bookingEndDateTime > selectedStartDateTime) {
                booked = true;
                establishCellState(false, booking);
                break;
            }
        }
    }
    if (!booked) establishCellState(true);
}

/**
 * Responsible for creating all the necessary rows for the table.
 * Also taken advantage to establish cell type and prepare modals.
 * @param table HTML table element where row and cells are to be inserted.
 */
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

/**
 * Responsible from asynchronously fetching bookings from the back-end.
 * @param url REST API URL from where the bookings are fetched
 * @returns {Promise<any>} returns JSON if successful
 */
async function fetchBookings(url) {
    return fetch(url).then(response => response.json());
}

/**
 * Responsible from asynchronously fetching tables from the back-end.
 * @param url REST API URL from where the tables are fetched
 * @returns {Promise<any>} returns JSON if successful
 */
async function fetchTables(url) {
    return fetch(url).then(response => response.json());
}

/**
 * Fetches bookings and tables in a JSON format.
 * Asynchronously stores the results in collections.
 * Serves as the entry point for everything else in this script.
 * De-facto GET method.
 * @returns {Promise<void>}
 */
async function doFetch() {
    tableArr = await fetchTables(localTableApi);
    bookingArr = await fetchBookings(localHockeyBookingApi);
    // Empty table body to prevent duplicates on subsequent generations
    tableBody.innerHTML = "";
    tableArr.forEach(createRow);
}
// Put fetching functionality on generation button
generateTable.addEventListener('click', doFetch)

/*
FIX NEEDED
*/
datePicker.valueAsDate = new Date();
/*
FIX NEEDED
*/