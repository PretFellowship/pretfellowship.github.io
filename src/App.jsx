import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import EventListView from './views/EventListView'
import CalendarView from './views/CalendarView'
import MapView from './views/MapView'
import SuggestEventForm from './components/SuggestEventForm'
import './App.css'

function App() {
  const [activeView, setActiveView] = useState('list')
  const [isSuggestOpen, setIsSuggestOpen] = useState(false)
  const [filters, setFilters] = useState({
    locationType: 'all',
    tags: [],
    startDate: null,
    endDate: null,
    searchText: '',
  })

  // Fetch events data
  const { data: events = [], isLoading, error } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const res = await fetch('/data/events.json')
      if (!res.ok) throw new Error('Failed to load events')
      return res.json()
    },
  })

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const filteredEvents = events.filter(event => {
    // Location type filter
    if (filters.locationType !== 'all' && event.locationType !== filters.locationType) {
      return false
    }

    // Tags filter
    if (filters.tags.length > 0) {
      const hasTag = filters.tags.some(tag => event.tags.includes(tag))
      if (!hasTag) return false
    }

    // Date range filter
    if (filters.startDate || filters.endDate) {
      if (!event.startDate) return false // exclude events with no date if date filters are applied
      const eventStart = new Date(event.startDate)
      if (isNaN(eventStart.getTime())) return false // invalid date
      if (filters.startDate && eventStart < new Date(filters.startDate)) return false
      if (filters.endDate && eventStart > new Date(filters.endDate)) return false
    }

    // Search filter
    if (filters.searchText) {
      const searchLower = filters.searchText.toLowerCase()
      const matchesSearch =
        event.title.toLowerCase().includes(searchLower) ||
        (event.description && event.description.toLowerCase().includes(searchLower)) ||
        event.tags.some(tag => tag.toLowerCase().includes(searchLower))
      if (!matchesSearch) return false
    }

    return true
  })

  if (error) {
    return (
      <div className="error-container">
        <h1>Error Loading Events</h1>
        <p>{error.message}</p>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>Preterist Events</h1>
          <p className="subtitle">Full Preterist Eschatology Community Gatherings</p>
        </div>
      </header>

      <nav className="view-switcher">
        <button
          className={`view-btn ${activeView === 'list' ? 'active' : ''}`}
          onClick={() => setActiveView('list')}
        >
          📋 List View
        </button>
        <button
          className={`view-btn ${activeView === 'calendar' ? 'active' : ''}`}
          onClick={() => setActiveView('calendar')}
        >
          📅 Calendar
        </button>
        <button
          className={`view-btn ${activeView === 'map' ? 'active' : ''}`}
          onClick={() => setActiveView('map')}
        >
          🗺️ Map
        </button>
        <button className="suggest-btn" onClick={() => setIsSuggestOpen(true)}>
          ✉️ Suggest Event
        </button>
      </nav>

      <main className="main-content">
        {isLoading ? (
          <div className="loading">Loading events...</div>
        ) : (
          <>
            {activeView === 'list' && (
              <EventListView
                events={filteredEvents}
                allTags={Array.from(new Set(events.flatMap(e => e.tags)))}
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            )}
            {activeView === 'calendar' && (
              <CalendarView events={filteredEvents} />
            )}
            {activeView === 'map' && (
              <MapView events={filteredEvents.filter(e => e.latitude && e.longitude)} />
            )}
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>
          Events for the Full Preterist Community | 
          <a href="https://github.com/pretfellowship/pretfellowship.github.io" target="_blank" rel="noopener noreferrer">
            {' '}View on GitHub
          </a>
        </p>
      </footer>

      {isSuggestOpen && <SuggestEventForm onClose={() => setIsSuggestOpen(false)} />}
    </div>
  )
}

export default App
