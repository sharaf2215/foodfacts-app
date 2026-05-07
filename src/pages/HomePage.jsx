import SearchBar from '../components/SearchBar'
import FoodList from '../components/FoodList'
import useFoodSearch from '../hooks/useFoodSearch'
import ErrorMessage from '../components/ErrorMessage'

function HomePage() {
  const { results, loading, error, hasSearched, searchFood } = useFoodSearch()

  return (
    <div className="page">
      <h2>Search Nutrition Info</h2>
      <SearchBar onSearch={searchFood} />
      
      {!loading && !hasSearched && (
        <p>Search for a food above to see its nutrition info.</p>
      )}

      {loading && <p>Loading...</p>}
      
      {error && !loading && (
        <ErrorMessage message={error} />
      )}
      
      {hasSearched && !loading && !error && <FoodList products={results} />}
    </div>
  )
}

export default HomePage
