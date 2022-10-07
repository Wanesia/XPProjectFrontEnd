/* REST API URLs to connect to back-end */
const localTableApi = "http://localhost:8080/api/v1/hockey-table";
const localHockeyBookingApi = "http://localhost:8080/api/v1/hockey-booking";
const hockeySearchButton = document.getElementById("hockeySearchButton");
const root = document.getElementById("root");

// Arrays to store JSON data from back-end
let bookingArr = [];
/* =================================== */

function injectBookings(booking) {
    const newDiv = document.createElement("div");
    newDiv.classList.add("entity-container");
    root.appendChild(newDiv);
}

async function fetchBookings(url) {
    return fetch(url).then(response => response.json());
}

async function doFetch() {
    bookingArr = await fetchBookings(localHockeyBookingApi);
    bookingArr.forEach(injectBookings);
}

hockeySearchButton.addEventListener('click',doFetch)
