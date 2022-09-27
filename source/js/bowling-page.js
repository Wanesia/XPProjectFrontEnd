
const bookingTable = document.getElementById("bookingtable2")
const buttCreateTable = document.getElementById("generateTable")

function createTable() {
    let cellCount = 0
    let rowCount = bookingTable.rows.length
    console.log('we are in create table')
    console.log(rowCount)
    let row = bookingTable.insertRow(rowCount)

    if (rowCount>20) {
        console.log('in setattr')
        row.setAttribute('style','background-color: #157d31')
    }

    let laneNumber = row.insertCell(cellCount++)
    laneNumber.innerText = rowCount

    let bookingButton = document.createElement('button')
    bookingButton.textContent = 'Book now'
    bookingButton.addEventListener('click',function print(){
        console.log('You pressed this button' + rowCount+ ' ' + cellCount)
    })

    let hour1 = row.insertCell(cellCount++)
    hour1.appendChild(bookingButton)
    let hour2 = row.insertCell(cellCount++)
    hour2.appendChild(bookingButton)
    let hour3 = row.insertCell(cellCount++)
    let hour4 = row.insertCell(cellCount++)
    let hour5 = row.insertCell(cellCount++)
    let hour6 = row.insertCell(cellCount++)
    let hour7 = row.insertCell(cellCount++)
    let hour8 = row.insertCell(cellCount++)
    hour8.appendChild(bookingButton)
    //hour8.innerText = 'Hi'
    let hour9 = row.insertCell(cellCount++)
    let hour10 = row.insertCell(cellCount++)
    let hour11 = row.insertCell(cellCount++)


    if (rowCount<15) {
        const bowlingClubLanes = [hour1, hour2, hour3, hour4, hour5, hour6, hour7]
        bowlingClubLanes.forEach(format)
        function format(item) {
            item.innerText = 'Bowling Club'
            item.setAttribute('style','background-color: #7d1515')
        }
    }

    const nonBowlingClubLanes = [hour8, hour9, hour10, hour11]
    nonBowlingClubLanes.forEach(addButton)
    function addButton(item) {
        item.append(bookingButton)
    }





}

// Mockup function to create all 24 lanes
function create24Lanes() {
    for (let i = 0; i <24; i++) {
        createTable()
    }


}

buttCreateTable.addEventListener('click', create24Lanes)

