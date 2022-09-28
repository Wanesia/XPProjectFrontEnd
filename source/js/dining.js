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

function dateOnChange()
{
    console.log(timeInput.value)
    if(timeInput.value !== "")
    {
        tables.forEach(addClicker)
    }
}

function timeOnChange()
{
    console.log(dateTimeInput.value)

    if(dateTimeInput.value !== "")
    {
        tables.forEach(addClicker)
    }
}

function addClicker(table) {
    table.addEventListener("click", function() {
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
    })
}
