const localEmployeeApi = "http://localhost:8080/api/v1/employee";
const localEmployeeBookingApi = "http://localhost:8080/api/v1/employee-booking";

const tableBody = document.getElementById("table-body");

const createButton = document.getElementById("create");

/* ============== Add Modal ============== */
// Modal itself
const modal = document.getElementById("modal");
// Title
const modalTitle = document.getElementById("modalTitle");
// Input fields
const startDateTime = document.getElementById("startDateTime");
const endDateTime = document.getElementById("endDateTime");
// Buttons
const bookButton = document.getElementById("bookButton");
const confirmChangesButton = document.getElementById("confirmChangesButton");
const cancelButton = document.getElementById("cancelButton");
const closeButton = document.getElementById("closeButton");
/* =================================== */

let employeeArr = [];
let employeeBookingArr = [];

/**
 * GET (Create --> READ <-- Update Delete)
 * @param booking
 */
function injectEmployeeBooking(booking) {

    const row = document.createElement("tr");
    const newCell = document.createElement("td");
    newCell.innerText = booking["employee"]["firstName"] + " " + booking["employee"]["lastName"].charAt(0) + ".";

    const positionCell = document.createElement("td");
    positionCell.innerText = booking["position"];

    modalTitle.innerText = "Book new shift"

    if (booking["shiftTime"]) {
        row.append(positionCell, newCell);
    } else {
        row.append(
            positionCell,
            document.createElement("td"),
            newCell);
    }
    tableBody.appendChild(row);
}

function handleModal() {
    // If the modal is being displayed, hide it and stop the rest of the function from executing
    if (!(modal.style.display === "none")) {
        modal.style.display = "none";
        return;
    }
    // If the modal is not being displayed, display it
    modal.style.display = "block";
    modalTitle.innerText = "Shift";

    // Close window on button click
    closeButton.addEventListener('click', () => {modal.style.display = "none"});
}

async function fetchEntity(url) {
    return fetch(url).then(response => response.json());
}

async function doFetch() {
    tableBody.innerHTML = "";
    employeeArr = await fetchEntity(localEmployeeApi);
    employeeBookingArr = await fetchEntity(localEmployeeBookingApi);
    employeeBookingArr.forEach(injectEmployeeBooking);
}

createButton.addEventListener("click", handleModal);

doFetch().then(r => console.log(r));