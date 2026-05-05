import { useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import './CalendarView.css'

function CalendarView({ events }) {
  useEffect(() => {
    // Load FullCalendar styles via CDN
    if (!document.querySelector('link[href*="fullcalendar"]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://cdn.jsdelivr.net/npm/fullcalendar@6.1.10/index.global.min.css'
      document.head.appendChild(link)
    }
  }, [])

  const calendarEvents = events
    .filter((event) => event.startDate) // only include events with startDate
    .map((event) => ({
      id: event.id,
      title: event.title,
      start: event.startDate,
      end: event.endDate || event.startDate,
      extendedProps: {
        locationType: event.locationType,
        locationText: event.locationText,
        url: event.url,
        tags: event.tags,
      },
    }))

  const handleEventClick = (info) => {
    const { url } = info.event.extendedProps
    if (url) {
      window.open(url, '_blank')
    }
  }

  return (
    <div className="calendar-view">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek',
        }}
        events={calendarEvents}
        eventClick={handleEventClick}
        height="auto"
      />
    </div>
  )
}

export default CalendarView
