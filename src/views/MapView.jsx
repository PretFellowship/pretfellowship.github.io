import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import EventCard from '../components/EventCard'
import './MapView.css'

// Fix default marker icons for Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

function MapView({ events }) {
  if (events.length === 0) {
    return (
      <div className="map-view-empty">
        <p>No events with location data to display on the map.</p>
      </div>
    )
  }

  // Calculate center of all markers
  const centerLat =
    events.reduce((sum, e) => sum + (e.latitude || 0), 0) / events.length
  const centerLng =
    events.reduce((sum, e) => sum + (e.longitude || 0), 0) / events.length

  return (
    <div className="map-view">
      <div className="map-panel">
        <MapContainer center={[centerLat, centerLng]} zoom={6} className="map-container">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {events.map((event) => (
            <Marker key={event.id} position={[event.latitude, event.longitude]}>
              <Popup>
                <div className="popup-content">
                  <h4>{event.title}</h4>
                  <p>{event.locationText}</p>
                  <p className="popup-date">
                    {event.startDate ? new Date(event.startDate).toLocaleDateString() : 'No date'}
                  </p>
                  {event.url && (
                    <a href={event.url} target="_blank" rel="noopener noreferrer">
                      Learn more
                    </a>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      <aside className="map-events" aria-label="Mapped events">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </aside>
    </div>
  )
}

export default MapView
