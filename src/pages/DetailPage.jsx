import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import ErrorMessage from '../components/ErrorMessage'
import { addItem, removeItem } from '../store/savedSlice'

import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd'
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CircularProgress from '@mui/material/CircularProgress'
import NutritionRow from '../components/NutritionRow'

function DetailPage() {
  const dispatch = useDispatch()
  const savedItems = useSelector(state => state.saved.items)

  const { barcode } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  
  // Initialize product from location state if available, otherwise it's null
  const [product, setProduct] = useState(location.state?.product || null)
  
  // If product already exists (from Link state), no need to show loading
  const [loading, setLoading] = useState(!product) 
  const [error, setError] = useState(null)

  useEffect(() => {
    // If product was passed in navigation state, skip fetching
    if (location.state?.product) {
        return;
    }

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
  }, [barcode, location.state])

  if (loading) {
    return (
        <Container sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
        </Container>
    )
  }
  if (error) return <Container sx={{ py: 4 }}><ErrorMessage message={error} /></Container>
  
  if (!product) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography>Product not found.</Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')}>Back to Search</Button>
      </Container>
    )
  }

  // Handle differences in API keys
  const { product_name, product_name_en, generic_name, brands, image_small_url, image_url, nutriments } = product
  const displayName = product_name || product_name_en || generic_name || 'Unknown Product'
  const displayImage = image_url || image_small_url
  
  // Check if item is saved
  const isSaved = savedItems.some(p => p.code === product.code)

  const handleSaveToggle = () => {
    if (isSaved) {
      dispatch(removeItem(product.code))
    } else {
      dispatch(addItem(product))
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Back
      </Button>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 3 }}>
          {displayImage && (
            <Box
              component="img"
              src={displayImage}
              alt={displayName}
              sx={{ width: 160, height: 160, objectFit: 'contain' }}
            />
          )}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              {displayName}
            </Typography>
            <Typography color="text.secondary" gutterBottom>
              {brands || 'Unknown Brand'}
            </Typography>
            <Button
              variant={isSaved ? 'outlined' : 'contained'}
              color={isSaved ? 'error' : 'primary'}
              startIcon={isSaved ? <BookmarkRemoveIcon /> : <BookmarkAddIcon />}
              onClick={handleSaveToggle}
              sx={{ mt: 1 }}
            >
              {isSaved ? 'Remove from Saved' : 'Save to My List'}
            </Button>
          </Box>
        </Box>

        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          Nutrition per 100g
        </Typography>

        <NutritionRow label="Calories" value={nutriments?.['energy-kcal_100g']} unit=" kcal" />
        <NutritionRow label="Protein" value={nutriments?.proteins_100g} unit=" g" />
        <NutritionRow label="Carbohydrates" value={nutriments?.carbohydrates_100g} unit=" g" />
        <NutritionRow label="Sugars" value={nutriments?.sugars_100g} unit=" g" />
        <NutritionRow label="Fat" value={nutriments?.fat_100g} unit=" g" />
        <NutritionRow label="Saturated Fat" value={nutriments?.['saturated-fat_100g']} unit=" g" />
        <NutritionRow label="Fibre" value={nutriments?.fiber_100g} unit=" g" />
        <NutritionRow label="Salt" value={nutriments?.salt_100g} unit=" g" />
      </Paper>
    </Container>
  )
}

export default DetailPage
