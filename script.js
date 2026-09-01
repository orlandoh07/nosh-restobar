// Animation system
document.documentElement.classList.add('js-loaded')

// Select color on change
document.getElementById('item').addEventListener('change', function() {
  this.style.color = this.value ? '#333333' : '#aaaaaa'
})

// Business data
const business = {
  name: "NOSH",
  slogan: "Comida que golpea",
  isOpen: true,
  schedule: {
    open: 11,
    close: 23
  }
}

// Current status
const currentTime = new Date().getHours()
const isOpen = currentTime >= business.schedule.open && 
               currentTime < business.schedule.close

const businessStatus = isOpen ? "Open now" : "Closed now"

// Greeting based on time
const greeting = currentTime < 12 ? "Good Morning" :
                 currentTime < 18 ? "Good Afternoon" : 
                 "Good Evening"

// Schedule by day
const today = new Date().getDay()
// 0 = Sunday, 1 = Monday, 2 = Tuesday, 3 = Wednesday, 4 = Thursday, 5 = Friday, 6 = Saturday

let todaySchedule

switch (today) {
  case 1:
  case 2:
  case 3:
  case 4:
  case 5:
    todaySchedule = "Open from 11:00am to 11:00pm"
    break
  case 0:
  case 6:
    todaySchedule = "Open from 11:00am to 2:00pm"
    break
  default: 
    todaySchedule = "Schedule not available"
}

// Menu Items
const menuItems = [
  {name: "Classic NOSH", price: 5.00 , category: "burger"},
  {name: "Double Smash", price: 7.50, category: "burger"},
  {name: "Street Dog", price: 4.00, category: "hotdog"},
  {name: "Bacon Dog", price: 5.50, category: "hotdog"},
  {name: "Papas NOSH", price: 2.50, category: "sides"},
  {name: "Refresco", price: 1.50, category: "sides"},
]