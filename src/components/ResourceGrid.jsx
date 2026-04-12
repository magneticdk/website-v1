import ResourceCard from './ResourceCard'
import './ResourceGrid.css'

function ResourceGrid({ resources }) {
  return (
    <div className="resource-grid">
      {resources.map(resource => (
        <ResourceCard key={resource.id} resource={resource} />
      ))}
    </div>
  )
}

export default ResourceGrid
