import './EventCard.css'

function EventCard({ event }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'No date'
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'No date'
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatTime = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return ''
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  }

  const getLocationIcon = () => {
    switch (event.locationType) {
      case 'online':
        return '🌐'
      case 'in_person':
        return '📍'
      case 'hybrid':
        return '🔗'
      default:
        return '📍'
    }
  }

  return (
    <div className={`event-card ${event.featured ? 'featured' : ''}`}>
      {event.featured && <div className="featured-badge">⭐ Featured</div>}

      <div className="event-header">
        <h3 className="event-title">{event.title}</h3>
      </div>

      <div className="event-meta">
        <div className="meta-item">
          <span className="meta-label">Date</span>
          <span className="meta-value">{formatDate(event.startDate)}</span>
        </div>
        {event.endDate && event.startDate !== event.endDate && (
          <div className="meta-item">
            <span className="meta-label">Ends</span>
            <span className="meta-value">{formatDate(event.endDate)}</span>
          </div>
        )}
      </div>

      <div className="event-time">
        <span>⏰ {formatTime(event.startDate)}</span>
      </div>

      <div className="event-location">
        <span>{getLocationIcon()} {event.locationText}</span>
      </div>

      {event.description && (
        <div className="event-description">
          {event.description.substring(0, 150)}
          {event.description.length > 150 ? '...' : ''}
        </div>
      )}

      {event.tags && event.tags.length > 0 && (
        <div className="event-tags">
          {event.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
      )}

      {event.url && (
        <a href={event.url} target="_blank" rel="noopener noreferrer" className="event-link">
          View Event →
        </a>
      )}
    </div>
  )
}

export default EventCard
