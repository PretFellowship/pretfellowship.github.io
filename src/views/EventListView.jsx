import { useState } from 'react'
import EventCard from '../components/EventCard'
import './EventListView.css'

function EventListView({ events }) {
  const [sortBy, setSortBy] = useState('date-asc')

  const sortedEvents = [...events].sort((a, b) => {
    switch (sortBy) {
      case 'date-asc':
        if (!a.startDate && !b.startDate) return 0
        if (!a.startDate) return 1 // null dates at end
        if (!b.startDate) return -1
        return new Date(a.startDate) - new Date(b.startDate)
      case 'date-desc':
        if (!a.startDate && !b.startDate) return 0
        if (!a.startDate) return 1 // null dates at end
        if (!b.startDate) return -1
        return new Date(b.startDate) - new Date(a.startDate)
      case 'title':
        return a.title.localeCompare(b.title)
      case 'featured':
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
      default:
        return 0
    }
  })

  return (
    <div className="event-list-view">
      <div className="list-header">
        <p className="list-summary">Scan upcoming events as cards, sorted by what matters right now.</p>
        <div className="sort-controls">
          <label htmlFor="sort-select">Sort by:</label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date-asc">Date (Earliest First)</option>
            <option value="date-desc">Date (Latest First)</option>
            <option value="title">Title (A-Z)</option>
            <option value="featured">Featured First</option>
          </select>
        </div>
      </div>

      <div className="events-grid">
        {sortedEvents.length > 0 ? (
          sortedEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))
        ) : (
          <div className="no-events">
            <p>No events match your filters.</p>
            <span>Try a broader search or clear the optional filters.</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default EventListView
