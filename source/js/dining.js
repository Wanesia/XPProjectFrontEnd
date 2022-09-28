const tables = document.querySelectorAll(".table")
const modal = document.getElementById("modal")
tables.forEach(addClicker)
function addClicker(table)
{
    table.addEventListener("click", e => {modal.style.display="block"})
}


