// cart.js
// Pure functions to manage the order.
// A cart is an array of lines: { value: "smash", quantity: 2 }
// Names and prices are NOT stored here: they are looked up in menuItems.

const roundToCents = (amount) => Math.round(amount * 100) / 100

// Adds one unit of a product. If it is already in the cart, increases its quantity
export const addToCart = (cart, value) => {
  const exists = cart.some(line => line.value === value)

  if (!exists) return [...cart, { value, quantity: 1 }]

  return cart.map(line =>
    line.value === value ? { ...line, quantity: line.quantity + 1 } : line
  )
}

// Changes a line's quantity by `delta` (+1 or -1). Removes the line if it reaches 0
export const changeQuantity = (cart, value, delta) =>
  cart
    .map(line =>
      line.value === value ? { ...line, quantity: line.quantity + delta } : line
    )
    .filter(line => line.quantity > 0)

// Removes a product from the cart completely
export const removeFromCart = (cart, value) =>
  cart.filter(line => line.value !== value)

// Total price of the cart, looking up each price in the menu
export const getCartTotal = (cart, menuItems) => {
  const total = cart.reduce((acc, line) => {
    const product = menuItems.find(item => item.value === line.value)
    return product ? acc + product.price * line.quantity : acc
  }, 0)

  return roundToCents(total)
}

const MAX_QUANTITY = 99

// Cleans untrusted data (e.g. from localStorage) and returns a valid cart.
// Keeps only lines that point to a real menu product with a whole quantity > 0
export const sanitizeCart = (raw, menuItems) => {
  if (!Array.isArray(raw)) return []

  return raw
    .filter(line =>
      line !== null &&
      typeof line === "object" &&
      menuItems.some(item => item.value === line.value) &&
      Number.isInteger(line.quantity) &&
      line.quantity > 0
    )
    .map(line => ({
      value: line.value,
      quantity: Math.min(line.quantity, MAX_QUANTITY)
    }))
}