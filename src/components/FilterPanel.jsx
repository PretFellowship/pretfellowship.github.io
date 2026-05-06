import { useState } from 'react'
import './FilterPanel.css'

function FilterPanel({ filters, allTags, onFilterChange }) {
  const [showAdvanced, setShowAdvanced] = useState(false)

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

  const handleReset = () => {
    onFilterChange({
      locationType: 'all',
      tags: [],
      startDate: null,
      endDate: null,
      searchText: '',
    })
  }

  const hasActiveFilters = filters.tags.length > 0 || filters.locationType !== 'all' || filters.searchText
  const activeFilterCount = filters.tags.length + (filters.locationType !== 'all' ? 1 : 0)

  return (
    <div className="filter-panel">
      <div className="search-container">
        <span className="search-mark" aria-hidden="true">Search</span>
        <input
          type="text"
          placeholder="Search titles, descriptions, or tags"
          value={filters.searchText}
          onChange={handleSearch}
          className="search-input"
        />
      </div>

      <div className="filter-actions">
        <button 
          className="advanced-toggle"
          onClick={() => setShowAdvanced(!showAdvanced)}
          aria-expanded={showAdvanced}
        >
          {showAdvanced ? 'Hide filters' : `Filters${activeFilterCount ? ` (${activeFilterCount})` : ''}`}
        </button>
        {hasActiveFilters && (
          <button className="reset-btn" onClick={handleReset}>
            Clear
          </button>
        )}
      </div>

      {showAdvanced && (
        <div className="advanced-filters">
          <fieldset className="filter-group">
            <legend>Location Type</legend>
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
              Online
            </label>
            <label className="filter-option">
              <input
                type="radio"
                name="locationType"
                value="in_person"
                checked={filters.locationType === 'in_person'}
                onChange={(e) => handleLocationChange(e.target.value)}
              />
              In Person
            </label>
            <label className="filter-option">
              <input
                type="radio"
                name="locationType"
                value="hybrid"
                checked={filters.locationType === 'hybrid'}
                onChange={(e) => handleLocationChange(e.target.value)}
              />
              Hybrid
            </label>
          </fieldset>

          {allTags.length > 0 && (
            <fieldset className="filter-group">
              <legend>Tags</legend>
              <div className="tags-list">
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
            </fieldset>
          )}

        </div>
      )}
    </div>
  )
}

export default FilterPanel
