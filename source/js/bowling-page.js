
const bookingTable = document.getElementById("bookingtable2")
const buttCreateTable = document.getElementById("generateTable")//button to create mockup

function createTable() {

    //Declaring row and column Variables
    let cellCount = 0
    let rowCount = bookingTable.rows.length
    // console.log('we are in create table')
    // console.log('generating row '+rowCount)
    let row = bookingTable.insertRow(rowCount)

    //Last rows reserved for kids have different Backgroung
    if (rowCount>20) {
        // console.log('in setattr')
        row.setAttribute('style','background-color: #157d31')
    }

    //column that displays the Lane number
    let laneNumber = row.insertCell(cellCount++)
    laneNumber.innerText = rowCount

    //Declaring/Creating rows
    let hour10 = row.insertCell(cellCount++)
    let hour11 = row.insertCell(cellCount++)
    let hour12 = row.insertCell(cellCount++)
    let hour13 = row.insertCell(cellCount++)
    let hour14 = row.insertCell(cellCount++)
    let hour15 = row.insertCell(cellCount++)
    let hour16 = row.insertCell(cellCount++)
    let hour17 = row.insertCell(cellCount++)
    let hour18 = row.insertCell(cellCount++)
    let hour19 = row.insertCell(cellCount++)
    let hour20 = row.insertCell(cellCount++)
    let hour21 = row.insertCell(cellCount++)

    //Adds button with eventlisteners
    function addButton(item) {
        let bookingButton = document.createElement('button')
        bookingButton.textContent = 'Book now'
        bookingButton.setAttribute('style','background-color: #157d31')
        bookingButton.addEventListener('click',function bookButtonAction(){
            console.log('You pressed this button ' + ' ' + cellCount)
            console.log('lane :'+ rowCount)
            console.log('hour :'+ (cellCount++ -3))
                bookingButton.innerText = "Booked"
                bookingButton.setAttribute('style','background-color: #7d1515')
            }
        )
        bookingButton.addEventListener('dblclick',function bookButtonAction(){
            bookingButton.innerText = "Book now"
            bookingButton.setAttribute('style','background-color: #157d31')
        })
        item.appendChild(bookingButton)
    }

    // declaring array of lanes to add buttons to
    const nonBowlingClubLanes = [hour10, hour11, hour12, hour13, hour14, hour15, hour16,hour17, hour18, hour19, hour20,hour21]
    nonBowlingClubLanes.forEach(addButton)
    //modifying lanes for bowling club
    if (rowCount<15) {
        const bowlingClubLanes = [hour10, hour11, hour12, hour13, hour14, hour15, hour16]
        bowlingClubLanes.forEach(format)
        function format(item) {
            item.innerText = 'Bowling Club'

            item.setAttribute('style','background-color: #7d1515')
        }
    }
}
// Mockup function to create all 24 lanes
function create24Lanes() {

    for (let i = 0; i <24; i++) {
        createTable()
    }
}

buttCreateTable.addEventListener('click', create24Lanes)

