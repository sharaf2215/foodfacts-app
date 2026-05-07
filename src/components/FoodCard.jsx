import { useNavigate } from 'react-router-dom'

function FoodCard({ product }) {
  const navigate = useNavigate()
  const { product_name, product_name_en, generic_name, brands, nutriments, image_small_url, code } = product
  const displayName = product_name || product_name_en || generic_name || 'Unknown Product'

  const handleClick = () => {
    navigate(`/product/${code}`)
  }

  return (
    <div className="food-card" onClick={handleClick} style={{ cursor: 'pointer' }}>
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
