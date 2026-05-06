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

  const getLocationLabel = () => {
    switch (event.locationType) {
      case 'online':
        return 'Online'
      case 'in_person':
        return 'In person'
      case 'hybrid':
        return 'Hybrid'
      default:
        return 'Location'
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
      {event.featured && <div className="featured-badge">Featured</div>}

      <h3 className="event-title">{event.title}</h3>

      <div className="event-core-info">
        <div className="event-date">
          {formatDate(event.startDate)}
          {formatTime(event.startDate) && <span>{formatTime(event.startDate)}</span>}
        </div>
        <div className="event-location">
          <span>{getLocationLabel()}</span>
          {event.locationText}
        </div>
      </div>

      {event.description && (
        <p className="event-description">
          {event.description.substring(0, 120)}
          {event.description.length > 120 ? '…' : ''}
        </p>
      )}

      {event.tags && event.tags.length > 0 && (
        <div className="event-tags">
          {event.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      )}

      <div className="event-actions">
        {event.url && (
          <a href={event.url} target="_blank" rel="noopener noreferrer" className="event-link">
            Learn more
          </a>
        )}
        <button onClick={addToCalendar} className="calendar-button" title="Add to calendar">
          Add to Calendar
        </button>
      </div>
    </div>
  )
}

export default EventCard
