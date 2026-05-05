import { useState } from 'react'
import './FilterPanel.css'

function FilterPanel({ filters, allTags, onFilterChange }) {
  const [expandedFilters, setExpandedFilters] = useState({
    locationType: true,
    dateRange: false,
    tags: false,
    search: true,
  })

  const toggleFilter = (filterName) => {
    setExpandedFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName],
    }))
  }

  const handleLocationChange = (locationType) => {
    onFilterChange({ locationType })
  }

  const handleTagToggle = (tag) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag]
    onFilterChange({ tags: newTags })
  }

  const handleSearch = (e) => {
    onFilterChange({ searchText: e.target.value })
  }

  const handleDateChange = (type, value) => {
    onFilterChange({
      [type]: value || null,
    })
  }

  const handleReset = () => {
    onFilterChange({
      locationType: 'all',
      tags: [],
      startDate: null,
      endDate: null,
      searchText: '',
    })
  }

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <h3>Filters</h3>
        {(filters.tags.length > 0 || filters.locationType !== 'all' || filters.searchText) && (
          <button className="reset-btn" onClick={handleReset} title="Reset all filters">
            ↻ Reset
          </button>
        )}
      </div>

      {/* Search */}
      <div className="filter-group">
        <button
          className="filter-title"
          onClick={() => toggleFilter('search')}
        >
          🔍 Search
          <span className="toggle-icon">{expandedFilters.search ? '▼' : '▶'}</span>
        </button>
        {expandedFilters.search && (
          <div className="filter-content">
            <input
              type="text"
              placeholder="Search events..."
              value={filters.searchText}
              onChange={handleSearch}
              className="search-input"
            />
          </div>
        )}
      </div>

      {/* Location Type */}
      <div className="filter-group">
        <button
          className="filter-title"
          onClick={() => toggleFilter('locationType')}
        >
          📍 Location Type
          <span className="toggle-icon">{expandedFilters.locationType ? '▼' : '▶'}</span>
        </button>
        {expandedFilters.locationType && (
          <div className="filter-content">
            <label className="filter-option">
              <input
                type="radio"
                name="locationType"
                value="all"
                checked={filters.locationType === 'all'}
                onChange={(e) => handleLocationChange(e.target.value)}
              />
              All Events
            </label>
            <label className="filter-option">
              <input
                type="radio"
                name="locationType"
                value="online"
                checked={filters.locationType === 'online'}
                onChange={(e) => handleLocationChange(e.target.value)}
              />
              🌐 Online
            </label>
            <label className="filter-option">
              <input
                type="radio"
                name="locationType"
                value="in_person"
                checked={filters.locationType === 'in_person'}
                onChange={(e) => handleLocationChange(e.target.value)}
              />
              📍 In Person
            </label>
            <label className="filter-option">
              <input
                type="radio"
                name="locationType"
                value="hybrid"
                checked={filters.locationType === 'hybrid'}
                onChange={(e) => handleLocationChange(e.target.value)}
              />
              🔗 Hybrid
            </label>
          </div>
        )}
      </div>

      {/* Tags */}
      {allTags.length > 0 && (
        <div className="filter-group">
          <button
            className="filter-title"
            onClick={() => toggleFilter('tags')}
          >
            🏷️ Tags ({filters.tags.length})
            <span className="toggle-icon">{expandedFilters.tags ? '▼' : '▶'}</span>
          </button>
          {expandedFilters.tags && (
            <div className="filter-content">
              {allTags.map((tag) => (
                <label key={tag} className="filter-option">
                  <input
                    type="checkbox"
                    checked={filters.tags.includes(tag)}
                    onChange={() => handleTagToggle(tag)}
                  />
                  {tag}
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Date Range */}
      <div className="filter-group">
        <button
          className="filter-title"
          onClick={() => toggleFilter('dateRange')}
        >
          📅 Date Range
          <span className="toggle-icon">{expandedFilters.dateRange ? '▼' : '▶'}</span>
        </button>
        {expandedFilters.dateRange && (
          <div className="filter-content">
            <label className="filter-label">
              From:
              <input
                type="date"
                value={filters.startDate || ''}
                onChange={(e) => handleDateChange('startDate', e.target.value)}
              />
            </label>
            <label className="filter-label">
              To:
              <input
                type="date"
                value={filters.endDate || ''}
                onChange={(e) => handleDateChange('endDate', e.target.value)}
              />
            </label>
          </div>
        )}
      </div>
    </div>
  )
}

export default FilterPanel
