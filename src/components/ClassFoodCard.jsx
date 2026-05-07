import React from 'react'

class ClassFoodCard extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { food } = this.props
    if (!food) return null
    
    const { product_name, product_name_en, generic_name, brands, image_small_url } = food
    const displayName = product_name || product_name_en || generic_name || 'Unknown Product'

    return (
      <div style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px', marginBottom: '16px', display: 'flex', gap: '16px', alignItems: 'center' }}>
        {image_small_url && (
            <img 
                src={image_small_url} 
                alt={displayName} 
                style={{ width: '80px', height: '80px', objectFit: 'contain' }}
            />
        )}
        <div>
            <h3 style={{ margin: '0 0 8px 0' }}>{displayName}</h3>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>{brands || 'Unknown Brand'}</p>
        </div>
      </div>
    )
  }
}

export default ClassFoodCard