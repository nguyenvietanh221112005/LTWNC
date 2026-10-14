const API_URL = '/api/products'

export async function fetchProducts() {
  const response = await fetch(API_URL)
  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.status}`)
  }
  return response.json()
}
