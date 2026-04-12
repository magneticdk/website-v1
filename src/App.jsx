import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import CategoryFilter from './components/CategoryFilter'
import ResourceGrid from './components/ResourceGrid'
import Footer from './components/Footer'
import { resources, categories } from './data/resources'

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'All' || resource.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <div className="container">
          <div className="hero-section">
            <h1>Resource Toolkit</h1>
            <p>Your comprehensive collection of guides, templates, and resources</p>
          </div>
          
          <SearchBar 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
          />
          
          <CategoryFilter 
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
          
          <ResourceGrid resources={filteredResources} />
          
          {filteredResources.length === 0 && (
            <div className="no-results">
              <p>No resources found. Try adjusting your search or filter.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default App
