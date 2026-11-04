import { saveData, getData } from "./storage.js"

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
  schedule: {
    weekday: { open: 11, close: 23 },
    weekend: { open: 11, close: 2 }   // closes next day at 2am
  }
}

// Schedule by day
const today = new Date().getDay()
// 0 = Sunday, 1 = Monday, 2 = Tuesday, 3 = Wednesday, 4 = Thursday, 5 = Friday, 6 = Saturday

// Current time
const currentTime = new Date().getHours()

// Menu Items
const menuItems = [
  { value: "classic", name: "Classic NOSH", price: 5.00, category: "burger", description: "Carne 200g, queso americano, lechuga, tomate y salsa de la casa." },
  { value: "smash", name: "Double Smash", price: 7.50, category: "burger", description: "Doble carne smash, doble queso, cebolla caramelizada y pepinillos." },
  { value: "street-dog", name: "Street Dog", price: 4.00, category: "hotdog", description: "Salchicha ahumada, mostaza, ketchup, cebolla y papas fritas (ralladas)." },
  { value: "bacon-dog", name: "Bacon Dog", price: 5.50, category: "hotdog", description: "Salchicha envuelta en bacon, queso derretido y jalapeños." },
  { value: "fries", name: "Papas NOSH", price: 2.50, category: "sides", description: "Papas fritas con aliño especial y salsa ranch." },
  { value: "soda", name: "Refresco", price: 1.50, category: "sides", description: "Coca-Cola, Nestea o agua. Vaso grande con hielo." }
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

// Returns business status for a given day and hour
const getBusinessStatus = (day, hour, schedule) => {
  const isWeekend = (d) => d === 0 || d === 6
  const hoursFor = (d) => (isWeekend(d) ? schedule.weekend : schedule.weekday)
  const crossesMidnight = ({ open, close }) => close < open

  const todayHours = hoursFor(day)
  const yesterdayHours = hoursFor((day + 6) % 7)

  const openFromToday =
    hour >= todayHours.open &&
    (crossesMidnight(todayHours) || hour < todayHours.close)
  const openFromYesterday =
    crossesMidnight(yesterdayHours) && hour < yesterdayHours.close

  const isCurrentlyOpen = openFromToday || openFromYesterday

  return {
    isOpen: isCurrentlyOpen,
    status: isCurrentlyOpen ? "Open now" : "Closed now"
  }
}

const businessStatus = getBusinessStatus(today, currentTime, business.schedule)

// Formats a number as price string
const formatPrice = (price) => `$${parseFloat(price).toFixed(2)}`

// Order summary
const orderSummary = (itemName, quantity) => {
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

// Returns product object from select option value
const getProductByValue = (value) =>
  menuItems.find(item => item.value === value)

// ========================
// API CALLS
// ========================

// Fetch food images from DummyJSON
const fetchMenuImages = async () => {
  const productImages = document.querySelectorAll(".product img")

  // Loading state
  productImages.forEach(img => {
    img.style.opacity = "0.3"
  })

  try {
    const response = await fetch("https://dummyjson.com/recipes?limit=6")

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`)
    }

    const data = await response.json()
    const images = data.recipes.map(recipe => recipe.image)

    // Success state
        // Success state
    productImages.forEach((img, index) => {
      if (!images[index]) {
        img.style.opacity = "1"
        return
      }

      img.onload = () => {
        img.style.transition = "opacity 0.3s ease"
        img.style.opacity = "1"
      }
      img.onerror = () => {
        img.style.opacity = "1"
      }
      img.src = images[index]
    })

  } catch (error) {
    console.error("Failed to fetch menu images:", error)

    // Error state
    productImages.forEach(img => {
      img.style.opacity = "1"
    })
  }
}

// ================
// DOM MANIPULATION
// ================

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
  statusElement.textContent = businessStatus.status
  statusElement.classList.add(businessStatus.isOpen ? "status--open" : "status--closed")
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
          ${products.map(({ value, name, price, description }) => `
            <article class="product" data-value="${value}">
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

  fetchMenuImages()
}

// Fill order select from menuItems
const itemSelect = document.getElementById("item")

if (itemSelect) {
  menuItems.forEach(({ value, name, price }) => {
    itemSelect.insertAdjacentHTML(
      "beforeend",
      `<option value="${value}">${name} - ${formatPrice(price)}</option>`
    )
  })
}

// Restore previously selected product
const savedValue = getData("selectedProduct")
const savedItem = menuItems.find(item => item.value === savedValue)

if (savedItem && itemSelect) {
  const card = document.querySelector(`.product[data-value="${savedItem.value}"]`)
  card?.classList.add("product--selected")
  itemSelect.value = savedItem.value
  itemSelect.style.color = "#333333"
} else if (savedValue) {
  removeData("selectedProduct")   // había un dato guardado, pero no es válido
}

// Highlight today's schedule in footer
const scheduleRows = document.querySelectorAll("footer tbody tr")
const isWeekday = today >= 1 && today <= 5

scheduleRows.forEach((row, index) => {
  if ((index === 0 && isWeekday) || (index === 1 && !isWeekday)) {
    row.classList.add("schedule--active")
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

    // save order
    const order = {
      customer: formData.name,
      phone: formData.phone,
      product: product.name,
      total: formattedTotal,
      notes: formData.notes,
      timestamp: new Date().toLocaleString()
    }

    saveData("lastOrder", order)

    alert(`Order received!\n${product.name} - ${formattedTotal}\n\nWe'll call ${formData.name} at ${formData.phone} to confirm.`)

    orderForm.reset()
    document.getElementById("item").style.color = ""
    document.querySelector(".product--selected")?.classList.remove("product--selected")
    removeData("selectedProduct")
    renderLastOrder()
  })
}

// Product selection via event delegation
const menuContainerEl = document.getElementById("menu-container")

if (menuContainerEl) {
  menuContainerEl.addEventListener("click", (e) => {
    const product = e.target.closest(".product")
    if (!product) return

    document.querySelectorAll(".product").forEach(p => {
      p.classList.remove("product--selected")
    })
    product.classList.add("product--selected")

    const select = document.getElementById("item")
    if (select) {
      select.value = product.dataset.value
      select.style.color = "#333333"
    }

    saveData("selectedProduct", product.dataset.value)
  })
}

// Clear selection with Escape key
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return

  const selected = document.querySelector(".product--selected")
  if (!selected) return

  selected.classList.remove("product--selected")

  const select = document.getElementById("item")
  if (select) {
    select.value = ""
    select.style.color = ""
  }

  removeData("selectedProduct")
})

// Hamburger menu
const menuToggle = document.getElementById("menu-toggle")
const navMenu = document.querySelector("nav")

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("nav--open")
  })

  // Close menu when a nav link is clicked
  navMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("nav--open")
    })
  })
}


// Show last order if exists
const renderLastOrder = () => {
  const lastOrder = getData("lastOrder")
  const heading = document.querySelector("#order h2")
  if (!lastOrder?.product || !lastOrder?.total || !heading) return

  document.querySelector(".last-order")?.remove()

  const box = document.createElement("div")
  box.className = "last-order"

  const summary = document.createElement("p")
  const strong = document.createElement("strong")
  strong.textContent = lastOrder.product
  summary.append("Your last order: ", strong, ` — ${lastOrder.total}`)

  const time = document.createElement("p")
  time.className = "last-order__time"
  time.textContent = `Ordered on ${lastOrder.timestamp}`

  box.append(summary, time)
  heading.after(box)
}

renderLastOrder()