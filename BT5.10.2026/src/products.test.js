import { generateProducts, filterAndSortProducts } from './products'

describe('generateProducts', () => {
  it('UT01 - sinh đúng 2 sản phẩm mẫu với đầy đủ cấu trúc', () => {
    const mockRandom = () => 0.5
    const result = generateProducts(2, mockRandom)

    expect(result).toHaveLength(2)
    expect(result[0]).toMatchObject({
      id: 1,
      name: 'Product 1',
      category: expect.any(String),
      price: expect.any(Number),
      stock: expect.any(Number),
      rating: expect.any(String),
      description: expect.any(String),
    })
    expect(result[1]).toMatchObject({ id: 2, name: 'Product 2' })
  })

  it('UT02 - trả về mảng rỗng khi yêu cầu sinh 0 sản phẩm', () => {
    expect(generateProducts(0)).toEqual([])
  })
})

describe('filterAndSortProducts', () => {
  it('UT03 - sắp xếp mặc định theo id tăng dần và không làm thay đổi mảng gốc', () => {
    const original = [
      { id: 3, name: 'Gamma', category: 'Books', price: 10, rating: '3.0' },
      { id: 1, name: 'Alpha', category: 'Books', price: 20, rating: '4.0' },
      { id: 2, name: 'Beta', category: 'Books', price: 15, rating: '3.5' },
    ]
    const snapshot = [...original]

    const result = filterAndSortProducts(original)

    expect(result.map((p) => p.id)).toEqual([1, 2, 3])
    expect(original).toEqual(snapshot)
  })

  const catalog = [
    { id: 1, name: 'Alpha shirt', category: 'Clothing', price: 20, rating: '4.9' },
    { id: 2, name: 'Beta book', category: 'Books', price: 10, rating: '3.5' },
    { id: 3, name: 'Zulu book', category: 'Books', price: 30, rating: '4.2' },
  ]

  it('UT04 - tìm kiếm theo từ khóa không phân biệt hoa thường', () => {
    const result = filterAndSortProducts(catalog, { searchTerm: 'ALPHA' })

    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Alpha shirt')
  })

  it('UT05 - lọc sản phẩm chính xác theo danh mục', () => {
    const result = filterAndSortProducts(catalog, { categoryFilter: 'Books' })

    expect(result.map((p) => p.name)).toEqual(['Beta book', 'Zulu book'])
  })

  it('UT06 - áp dụng đồng thời cả bộ lọc từ khóa và danh mục', () => {
    const result = filterAndSortProducts(catalog, { searchTerm: 'book', categoryFilter: 'Books' })

    expect(result.map((p) => p.name)).toEqual(['Beta book', 'Zulu book'])
  })

  it('UT07 - sắp xếp danh sách theo giá tăng dần', () => {
    const result = filterAndSortProducts(catalog, { sortBy: 'price' })

    expect(result.map((p) => p.name)).toEqual(['Beta book', 'Alpha shirt', 'Zulu book'])
  })

  it('UT08 - sắp xếp theo tên sản phẩm theo thứ tự chữ cái A-Z', () => {
    const result = filterAndSortProducts(catalog, { sortBy: 'name' })

    expect(result.map((p) => p.name)).toEqual(['Alpha shirt', 'Beta book', 'Zulu book'])
  })

  it('UT09 - sắp xếp theo điểm đánh giá giảm dần', () => {
    const result = filterAndSortProducts(catalog, { sortBy: 'rating' })

    expect(result.map((p) => p.name)).toEqual(['Alpha shirt', 'Zulu book', 'Beta book'])
  })

  it('UT10 - fallback về sắp xếp theo id khi gặp tham số sắp xếp không xác định', () => {
    const result = filterAndSortProducts(catalog, { sortBy: 'unknown' })

    expect(result.map((p) => p.id)).toEqual([1, 2, 3])
  })

  it('UT11 - trả về mảng rỗng khi không có sản phẩm nào thỏa mãn điều kiện lọc', () => {
    const result = filterAndSortProducts(catalog, { searchTerm: 'missing', categoryFilter: 'Books' })

    expect(result).toEqual([])
  })
})
