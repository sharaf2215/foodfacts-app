function FoodCard({ product }) {
  const { product_name, brands, nutriments, image_small_url } = product

  return (
    <div className="food-card">
      {image_small_url ? <img src={image_small_url} alt={product_name} /> : <div>No Image Provided</div>}
      {product_name ? <h2>{product_name}</h2> : <h2>Unknown Product</h2>}
      {brands && <h3>{brands}</h3>}
      <div className="nutrients">
        <p>Calories: {nutriments?.['energy-kcal_100g']} kcal</p>
        <p>Protein: {nutriments?.proteins_100g} g</p>
        <p>Carbohydrates: {nutriments?.carbohydrates_100g} g</p>
        <p>Fat: {nutriments?.fat_100g} g</p>
      </div>
    </div>
  )
}

export default FoodCard
