import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import EventListView from './views/EventListView'
import CalendarView from './views/CalendarView'
import MapView from './views/MapView'
import FilterPanel from './components/FilterPanel'
import './App.css'

const views = [
  { id: 'list', label: 'List' },
  { id: 'calendar', label: 'Calendar' },
  { id: 'map', label: 'Map' },
]

function App() {
  const [activeView, setActiveView] = useState('list')
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
      const hasTag = filters.tags.some(tag => (event.tags || []).includes(tag))
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
        (event.locationText && event.locationText.toLowerCase().includes(searchLower)) ||
        (event.tags || []).some(tag => tag.toLowerCase().includes(searchLower))
      if (!matchesSearch) return false
    }

    return true
  })

  const allTags = Array.from(new Set(events.flatMap(e => e.tags || []))).sort()
  const visibleMapEvents = filteredEvents.filter(e => e.latitude && e.longitude)
  const activeViewLabel = views.find(view => view.id === activeView)?.label || 'Events'

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
          <h1>Full Preterist Fellowship</h1>
          <p className="subtitle">Events, gatherings, and resources for “the things that must soon take place.” (Rev. 1:1)</p>
        </div>
      </header>

      <nav className="view-switcher" aria-label="Event views">
        <div className="view-tabs" role="tablist" aria-label="Choose event view">
          {views.map((view) => (
            <button
              key={view.id}
              role="tab"
              aria-selected={activeView === view.id}
              className={`view-btn ${activeView === view.id ? 'active' : ''}`}
              onClick={() => setActiveView(view.id)}
            >
              {view.label}
            </button>
          ))}
        </div>
        <button 
          className="suggest-btn" 
          onClick={() => window.open('https://github.com/PretFellowship/pretfellowship.github.io/issues', '_blank')}
        >
          Suggest Event
        </button>
      </nav>

      <main className="main-content">
        {isLoading ? (
          <div className="loading">Loading events...</div>
        ) : (
          <section className="event-hub" aria-label={`${activeViewLabel} event view`}>
            <div className="hub-toolbar">
              <div>
                <p className="eyebrow">{activeViewLabel} view</p>
                <h2>Events</h2>
              </div>
              <p className="event-count">
                {filteredEvents.length} of {events.length} events
              </p>
            </div>

            <FilterPanel
              filters={filters}
              allTags={allTags}
              onFilterChange={handleFilterChange}
            />

            {activeView === 'list' && (
              <EventListView
                events={filteredEvents}
              />
            )}
            {activeView === 'calendar' && (
              <CalendarView events={filteredEvents} />
            )}
            {activeView === 'map' && (
              <MapView events={visibleMapEvents} />
            )}
          </section>
        )}
      </main>

      <footer className="app-footer">
        <p>
          Events for the Full Preterist community | 
          <a href="https://github.com/pretfellowship/pretfellowship.github.io" target="_blank" rel="noopener noreferrer">
            {' '}View on GitHub
          </a>
        </p>
      </footer>
    </div>
  )
}

export default App
