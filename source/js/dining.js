let tables;
const modal = document.getElementById("modal")
const modalTitle = document.querySelector(".modal-title")
const closeButton = document.getElementById("closeButton")
const saveButton = document.getElementById("saveButton")
const cancelButton = document.getElementById("cancelButton")
const createButton = document.getElementById("createButton")
const inputs = document.querySelectorAll(".inputs")
const dateTimeInput = document.querySelector(".date-picker")
const timeInput = document.querySelector(".time-picker")
const newDate = document.getElementById("newDate")
const newTime = document.getElementById("newTime")
const bookedTablesURL = "http://localhost:8080/api/v1/dining-booking"
const customers=[]
let bookings

dateTimeInput.valueAsDate = new Date();

function checkIfFilled()
{
    if(document.getElementById("firstName").value !== ""
        && document.getElementById("lastName").value !== ""
        && document.getElementById("phoneNumber").value !== "")
    {
        createButton.disabled=false;
    }
}

async function fetchBookedTables()
{
    bookings = await fetchBooking(bookedTablesURL)
    bookings.forEach(booking =>{
        const date = booking.startDateTime.split(" ");
        const endDate = booking.endDateTime.split(" ");
        if(date[0] === dateTimeInput.value && date[1] <= timeVal && timeVal < endDate[1])
        {
            booking.diningTable.id = "Table " + booking.diningTable.id
            tables.forEach(table => {if(table.id === booking.diningTable.id){
                if(table.style.backgroundColor !== "#f00511")
                {
                    table.style.backgroundColor="#f00511";
                    const customer = {
                            "firstName": booking.customer.firstName,
                            "lastName": booking.customer.lastName,
                            "phoneNumber": booking.customer.phoneNumber,
                            "tableNumber": booking.diningTable.id,
                            "timeOfBooking": date[1],
                            "endTimeOfBooking": endDate[1],
                            "dateOfBooking": dateTimeInput.value
                    }
                    document.getElementById("firstName").value = customer.firstName
                    document.getElementById("lastName").value = customer.lastName
                    document.getElementById("phoneNumber").value = customer.phoneNumber
                    customers.push(customer)
                    createButton.style.display = "none"
                    cancelButton.style.display = "block"
                    saveButton.style.display = "block"
                }
            }})
        }
    })
}

function fetchBooking(url) {
    return fetch(url).then(response => response.json());
}

function dateOnChange()
{
    tables.forEach(table => table.style.backgroundColor="#704F32")
    if(timeInput.value !== "")
    {
        tables.forEach(addClicker)
        fetchBookedTables()
    }
}

function timeOnChange()
{
    tables = document.querySelectorAll(".table")
    let endDateTime = new Date(dateTimeInput.value + " " + timeInput.value)
    endDateTime.setHours(endDateTime.getHours() + 3);
    tables.forEach(table => table.style.backgroundColor="#704F32")
    timeVal = timeInput.value + ":00"
    tables.forEach(addClicker)
    fetchBookedTables()
}

function padTo2Digits(num) {
    return String(num).padStart(2, '0');
}

async function restDeleteDiningBooking(booking) {
    const url = "http://localhost:8080/api/v1/dining-booking";

    const fetchOptions = {
        method: "DELETE",
        headers: {
            "Content-type": "application/json"
        },
        body: ""
    }

    const jsonString = JSON.stringify(booking);
    fetchOptions.body = jsonString;

    //calls backend and wait for return
    const response = await fetch(url, fetchOptions).then(fetchBookedTables);
    timeOnChange()
    return response;
}

async function restDeleteCustomer(customer) {
    const url = "http://localhost:8080/api/v1/customer";

    const fetchOptions = {
        method: "DELETE",
        headers: {
            "Content-type": "application/json"
        },
        body: ""
    }

    const jsonString = JSON.stringify(customer);
    fetchOptions.body = jsonString;

    //calls backend and wait for return
    const response = await fetch(url, fetchOptions)
    return response;
}

async function restPutDiningBooking(booking) {
    const url = "http://localhost:8080/api/v1/dining-booking"

    const fetchOptions = {
        method: "PUT",
        headers: {
            "Content-type": "application/json"
        },
        body: ""
    }

    const jsonString = JSON.stringify(booking);
    fetchOptions.body = jsonString;

    //calls backend and wait for return
    const response = await fetch(url, fetchOptions)
    timeOnChange();
    return response.status
}

async function restPostDiningBooking(booking) {
    const url = "http://localhost:8080/api/v1/dining-booking";

    const fetchOptions = {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: ""
    }

    const jsonString = JSON.stringify(booking);
    fetchOptions.body = jsonString;

    //calls backend and wait for return
    const response = await fetch(url, fetchOptions)//.then(fetchBookedTables)
    //timeOnChange()
    return response.status;
}

function addClicker(table) {
     function tableClick() {
        inputs.forEach(input=>{input.value=""; input.disabled = null;})
        createButton.disabled = true;
        modal.style.display="block";
        newTime.value = timeInput.value;
        newDate.value = dateTimeInput.value;
        newTime.disabled = true;
        newDate.disabled = true;
        modalTitle.innerHTML = table.id;
        document.getElementById("errorText").style.display = "none"
        saveButton.addEventListener("click", async e => {
            let bookingId;
            bookings.forEach(bookingFetched => {
                let currentEnd = new Date(dateTimeInput.value + " " + timeInput.value)
                currentEnd.setHours(currentEnd.getHours() + 1);
                if (bookingFetched.startDateTime <= dateTimeInput.value + " " + timeInput.value
                    && bookingFetched.endDateTime <= dateTimeInput.value + " " + padTo2Digits(currentEnd.getHours()) + ":" + padTo2Digits(currentEnd.getMinutes())
                    && bookingFetched.diningTable.id == modalTitle.innerHTML) {
                    bookingId = bookingFetched.id;
                }
            })
            let endDateTime = new Date(document.getElementById("newDate").value + " " + document.getElementById("newTime").value)
            endDateTime.setHours(endDateTime.getHours() + 1);
            let booking = {
                id: bookingId,
                startDateTime: document.getElementById("newDate").value + " " + document.getElementById("newTime").value,
                endDateTime: document.getElementById("newDate").value + " " + padTo2Digits(endDateTime.getHours()) + ":" + padTo2Digits(endDateTime.getMinutes()),
                diningTable: {
                    id: modalTitle.innerHTML.replace("Table ", ""),
                    booked: false,
                }
            }
            if (document.getElementById("firstName").value != "" && document.getElementById("lastName").value != "" && document.getElementById("phoneNumber").value != "") {
                const responseCode = await restPutDiningBooking(booking)
                if (responseCode === 400) {
                    document.getElementById("errorText").innerHTML =  "You are not able to change the booking for the chosen time, please pick a different time."
                    document.getElementById("errorText").style.display = "block"
                } else {

                    modal.style.display = "none";
                }
            }

            inputs.forEach(input => input.value = "")
        })
        cancelButton.addEventListener("click", async e=> {
            if(table.id == modalTitle.innerHTML && table.style.backgroundColor === "#f00511") {
                table.style.backgroundColor = "#704F32"
            }
            let bookingStart
            let bookingEnd
            let bookingId;
            bookings.forEach(bookingFetched => {
                let endDateTime = new Date(bookingFetched.startDateTime)
                endDateTime.setHours(endDateTime.getHours() + 1);
                if(bookingFetched.startDateTime <= dateTimeInput.value + " " + timeInput.value
                    && bookingFetched.endDateTime <= dateTimeInput.value + " " + padTo2Digits(endDateTime.getHours()) + ":" + padTo2Digits(endDateTime.getMinutes())
                    && bookingFetched.diningTable.id == modalTitle.innerHTML){
                   bookingId = bookingFetched.id;
                   bookingStart = bookingFetched.startDateTime;
                   bookingEnd = bookingFetched.endDateTime;
                }})
            let booking = {
                id: bookingId,
                startDateTime: bookingStart,
                endDateTime: bookingEnd,
                customer:{
                    firstName: document.getElementById("firstName").value,
                    lastName: document.getElementById("lastName").value,
                    phoneNumber: document.getElementById("phoneNumber").value,
                },
                diningTable:{
                    id: modalTitle.innerHTML.replace("Table ", ""),
                    booked:false},
            }
            if(booking.customer.firstName != "" && booking.customer.lastName != "" && booking.customer.phoneNumber != "") {
               restDeleteDiningBooking(booking)
            }
            cus = customers.indexOf(customers.find(customer => customer.dateOfBooking == dateTimeInput.value && customer.tableNumber == modalTitle.innerHTML.replace("Table ", "")))
            customers.splice(cus)
            inputs.forEach(input=>input.value="")
            modal.style.display = "none";
        })
        createButton.addEventListener("click", async e => {
            let endDateTime = new Date(dateTimeInput.value + " " + timeInput.value)
            endDateTime.setHours(endDateTime.getHours() + 1);
            let booking = {
                startDateTime: dateTimeInput.value + " " + timeInput.value,
                endDateTime: dateTimeInput.value + " " + padTo2Digits(endDateTime.getHours()) + ":" + padTo2Digits(endDateTime.getMinutes()),
                customer: {
                    firstName: document.getElementById("firstName").value,
                    lastName: document.getElementById("lastName").value,
                    phoneNumber: document.getElementById("phoneNumber").value,
                },
                diningTable: {
                    id: modalTitle.innerHTML.replace("Table ", ""),
                    booked: false
                },
            }
            if (booking.customer.firstName != "" && booking.customer.lastName != "" && booking.customer.phoneNumber != "") {
                e.preventDefault()
                const responseCode = await restPostDiningBooking(booking);
                if(responseCode === 400)
                {
                    document.getElementById("errorText").innerHTML = "You are unable to book this table for this time, as it conflicts with another booking."
                    document.getElementById("errorText").style.display = "block"
                    createButton.style.display = "block"
                    cancelButton.style.display = "none"
                    saveButton.style.display = "none"
                }
                else
                {
                    modal.style.display = "none";
                    const customer = {
                        "firstName": document.getElementById("firstName").value,
                        "lastName": document.getElementById("lastName").value,
                        "phoneNumber": document.getElementById("phoneNumber").value,
                        "tableNumber": modalTitle.innerHTML.replace("Table ", ""),
                        "timeOfBooking": timeInput.value,
                        "endTimeOfBooking": padTo2Digits(endDateTime.getHours()) + ":" + padTo2Digits(endDateTime.getMinutes()),
                        "dateOfBooking": dateTimeInput.value
                    }
                    customers.push(customer)
                }
            }
            inputs.forEach(input => input.value = "")
        })
        createButton.style.display = "block"
        cancelButton.style.display = "none"
        saveButton.style.display = "none"
        closeButton.addEventListener("click", e=> {modal.style.display="none";inputs.forEach(input=>input.value="")})
        customers.forEach(customer => {if(table.id == customer.tableNumber && timeInput.value >= customer.timeOfBooking && timeInput.value < customer.endTimeOfBooking && dateTimeInput.value === customer.dateOfBooking )
        {
            document.getElementById("firstName").value = customer.firstName
            document.getElementById("lastName").value = customer.lastName
            document.getElementById("phoneNumber").value = customer.phoneNumber
            document.getElementById("newDate").value = customer.dateOfBooking
            newTime.value = customer.timeOfBooking
            createButton.style.display = "none"
            cancelButton.style.display = "block"
            saveButton.style.display = "block"
            inputs.forEach(input => input.disabled = "true")
            document.querySelectorAll(".hidden-input").forEach(input => input.style.display = "block")
            newTime.disabled = false;
            newDate.disabled = false;
        }})
    }
    if(timeInput.value > "21:00" || timeInput.value < "10:00")
    {
        table.replaceWith(table.cloneNode(true))
    }
    if(timeInput.value <= "21:00" && timeInput.value >= "10:00")
    {
        table.addEventListener("click",tableClick)
    }
}

function newTimeOnChange()
{
    if(newTime.value > "21:00")
    {
        newTime.value = "21:00"
        alert("You cannot book a table after 21:00");
    }
    if(newTime.value < "10:00")
    {
        newTime.value = "10:00"
        alert("You cannot book a table before 10:00");
    }
}

//sets date to today's
document.getElementById('date').valueAsDate = new Date()