import { useMemo, useState } from 'react'
import './SuggestEventForm.css'

const schemaFields = [
  { name: 'id', type: 'text', label: 'Event ID', placeholder: 'unique-event-slug' },
  { name: 'title', type: 'text', label: 'Title', placeholder: 'Event title' },
  { name: 'description', type: 'textarea', label: 'Description', placeholder: 'Event description' },
  { name: 'startDate', type: 'datetime-local', label: 'Start Date', placeholder: '' },
  { name: 'endDate', type: 'datetime-local', label: 'End Date', placeholder: '' },
  { name: 'locationType', type: 'select', label: 'Location Type', options: ['in_person', 'online', 'hybrid', 'historical'] },
  { name: 'locationText', type: 'text', label: 'Location Text', placeholder: 'Meeting address or online details' },
  { name: 'latitude', type: 'number', label: 'Latitude', placeholder: '-90 to 90', step: '0.000001' },
  { name: 'longitude', type: 'number', label: 'Longitude', placeholder: '-180 to 180', step: '0.000001' },
  { name: 'url', type: 'url', label: 'URL', placeholder: 'https://example.com' },
  { name: 'tags', type: 'text', label: 'Tags', placeholder: 'comma separated tags' },
  { name: 'featured', type: 'checkbox', label: 'Featured event' },
  { name: 'createdAt', type: 'datetime-local', label: 'Created At', readOnly: true },
]

function SuggestEventForm({ onClose }) {
  const initialForm = useMemo(() => ({
    id: '',
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    locationType: 'online',
    locationText: '',
    latitude: '',
    longitude: '',
    url: '',
    tags: '',
    featured: false,
    createdAt: new Date().toISOString().slice(0, 16),
  }), [])

  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')

  const handleChange = (field) => (e) => {
    const value = field === 'featured' ? e.target.checked : e.target.value
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const buildEmailBody = () => {
    const lines = [
      'Preterist Fellowship Event Suggestion',
      '===================================',
      `ID: ${form.id}`,
      `Title: ${form.title}`,
      `Description: ${form.description}`,
      `Start Date: ${form.startDate}`,
      `End Date: ${form.endDate}`,
      `Location Type: ${form.locationType}`,
      `Location Text: ${form.locationText}`,
      `Latitude: ${form.latitude}`,
      `Longitude: ${form.longitude}`,
      `URL: ${form.url}`,
      `Tags: ${form.tags}`,
      `Featured: ${form.featured ? 'Yes' : 'No'}`,
      `Created At: ${form.createdAt}`,
    ]

    return lines.join('\n')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title || !form.description || !form.startDate || !form.locationType || !form.locationText || !form.tags) {
      setError('Please complete all required fields: title, description, start date, location type, location text, and tags.')
      return
    }

    if ((form.locationType === 'in_person' || form.locationType === 'hybrid') && (!form.latitude || !form.longitude)) {
      setError('Latitude and longitude are required for in-person or hybrid events.')
      return
    }

    const subject = `Event Suggestion: ${form.title}`
    const body = buildEmailBody()
    window.location.href = `mailto:pretfellowship@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  const resetForm = () => {
    setForm({ ...initialForm, createdAt: new Date().toISOString().slice(0, 16) })
    setError('')
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-content">
        <div className="modal-header">
          <div>
            <h2>Suggest an Event</h2>
            <p>Fill in the event schema fields and submit an email to pretfellowship@gmail.com.</p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <form className="suggest-form" onSubmit={handleSubmit}>
          {schemaFields.map((field) => (
            <div key={field.name} className="form-row">
              <label htmlFor={field.name}>{field.label}</label>
              {field.type === 'textarea' ? (
                <textarea
                  id={field.name}
                  value={form[field.name]}
                  placeholder={field.placeholder}
                  onChange={handleChange(field.name)}
                  rows={4}
                />
              ) : field.type === 'select' ? (
                <select id={field.name} value={form[field.name]} onChange={handleChange(field.name)}>
                  {field.options.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              ) : field.type === 'checkbox' ? (
                <div className="checkbox-row">
                  <input
                    id={field.name}
                    type="checkbox"
                    checked={form[field.name]}
                    onChange={handleChange(field.name)}
                  />
                  <span>{field.label}</span>
                </div>
              ) : (
                <input
                  id={field.name}
                  type={field.type}
                  value={form[field.name]}
                  placeholder={field.placeholder}
                  onChange={handleChange(field.name)}
                  step={field.step}
                  readOnly={field.readOnly}
                />
              )}
            </div>
          ))}

          {error && <div className="form-error">{error}</div>}

          <div className="form-actions">
            <button type="button" className="secondary-btn" onClick={resetForm}>
              Reset
            </button>
            <button type="submit" className="primary-btn">
              Submit Suggestion
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SuggestEventForm
