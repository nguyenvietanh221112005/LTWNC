export const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Toys', 'Food', 'Beauty']

export function generateProducts(count = 10000, randomFn = Math.random) {
  const products = []
  for (let i = 1; i <= count; i++) {
    products.push({
      id: i,
      name: `Product ${i}`,
      category: CATEGORIES[i % CATEGORIES.length],
      price: Math.floor(randomFn() * 1000) + 10,
      stock: Math.floor(randomFn() * 100),
      rating: (randomFn() * 5).toFixed(1),
      description: `This is product number ${i} in our store`,
    })
  }
  return products
}

export function filterAndSortProducts(products, { searchTerm = '', categoryFilter = '', sortBy = 'id' } = {}) {
  let result = products

  if (searchTerm) {
    result = result.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
  }

  if (categoryFilter) {
    result = result.filter((p) => p.category === categoryFilter)
  }

  return [...result].sort((a, b) => {
    if (sortBy === 'price') return a.price - b.price
    if (sortBy === 'name') return a.name.localeCompare(b.name)
    if (sortBy === 'rating') return parseFloat(b.rating) - parseFloat(a.rating)
    return a.id - b.id
  })
}
