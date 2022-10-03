// REST API URLs to connect to back-end
const localLaneApi = "http://localhost:8080/api/v1/bowling-lane";
const localBowlingBookingApi = "http://localhost:8080/api/v1/bowling-booking";

// Table itself retrieved from the HTML document
const bookingTable = document.getElementById("bookingTable2");
// HTML Button element which will trigger generation
const buttCreateTable = document.getElementById("generateTable");
// HTML date input field that the user changes to see bookings for a specific day
let datePicker = document.getElementById("date");

let laneArr = [];
let bookingArr = [];

function createBowlingLaneCountColumn(row, rowcount) {
    // Generate the first cell, used for the row number
    let laneNumber = row.insertCell();
    // Establish first cell text as the bowling lane number
    laneNumber.innerText = rowcount;
    laneNumber.className = "column100 column1"
    laneNumber.setAttribute("data-column","column1")
}

// Adds button with eventListeners
// Needs documentation, but it's 2 AM so not now
function addButton(cell, bookingArr, rowCount) {
    let bookingButton = document.createElement('button');
    bookingButton.innerText = "Book now";
    bookingButton.className = "bookNowButton"
    // bookingButton.setAttribute('style','background-color: #157d31');
    bookingButton.addEventListener('click',function bookButtonAction() {
        bookingButton.innerText = "Booked";
        bookingButton.className = "bookedButton"
        // bookingButton.setAttribute('style', 'background-color: #7d1515');
    });
    // forEach won't work here because it does not support break
    for (let booking of bookingArr) {
        if (booking['bowlingLane']['id'] === rowCount) {
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

function createRow(lane) {
    // Row which is currently being generated established by the entity ID from the back-end
    const rowCount = lane.id;
    // Generating row itself, no cells yet.
    let row = bookingTable.insertRow(rowCount)
    createBowlingLaneCountColumn(row, rowCount);
    // Populate all 12 timeslots with cells
    for (let i = 1; i < 13; i++) {
        row.className = "row100"
        row.insertCell(i);
        // Create new "timeSlot" property for all cells where we store their respective time slot.
        // Assign start hour into new property (e.g. 9 + 1 = 10:00 )
        row.cells.item(i).timeSlot = 9 + i;
        row.cells.item(i).className = "column100 column" +(i+1);
        row.cells.item(i).setAttribute("data-column","column"+(i+1))

        // row.cells.item(i).in = "column100 column" +(i+1);
        addButton(row.cells.item(i), bookingArr, rowCount);
        // Differentiate regular lanes from lanes reserved for children as per customer requirements
        if (rowCount > 20) {
            row.setAttribute("style", "background-color: #157d31");
        }
    }
}

async function fetchBookings(url) {
    return fetch(url).then(response => response.json());
}

async function fetchLanes(url) {
    return fetch(url).then(response => response.json());
}
async function doFetch() {
    // bookingTable.remove()
    laneArr = await fetchLanes(localLaneApi);
    bookingArr = await fetchBookings(localBowlingBookingApi);
    laneArr.forEach(createRow);

    //Jquery Function to highlight the columns
    (function($) {
        "use strict";
        $('.column100').on('mouseover', function() {
            var table1 = $(this).parent().parent().parent();
            var table2 = $(this).parent().parent();
            var verTable = $(table1).data('vertable') + "";
            var column = $(this).data('column') + "";
            $(table2).find("." + column).addClass('hov-column-' + verTable);
            $(table1).find(".row100.head ." + column).addClass('hov-column-head-' + verTable);
        });
        $('.column100').on('mouseout', function() {
            var table1 = $(this).parent().parent().parent();
            var table2 = $(this).parent().parent();
            var verTable = $(table1).data('vertable') + "";
            var column = $(this).data('column') + "";
            $(table2).find("." + column).removeClass('hov-column-' + verTable);
            $(table1).find(".row100.head ." + column).removeClass('hov-column-head-' + verTable);
        });
    })
    (jQuery);
}


// buttCreateTable.addEventListener('click', create24Lanes)
buttCreateTable.addEventListener('click', doFetch)

