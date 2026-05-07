import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import ErrorMessage from '../components/ErrorMessage'

function DetailPage({ saved, dispatch }) {
  const { barcode } = useParams()
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `https://world.openfoodfacts.net/api/v0/product/${barcode}.json`
        )
        if (!cancelled) {
          if (response.data.status === 1) {
            setProduct(response.data.product)
          } else {
            setError('Product not found.')
          }
          setLoading(false)
        }
      } catch (err) {
        if (!cancelled) {
          setError('Could not load product details.')
          setLoading(false)
        }
      }
    }

    fetchProduct()

    return () => {
      cancelled = true
    }
  }, [barcode])

  if (loading) return <div className="page"><p>Loading product details...</p></div>
  if (error) return <div className="page"><ErrorMessage message={error} /></div>
  if (!product) return <div className="page"><p>Product not found.</p></div>

  const isSaved = saved.some(p => p.code === barcode)

  const handleSaveToggle = () => {
    if (isSaved) {
      dispatch({ type: 'REMOVE', code: barcode })
    } else {
      dispatch({ type: 'ADD', product: product })
    }
  }

  const { product_name, brands, nutriments, image_small_url } = product

  return (
    <div className="page detail-page">
      <button onClick={() => navigate(-1)}>← Back</button>

      <div className="detail-header">
        {image_small_url && <img src={image_small_url} alt={product_name} />}
        <h2>{product_name || 'Unknown Product'}</h2>
        <p>{brands || 'Unknown Brand'}</p>
      </div>

      <div className="nutrition-table">
        <h3>Nutrition per 100g</h3>
        <ul>
          <li><strong>Energy:</strong> {nutriments?.['energy-kcal_100g'] !== undefined ? `${nutriments['energy-kcal_100g']} kcal` : 'N/A'}</li>
          <li><strong>Fat:</strong> {nutriments?.fat_100g !== undefined ? `${nutriments.fat_100g} g` : 'N/A'}</li>
          <li><strong>Saturated Fat:</strong> {nutriments?.['saturated-fat_100g'] !== undefined ? `${nutriments['saturated-fat_100g']} g` : 'N/A'}</li>
          <li><strong>Carbohydrates:</strong> {nutriments?.carbohydrates_100g !== undefined ? `${nutriments.carbohydrates_100g} g` : 'N/A'}</li>
          <li><strong>Sugars:</strong> {nutriments?.sugars_100g !== undefined ? `${nutriments.sugars_100g} g` : 'N/A'}</li>
          <li><strong>Proteins:</strong> {nutriments?.proteins_100g !== undefined ? `${nutriments.proteins_100g} g` : 'N/A'}</li>
          <li><strong>Salt:</strong> {nutriments?.salt_100g !== undefined ? `${nutriments.salt_100g} g` : 'N/A'}</li>
        </ul>
      </div>

      <button onClick={handleSaveToggle}>
        {isSaved ? '★ Remove from Saved' : '☆ Save to My List'}
      </button>
    </div>
  )
}

export default DetailPage
