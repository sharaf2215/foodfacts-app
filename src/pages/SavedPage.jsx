import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { removeItem } from '../store/savedSlice'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'

function SavedPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const savedItems = useSelector(state => state.saved.items)

  if (savedItems.length === 0) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom fontWeight={800}>
          Saved Items
        </Typography>
        <Typography color="text.secondary">
          You haven't saved anything yet. Search for a food and save it from the detail page.
        </Typography>
        <Button variant="contained" onClick={() => navigate('/')} sx={{ mt: 3 }}>
            Search Foods
        </Button>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight={800}>
        Saved Items ({savedItems.length})
      </Typography>
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {savedItems.map((product) => {
          const { product_name, product_name_en, generic_name, brands, image_small_url, code } = product
          const displayName = product_name || product_name_en || generic_name || 'Unknown Product'
          
          return (
            <Grid item xs={12} sm={6} md={4} key={code}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    {image_small_url && (
                        <CardMedia
                            component="img"
                            height="140"
                            image={image_small_url}
                            alt={displayName}
                            sx={{ objectFit: 'contain', p: 1 }}
                        />
                    )}
                    <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" gutterBottom>
                            {displayName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {brands || 'Unknown Brand'}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small" onClick={() => navigate(`/product/${code}`)}>
                            View Details
                        </Button>
                        <Button size="small" color="error" onClick={() => dispatch(removeItem(code))}>
                            Remove
                        </Button>
                    </CardActions>
                </Card>
            </Grid>
          )
        })}
      </Grid>
    </Container>
  )
}

export default SavedPage
