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

// console.log(`NOSH is: ${businessStatus}`)
// console.log(`Current time: ${currentTime}:00`)