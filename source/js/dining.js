const tables = document.querySelectorAll(".table")
const modal = document.getElementById("modal")
const modalTitle = document.querySelector(".modal-title")
const closeButton = document.getElementById("closeButton")
const saveButton = document.getElementById("saveButton")
const inputs = document.querySelectorAll(".inputs")
const dateTimeInput = document.querySelector(".date-picker")
const timeInput = document.querySelector(".time-picker")
const startDate = document.getElementById("startDate")
const time = document.getElementById("time")
const bookedTablesURL = "http://localhost:8080/api/v1/dining-booking"
const customers=[]

console.log(timeInput.value)

dateTimeInput.valueAsDate = new Date();

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
    console.log(dateTimeInput.value)
    tables.forEach(table => table.style.backgroundColor="purple")
    timeVal = timeInput.value + ":00"
    if(dateTimeInput.value !== "")
    {
        tables.forEach(addClicker)
        fetchBookedTables()
    }
}

function addClicker(table) {
    table.addEventListener("click", function() {
        //saveButton.disabled = true;
        startDate.innerHTML = "Date: " + dateTimeInput.value
        time.innerHTML = "Time: " + timeInput.value
        modal.style.display="block";
        modalTitle.innerHTML = table.id;
        saveButton.addEventListener("click", e => {modal.style.display="none";
            if(table.id == modalTitle.innerHTML && table.style.backgroundColor !== "red")
            {
                table.style.backgroundColor="red";
            }
            inputs.forEach(input=>input.value="")

        })
        closeButton.addEventListener("click", e=> {modal.style.display="none";inputs.forEach(input=>input.value="")})
        customers.forEach(customer => {if(table.id == customer.tableNumber)
        {
            document.getElementById("firstName").value = customer.firstName
            document.getElementById("lastName").value = customer.lastName
            document.getElementById("phoneNumber").value = customer.phoneNumber
            document.getElementById("time").innerHTML = "Time: " + customer.timeOfBooking
        }})
    })
}

function enableSaveButton() {
    inputs.forEach(input => {if (input.value !== "") {
        saveButton.disabled = false;
    }})
}