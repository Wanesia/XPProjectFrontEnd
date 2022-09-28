const tables = document.querySelectorAll(".table")
const modal = document.getElementById("modal")
const modalTitle = document.querySelector(".modal-title")
const closeButton = document.getElementById("closeButton")
const saveButton = document.getElementById("saveButton")

tables.forEach(addClicker)
tables.forEach(changeBackground)



function addClicker(table) {
    table.addEventListener("click", function() {
        modal.style.display="block";
        modalTitle.innerHTML = table.id;
        saveButton.addEventListener("click", e => {table.style.backgroundColor="red";modal.style.display="none"})
        closeButton.addEventListener("click", e=> {modal.style.display="none"})
        if(table.id !== modalTitle.innerHTML)
        {
            table.style.backgroundColor="purple"
        }
    })
}
