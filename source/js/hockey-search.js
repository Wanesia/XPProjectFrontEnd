/* REST API URLs to connect to back-end */
const localTableApi = "http://localhost:8080/api/v1/hockey-table";
const localHockeyBookingApi = "http://localhost:8080/api/v1/hockey-booking";
const hockeySearchButton = document.getElementById("hockeySearchButton");
const hockeySearchInput = document.getElementById("search-field");
const root = document.getElementById("root");

// Arrays to store JSON data from back-end
let bookingArr = [];
/* =================================== */

function injectBookings(booking) {
    console.log(booking)
    const newDiv = document.createElement("div");
    newDiv.classList.add("entity-container");
    newDiv.innerHTML = booking.customer.firstName;
    root.appendChild(newDiv);
}

async function fetchBookings(url) {
    return fetch(url).then(response => response.json());
}

function getSearchInputField(){
    let inputField = document.getElementById("search-field");
    console.log(inputField.value);
    return inputField.value;
}

async function doFetch() {
    console.log(localHockeyBookingApi + "/" + getSearchInputField() )
    bookingArr = await fetchBookings(localHockeyBookingApi + "/" + getSearchInputField());
    console.log(bookingArr);
    bookingArr.forEach(injectBookings);

}

hockeySearchButton.addEventListener('click',doFetch)
