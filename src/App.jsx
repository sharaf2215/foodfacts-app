import { useState } from 'react'
import SearchBar from './components/SearchBar'
import FoodList from './components/FoodList'

function App() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleSearch = async (query) => {
    setLoading(true)
    setHasSearched(true)
    setErrorMsg('')
    setResults([])

    try {
      const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1`
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()

      const validProducts = (data.products || []).filter(p => (p.product_name || p.product_name_en || p.brands || p.generic_name))
      setResults(validProducts)
    } catch (error) {
      console.error('Something went wrong:', error)
      setErrorMsg(error.message || 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-container">
      <h1>🥗 FoodFacts</h1>
      <SearchBar onSearch={handleSearch} />
      
      {!loading && !hasSearched && (
        <p>Search for a food above to see its nutrition info.</p>
      )}

      {loading && <p>Loading...</p>}
      
      {errorMsg && !loading && (
        <p style={{color: 'red'}}>Error: {errorMsg}</p>
      )}
      
      {hasSearched && !loading && !errorMsg && <FoodList products={results} />}
    </div>
  )

}

export default App
