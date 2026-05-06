import { useEffect, useRef } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import EventCard from '../components/EventCard'
import './CalendarView.css'

function CalendarView({ events }) {
  const calendarRef = useRef(null)

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

  const handlePrintCalendar = () => {
    const calendarApi = calendarRef.current?.getApi()
    if (!calendarApi) return

    const printWindow = window.open('', '_blank', 'width=1100,height=800')
    if (!printWindow) return

    const view = calendarApi.view
    const rangeStart = new Date(view.activeStart)
    const rangeEnd = new Date(view.activeEnd)
    const title = view.title
    const dayFormatter = new Intl.DateTimeFormat('en-US', { weekday: 'short' })
    const monthDayFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' })
    const timeFormatter = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' })
    const dateKey = (date) => {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }
    const escapeHtml = (value = '') =>
      String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')

    const days = []
    for (const date = new Date(rangeStart); date < rangeEnd; date.setDate(date.getDate() + 1)) {
      days.push(new Date(date))
    }

    const eventEntries = events
      .filter((event) => event.startDate)
      .map((event) => {
        const start = new Date(event.startDate)
        const end = event.endDate ? new Date(event.endDate) : start
        return {
          ...event,
          start,
          end: end < start ? start : end,
        }
      })

    const rows = []
    for (let index = 0; index < days.length; index += 7) {
      rows.push(days.slice(index, index + 7))
    }

    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>Pret Fellowship Event Calendar</title>
          <style>
            * { box-sizing: border-box; }
            body {
              margin: 0;
              padding: 24px;
              color: #111827;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              background: #ffffff;
            }
            header {
              align-items: end;
              border-bottom: 1px solid #d1d5db;
              display: flex;
              justify-content: space-between;
              gap: 16px;
              margin-bottom: 18px;
              padding-bottom: 12px;
            }
            h1 {
              margin: 0;
              font-size: 20px;
              line-height: 1.2;
            }
            p {
              margin: 6px 0 0;
              color: #4b5563;
              font-size: 13px;
            }
            .range-title {
              font-size: 18px;
              font-weight: 700;
              margin-bottom: 12px;
            }
            table {
              border-collapse: collapse;
              table-layout: fixed;
              width: 100%;
            }
            th {
              background: #f8fafc;
              border: 1px solid #cbd5e1;
              color: #206c66;
              font-size: 12px;
              padding: 7px 6px;
              text-align: left;
            }
            td {
              border: 1px solid #cbd5e1;
              height: 112px;
              padding: 6px;
              vertical-align: top;
            }
            .date-number {
              color: #111827;
              font-size: 12px;
              font-weight: 700;
              margin: 0;
            }
            .muted-day .date-number {
              color: #9ca3af;
            }
            .event {
              background: #f3f4f6;
              border-left: 3px solid #8fb7b1;
              color: #111827;
              font-size: 10.5px;
              line-height: 1.3;
              margin-top: 5px;
              padding: 4px 5px;
            }
            .event-time {
              color: #4b5563;
              font-weight: 700;
              margin-right: 3px;
            }
            .event-title {
              font-weight: 600;
            }
            @page {
              margin: 0.45in;
            }
          </style>
        </head>
        <body>
          <header>
            <div>
              <h1>Pret Fellowship Event Calendar</h1>
              <p>${events.length} event${events.length === 1 ? '' : 's'}</p>
            </div>
            <p>${new Date().toLocaleDateString('en-US')}</p>
          </header>
          <div class="range-title">${escapeHtml(title)}</div>
          <table>
            <thead>
              <tr>
                ${days.slice(0, 7).map((day) => `<th>${dayFormatter.format(day)}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${rows.map((week) => `
                <tr>
                  ${week.map((day) => {
                    const dayEvents = eventEntries.filter((event) => {
                      const key = dateKey(day)
                      return dateKey(event.start) <= key && dateKey(event.end) >= key
                    })
                    return `
                      <td class="${day.getMonth() !== calendarApi.getDate().getMonth() ? 'muted-day' : ''}">
                        <div class="date-number">${monthDayFormatter.format(day)}</div>
                        ${dayEvents.map((event) => `
                          <div class="event">
                            <span class="event-time">${escapeHtml(timeFormatter.format(event.start))}</span>
                            <span class="event-title">${escapeHtml(event.title)}</span>
                          </div>
                        `).join('')}
                      </td>
                    `
                  }).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.addEventListener('load', () => {
      printWindow.focus()
      printWindow.print()
      printWindow.close()
    })
  }

  const datedEvents = events
    .filter((event) => event.startDate)
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))

  return (
    <div className="calendar-view">
      <div className="calendar-panel">
        <div className="calendar-print-bar">
          <p>Print-friendly calendar view</p>
          <button type="button" className="calendar-print-button" onClick={handlePrintCalendar}>
            Print
          </button>
        </div>
        <FullCalendar
          ref={calendarRef}
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
      <aside className="calendar-events" aria-label="Calendar events">
        {datedEvents.length > 0 ? (
          datedEvents.slice(0, 4).map((event) => (
            <EventCard key={event.id} event={event} />
          ))
        ) : (
          <div className="calendar-empty">No dated events match your filters.</div>
        )}
      </aside>
    </div>
  )
}

export default CalendarView
