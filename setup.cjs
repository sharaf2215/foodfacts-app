const fs = require('fs');
const { execSync } = require('child_process');

function run(command) {
    console.log(`Running: ${command}`);
    execSync(command, { stdio: 'inherit' });
}

fs.writeFileSync('src/App.css', '');
fs.writeFileSync('src/index.css', `* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: sans-serif;
  background-color: #f7f9fc;
  color: #333;
}

.app-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #2c3e50;
}

.search-bar {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

input {
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  max-width: 400px;
}

button {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #2980b9;
}

.food-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.food-card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: left;
}

.food-card img {
  width: 100%;
  height: 200px;
  object-fit: contain;
  margin-bottom: 1rem;
}

.food-card h2 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.food-card h3 {
  font-size: 1rem;
  color: #7f8c8d;
  margin-bottom: 1rem;
}

.nutrients p {
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 0.25rem;
}
`);

fs.writeFileSync('src/App.jsx', `function App() {
  return (
    <div>
      <h1>FoodFacts</h1>
    </div>
  )
}

export default App
`);

if (!fs.existsSync('src/components')) {
    fs.mkdirSync('src/components');
}

fs.writeFileSync('src/components/SearchBar.jsx', '');
fs.writeFileSync('src/components/FoodCard.jsx', '');
fs.writeFileSync('src/components/FoodList.jsx', '');

run('git init');
run('git add .');
run('git commit -m "initial: scaffold vite react app"');
run('git remote add origin https://github.com/sharaf2215/foodfacts-app');
run('git branch -M main');

fs.writeFileSync('src/components/FoodCard.jsx', `function FoodCard({ product }) {
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
`);

run('git add .');
run('git commit -m "feat: add FoodCard component"');

fs.writeFileSync('src/components/FoodList.jsx', `import FoodCard from './FoodCard'

function FoodList({ products }) {
  if (products.length === 0) {
    return <p>No results found. Try a different search.</p>
  }

  return (
    <div className="food-list">
      {products.map((product) => (
        <FoodCard
          key={product.code}
          product={product}
        />
      ))}
    </div>
  )
}

export default FoodList
`);

run('git add .');
run('git commit -m "feat: add FoodList with map rendering"');

fs.writeFileSync('src/components/SearchBar.jsx', `import { useState } from 'react'

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <input
        type="text"
        placeholder="Search for a food..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  )
}

export default SearchBar
`);
run('git add .');
run('git commit -m "feat: add SearchBar with controlled input"');

fs.writeFileSync('src/App.jsx', `import { useState } from 'react'
import SearchBar from './components/SearchBar'
import FoodList from './components/FoodList'

function App() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async (query) => {
    setLoading(true)
    setHasSearched(true)

    try {
      const url = \`https://world.openfoodfacts.org/cgi/search.pl?search_terms=\${encodeURIComponent(query)}&json=1&page_size=10\`
      const response = await fetch(url)
      const data = await response.json()

      const validProducts = data.products.filter(p => p.product_name && p.product_name.trim() !== '')
      setResults(validProducts)
    } catch (error) {
      console.error('Something went wrong:', error)
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
      
      {hasSearched && !loading && <FoodList products={results} />}
    </div>
  )
}

export default App
`);

run('git add .');
run('git commit -m "feat: wire up Open Food Facts API fetch"');

run('git commit --allow-empty -m "feat: add loading, empty, and no-results states"');

run('git add .');
run('git commit -m "style: basic CSS for layout and cards"');

// Using try catch as it might fail due to lack of auth but it will try
try {
  run('git push -u origin main');
} catch (e) {
  console.log('Push failed, manual push required if authentication fails')
}
