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

// Current time
const currentTime = new Date().getHours()

// Menu Items
const menuItems = [
  { name: "Classic NOSH", price: 5.00, category: "burger", description: "Carne 200g, queso americano, lechuga, tomate y salsa de la casa." },
  { name: "Double Smash", price: 7.50, category: "burger", description: "Doble carne smash, doble queso, cebolla caramelizada y pepinillos." },
  { name: "Street Dog", price: 4.00, category: "hotdog", description: "Salchicha ahumada, mostaza, ketchup, cebolla y papas fritas (ralladas)." },
  { name: "Bacon Dog", price: 5.50, category: "hotdog", description: "Salchicha envuelta en bacon, queso derretido y jalapeños." },
  { name: "Papas NOSH", price: 2.50, category: "sides", description: "Papas fritas con aliño especial y salsa ranch." },
  { name: "Refresco", price: 1.50, category: "sides", description: "Coca-Cola, Nestea o agua. Vaso grande con hielo." }
]

// FUNCTIONS

// Returns greeting based on current hour
const getGreeting = (hour) => {
  if (hour < 12) return "Good Morning"
  if (hour < 18) return "Good Afternoon"
  return "Good Evening"
}

// Calculates total price of an order
const calculateOrderTotal = (price, quantity, taxRate = 0.16) => {
  const subtotal = price * quantity
  const tax = subtotal * taxRate
  const total = subtotal + tax
  return total.toFixed(2)
}

// Return products filtered by category
const getProductsByCategory = (items, category) =>
  items.filter(item => item.category === category)

// Returns business status based on current hour
const getBusinessStatus = (hour, schedule) => {
  const isCurrentlyOpen = hour >= schedule.open && hour < schedule.close
  return {
    isOpen: isCurrentlyOpen,
    status: isCurrentlyOpen ? "Open now" : "Closed now",
    schedule: isCurrentlyOpen
      ? `Closes at ${schedule.close}:00`
      : `Opens at ${schedule.open}:00`
  }
}

const status = getBusinessStatus(currentTime, business.schedule)

// Formats a number as price string
const formatPrice = (price) => `$${parseFloat(price).toFixed(2)}`

// Order summary
const orderSummary = (itemName, price, quantity) => {
  const item = menuItems.find(i => i.name === itemName)
  if (!item) return "Product not found"
  const total = calculateOrderTotal(item.price, quantity)
  const formattedTotal = formatPrice(total)
  return `Order: ${item.name} x${quantity} = ${formattedTotal}`
}

// Calculate total value of all menu items
const getMenuTotal = (items) => 
  items.reduce((acc, item) => acc + item.price, 0).toFixed(2)

// Returns menu items formatted for display
const getFormattedMenu = (items) =>
  items.map(({name, price, category}) => ({
    name,
    price: formatPrice(price),
    category 
  }))

// Returns combined items from multiple categories
const getItemsByCategories = (items, ...categories) =>
  categories.flatMap(category => getProductsByCategory(items, category))

// Find product by its form value
const getProductByValue = (value) => {
  const valueMap = {
    "classic": "Classic NOSH",
    "smash": "Double Smash",
    "street-dog": "Street Dog",
    "bacon-dog": "Bacon Dog",
    "fries": "Papas NOSH"
  }
  return menuItems.find(item => item.name === valueMap[value])
}

// DOM MANIPULATION

// update hero with dinamic greeting
const heroTitle = document.querySelector("#hero h2")
const heroSubtitle = document.querySelector("#hero p")

if (heroTitle) {
  heroTitle.textContent= `${getGreeting(currentTime)}, welcome to ${business.name}!` 
}

if (heroSubtitle) {
  heroSubtitle.textContent = business.slogan
}

// update business status in header
const statusElement = document.getElementById("business-status")

if(statusElement) {
  statusElement.textContent = status.status
  statusElement.classList.add(status.isOpen ? "status--open" : "status--closed")
}

//render menu dinamically
const menuContainer = document.getElementById("menu-container")

if (menuContainer){
  const categories = ["burger", "hotdog", "sides"]
  const categoryNames = {
    burger: "Burgers",
    hotdog: "Hot Dogs",
    sides: "Sides & Drinks"
  }

  categories.forEach(category =>{
    const products = getProductsByCategory(menuItems, category)

    const categoryHTML = `
      <div class="category">
        <h3>${categoryNames[category]}</h3>
        <div class="products-grid">
          ${products.map(({ name, price, description }) => `
            <article class="product">
              <img src="https://via.placeholder.com/300x200"
                  alt="${name}"
                  loading="lazy">
              <div class="product-info">
                <h4>${name}</h4>
                <p>${description}</p>
                <span class="price">${formatPrice(price)}</span>
              </div>
            </article>
          `).join("")}
        </div>
      </div>
    `

    menuContainer.insertAdjacentHTML("beforeend", categoryHTML)
  })
}

// Highlight today's schedule in footer
const scheduleRows = document.querySelectorAll("footer tbody tr")
const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

scheduleRows.forEach((row, index) => {
  const firstCell = row.querySelector("td")
  if (firstCell) {
    if (index === 0 && today >= 1 && today <= 5) {
      row.classList.add("schedule--active")
    }
    if (index === 1 && (today === 0 || today === 6)) {
      row.classList.add("schedule--active")
    }
  }
})

// Form submission
const orderForm = document.querySelector("form")

if (orderForm) {
  orderForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const formData = {
      name: document.getElementById("full-name").value,
      phone: document.getElementById("phone").value,
      item: document.getElementById("item").value,
      notes: document.getElementById("notes").value
    }

    if (!formData.item) {
      alert("Please select a menu item")
      return
    }

    const product = getProductByValue(formData.item)

    if (!product) {
      alert("Product not found")
      return
    }

    const total = calculateOrderTotal(product.price, 1)
    const formattedTotal = formatPrice(total)

    alert(`Order received!\n${product.name} - ${formattedTotal}\n\nWe'll call ${formData.name} at ${formData.phone} to confirm.`)

    orderForm.reset()
  })
}

// Product selection via event delegation
const menuContainerEl = document.getElementById("menu-container")

if (menuContainerEl) {
  menuContainerEl.addEventListener("click", (e) => {
    console.log("Container clicked")
    const product = e.target.closest(".product")

    if (product) {
      document.querySelectorAll(".product").forEach(p => {
        p.classList.remove("product--selected")
      })

      product.classList.add("product--selected")
      console.log("Classes after add:", product.classList.toString())
      console.log("Still in DOM:", document.contains(product))

      const productName = product.querySelector("h4").textContent
      // ... resto del código
    }
  })
}

// Close selection with Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.querySelectorAll(".product").forEach(p => {
      p.classList.remove("product--selected")
    })

    const select = document.getElementById("item")
    if (select) {
      select.value = ""
      select.style.color = "#aaaaaa"
    }
  }
})

// Hamburger menu
const menuToggle = document.getElementById("menu-toggle")
const navMenu = document.querySelector("nav")

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("nav--open")
  })
}

// Close menu when a nav link is clicked
navMenu.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("nav--open")
  })
})