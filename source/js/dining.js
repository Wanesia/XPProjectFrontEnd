const tables = document.querySelectorAll(".table")
const modal = document.getElementById("modal")
const modalTitle = document.querySelector(".modal-title")
const closeButton = document.getElementById("closeButton")
const saveButton = document.getElementById("saveButton")
const cancelButton = document.getElementById("cancelButton")
const createButton = document.getElementById("createButton")
const inputs = document.querySelectorAll(".inputs")
const dateTimeInput = document.querySelector(".date-picker")
const timeInput = document.querySelector(".time-picker")
const startDate = document.getElementById("startDate")
const time = document.getElementById("time")
const bookedTablesURL = "http://localhost:8080/api/v1/dining-booking"
const customers=[]

console.log(timeInput.value)

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
    console.log("fetching")
    let bookings = await fetchBooking(bookedTablesURL)
    bookings.forEach(booking =>{
        const date = booking.startDateTime.split(" ");
        const endDate = booking.endDateTime.split(" ");
        if(date[0] === dateTimeInput.value && date[1] <= timeVal && timeVal < endDate[1])
        {
            booking.diningTable.id = "Table " + booking.diningTable.id
            console.log(booking.diningTable.id)
            tables.forEach(table => {if(table.id === booking.diningTable.id){
                if(table.style.backgroundColor !== "red")
                {
                    table.style.backgroundColor="red";
                    let customer = {
                            "firstName": booking.customer.firstName,
                            "lastName": booking.customer.lastName,
                            "phoneNumber": booking.customer.phoneNumber,
                            "tableNumber": booking.diningTable.id,
                            "timeOfBooking": date[1]
                    }
                    document.getElementById("firstName").value = customer.firstName
                    document.getElementById("lastName").value = customer.lastName
                    document.getElementById("phoneNumber").value = customer.phoneNumber
                    document.getElementById("time").innerHTML = "Time: " + customer.timeOfBooking
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
    console.log(timeInput.value)
    tables.forEach(table => table.style.backgroundColor="purple")
    if(timeInput.value !== "")
    {
        tables.forEach(addClicker)
        fetchBookedTables()
    }
}

function timeOnChange()
{
    console.log(dateTimeInput.value + " " + timeInput.value)
    let endDateTime = new Date(dateTimeInput.value + " " + timeInput.value)
    endDateTime.setHours(endDateTime.getHours() + 3);
    tables.forEach(table => table.style.backgroundColor="purple")
    timeVal = timeInput.value + ":00"
    if(dateTimeInput.value !== "")
    {
        tables.forEach(addClicker)
        fetchBookedTables()
    }
}

function padTo2Digits(num) {
    return String(num).padStart(2, '0');
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
    const response = await fetch(url, fetchOptions);

    console.log(response)
    if (!response.ok) {
        console.log("fuck you");
    };

    return response;
}

function addClicker(table) {
    function func() {
        inputs.forEach(input=>input.value="")
        createButton.disabled = true;
        startDate.innerHTML = "Date: " + dateTimeInput.value
        time.innerHTML = "Time: " + timeInput.value
        modal.style.display="block";
        modalTitle.innerHTML = table.id;
        createButton.addEventListener("click", e => {modal.style.display="none";
            if(table.id == modalTitle.innerHTML && table.style.backgroundColor !== "red")
            {

                table.style.backgroundColor="red";
            }
            let endDateTime = new Date(dateTimeInput.value + " " + timeInput.value)
            endDateTime.setHours(endDateTime.getHours() + 3);
            let booking = {
                startDateTime: dateTimeInput.value + " " + timeInput.value,
                endDateTime: dateTimeInput.value + " " + padTo2Digits(endDateTime.getHours()) + ":" + padTo2Digits(endDateTime.getMinutes()),
                customer:{
                    firstName: document.getElementById("firstName").value,
                    lastName: document.getElementById("lastName").value,
                    phoneNumber: document.getElementById("phoneNumber").value,
                },
                diningTable:{
                    id: modalTitle.innerHTML.replace("Table ", ""),
                    booked:false},
            }
            console.log(booking)
            if(booking.customer.firstName != "")
            {
                restPostDiningBooking(booking)
            }
            inputs.forEach(input=>input.value="")
        })
        createButton.style.display = "block"
        cancelButton.style.display = "none"
        saveButton.style.display = "none"
        closeButton.addEventListener("click", e=> {modal.style.display="none";inputs.forEach(input=>input.value="")})
        customers.forEach(customer => {if(table.id == customer.tableNumber)
        {
            document.getElementById("firstName").value = customer.firstName
            document.getElementById("lastName").value = customer.lastName
            document.getElementById("phoneNumber").value = customer.phoneNumber
            document.getElementById("time").innerHTML = "Time: " + customer.timeOfBooking
            createButton.style.display = "none"
            cancelButton.style.display = "block"
            saveButton.style.display = "block"
        }})
    }
    if(timeInput.value <= "21:00")
    {
        table.addEventListener("click",func)
    }
    else if(timeInput.value > "21:00")
    {
        table.replaceWith(table.cloneNode(true))
    }
}

//sets date to today's
document.getElementById('date').valueAsDate = new Date()