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

  const formatDateForICS = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return ''
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  }

  const addToCalendar = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Preterist Fellowship//Event Calendar//EN
BEGIN:VEVENT
UID:${event.id}@preteristfellowship.org
DTSTAMP:${formatDateForICS(new Date())}
DTSTART:${formatDateForICS(event.startDate)}
${event.endDate ? `DTEND:${formatDateForICS(event.endDate)}` : ''}
SUMMARY:${event.title.replace(/[,;]/g, '\\$&')}
DESCRIPTION:${(event.description || '').replace(/[,;]/g, '\\$&')}
LOCATION:${(event.locationText || '').replace(/[,;]/g, '\\$&')}
${event.url ? `URL:${event.url}` : ''}
END:VEVENT
END:VCALENDAR`

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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

      <button onClick={addToCalendar} className="calendar-button">
        📅
      </button>
    </div>
  )
}

export default EventCard
