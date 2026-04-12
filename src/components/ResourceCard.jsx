import './ResourceCard.css'

const typeIcons = {
  PDF: '📄',
  Document: '📝',
  Video: '🎥',
  Download: '⬇️',
  Spreadsheet: '📊',
  Article: '📰'
}

function ResourceCard({ resource }) {
  return (
    <a href={resource.url} className="resource-card" target="_blank" rel="noopener noreferrer">
      <div className="card-header">
        <span className="type-badge">{typeIcons[resource.type] || '📦'} {resource.type}</span>
        <span className="category-badge">{resource.category}</span>
      </div>
      
      <h3 className="card-title">{resource.title}</h3>
      <p className="card-description">{resource.description}</p>
      
      <div className="card-footer">
        <div className="tags">
          {resource.tags.slice(0, 2).map(tag => (
            <span key={tag} className="tag">#{tag}</span>
          ))}
        </div>
        <div className="arrow">→</div>
      </div>
    </a>
  )
}

export default ResourceCard
