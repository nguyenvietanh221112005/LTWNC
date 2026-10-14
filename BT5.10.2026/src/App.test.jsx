import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import { fetchProducts } from './productsApi.js'

jest.mock('./productsApi.js')

afterEach(() => {
  jest.clearAllMocks()
})

const catalog = [
  {
    id: 1,
    name: 'Canvas bag',
    category: 'Sports',
    price: 40,
    stock: 12,
    rating: '4.5',
    description: 'A sturdy canvas bag',
  },
  {
    id: 2,
    name: 'Desk lamp',
    category: 'Home',
    price: 20,
    stock: 8,
    rating: '4.1',
    description: 'A warm desk lamp',
  },
  {
    id: 3,
    name: 'Cooking book',
    category: 'Books',
    price: 30,
    stock: 5,
    rating: '4.8',
    description: 'Recipes for every day',
  },
]

describe('App - integration tests', () => {
  it('IT01 - hiển thị trạng thái loading khi API đang pending', () => {
    fetchProducts.mockReturnValue(new Promise(() => {}))

    render(<App />)

    expect(screen.getByRole('status')).toHaveTextContent('Loading products...')
  })

  it('IT02 - tải và hiển thị danh sách sản phẩm thành công từ mock API', async () => {
    fetchProducts.mockResolvedValue(catalog)

    render(<App />)

    expect(await screen.findByText('Canvas bag')).toBeInTheDocument()
    expect(fetchProducts).toHaveBeenCalledTimes(1)
  })

  it('IT03 - hiển thị thông báo lỗi khi API thất bại', async () => {
    fetchProducts.mockRejectedValue(new Error('Service unavailable'))

    render(<App />)

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent('Service unavailable')
  })

  it('IT04 - lọc tức thì sản phẩm khi người dùng gõ từ khóa tìm kiếm', async () => {
    const user = userEvent.setup()
    fetchProducts.mockResolvedValue(catalog)
    render(<App />)
    await screen.findByText('Canvas bag')

    await user.type(screen.getByPlaceholderText('Search products...'), 'lamp')

    expect(screen.getByText('Desk lamp')).toBeInTheDocument()
    expect(screen.queryByText('Canvas bag')).not.toBeInTheDocument()
    expect(screen.getByText('Displaying 1 products')).toBeInTheDocument()
  })

  it('IT05 - chỉ hiển thị sản phẩm thuộc danh mục được chọn trong dropdown', async () => {
    const user = userEvent.setup()
    fetchProducts.mockResolvedValue(catalog)
    render(<App />)
    await screen.findByText('Canvas bag')

    await user.selectOptions(screen.getByLabelText('Category'), 'Books')

    expect(screen.getByText('Cooking book')).toBeInTheDocument()
    expect(screen.queryByText('Canvas bag')).not.toBeInTheDocument()
    expect(screen.queryByText('Desk lamp')).not.toBeInTheDocument()
  })

  it('IT06 - cập nhật thứ tự sản phẩm trên DOM theo giá khi đổi tùy chọn sắp xếp', async () => {
    const user = userEvent.setup()
    fetchProducts.mockResolvedValue(catalog)
    render(<App />)
    await screen.findByText('Canvas bag')

    await user.selectOptions(screen.getByLabelText('Sort by'), 'price')

    const names = screen.getAllByRole('heading', { level: 3 }).map((el) => el.textContent)
    expect(names).toEqual(['Desk lamp', 'Cooking book', 'Canvas bag'])
  })

  it('IT07 - xem chi tiết sản phẩm qua modal và đóng modal bằng nút Close', async () => {
    const user = userEvent.setup()
    fetchProducts.mockResolvedValue(catalog)
    render(<App />)
    await screen.findByText('Canvas bag')

    await user.click(screen.getByText('Canvas bag'))
    expect(screen.getByText('A sturdy canvas bag')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Close' }))
    expect(screen.queryByText('A sturdy canvas bag')).not.toBeInTheDocument()
  })

  it('IT08 - hiển thị thông báo khi không tìm thấy sản phẩm nào khớp bộ lọc', async () => {
    const user = userEvent.setup()
    fetchProducts.mockResolvedValue(catalog)
    render(<App />)
    await screen.findByText('Canvas bag')

    await user.type(screen.getByPlaceholderText('Search products...'), 'not found')

    expect(screen.getByText('No products found.')).toBeInTheDocument()
  })
})
