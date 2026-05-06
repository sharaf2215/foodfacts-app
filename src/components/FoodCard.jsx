function FoodCard({ product }) {
  const { product_name, product_name_en, generic_name, brands, nutriments, image_small_url } = product
  const displayName = product_name || product_name_en || generic_name || 'Unknown Product'

  return (
    <div className="food-card">
      {image_small_url ? <img src={image_small_url} alt={displayName} /> : <div>No Image Provided</div>}
      <h2>{displayName}</h2>
      {brands && <h3>{brands}</h3>}
      <div className="nutrients">
        <p>Calories: {nutriments?.['energy-kcal_100g'] || 'N/A'} kcal</p>
        <p>Protein: {nutriments?.proteins_100g || 'N/A'} g</p>
        <p>Carbohydrates: {nutriments?.carbohydrates_100g || 'N/A'} g</p>
        <p>Fat: {nutriments?.fat_100g || 'N/A'} g</p>
      </div>
    </div>
  )
}

export default FoodCard
