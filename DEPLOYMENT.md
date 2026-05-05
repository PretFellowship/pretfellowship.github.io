# FP Events Web App - Building & Deployment Guide

## Development

### Prerequisites
- Node.js 18+
- npm

### Setup
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Building for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` directory.

---

## GitHub Pages Deployment

### Automatic Deployment (Recommended)

The project includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically:
1. Runs on every push to `main` branch
2. Installs dependencies
3. Builds the production bundle
4. Deploys to GitHub Pages

Just push your commits to `main` and the site will deploy automatically!

### Manual Deployment

```bash
npm run deploy
```

This command:
1. Builds the production bundle
2. Stages and commits the dist folder
3. Pushes to the `gh-pages` branch

### GitHub Pages Configuration

Ensure your repository settings have:
- **Source**: Deploy from a branch
- **Branch**: `gh-pages` (or `main` with `/docs` folder if preferred)

---

## Adding New Events

Events are stored in `/data/events.json`. To add a new event:

```json
{
  "id": "unique-event-id",
  "title": "Event Title",
  "description": "Event description...",
  "startDate": "2026-05-15T09:00:00Z",
  "endDate": "2026-05-15T17:00:00Z",
  "locationType": "in_person",
  "locationText": "City, Country",
  "latitude": 40.0,
  "longitude": -105.0,
  "url": "https://event-website.com",
  "tags": ["FP", "conference"],
  "featured": false,
  "createdAt": "2026-01-15T10:00:00Z"
}
```

**Field Descriptions:**
- `id`: Unique identifier (no spaces, use hyphens)
- `title`: Event name
- `description`: Event details
- `startDate` / `endDate`: ISO 8601 format
- `locationType`: "online" | "in_person" | "hybrid"
- `locationText`: City, venue name, or URL for online events
- `latitude` / `longitude`: Optional, for map view display
- `url`: Registration or info page URL
- `tags`: Array of category tags (e.g., "FP", "Haskell", "conference")
- `featured`: Boolean - whether to highlight in UI
- `createdAt`: ISO 8601 timestamp

---

## Project Structure

```
.
├── index.html                 # HTML entry point
├── package.json              # Dependencies & scripts
├── vite.config.js           # Vite configuration
├── .github/
│   └── workflows/
│       └── deploy.yml       # GitHub Actions deploy workflow
├── src/
│   ├── main.jsx             # React entry with TanStack Query
│   ├── App.jsx              # Main app component
│   ├── App.css              # Global styles
│   ├── index.css            # Base styles
│   ├── views/
│   │   ├── EventListView.jsx    # List view with filters
│   │   ├── EventListView.css
│   │   ├── CalendarView.jsx     # Calendar view
│   │   ├── CalendarView.css
│   │   ├── MapView.jsx          # Geographic map view
│   │   └── MapView.css
│   └── components/
│       ├── EventCard.jsx        # Individual event card
│       ├── EventCard.css
│       ├── FilterPanel.jsx      # Search & filter controls
│       └── FilterPanel.css
└── data/
    └── events.json          # Static event database

```

---

## Technologies

- **React 18** - UI framework
- **Vite** - Build tool & dev server
- **TanStack Query** - Data fetching & caching
- **FullCalendar** - Calendar component
- **Leaflet** - Map visualization
- **CSS3** - Styling (no framework)

---

## Performance Notes

- All data fetching is client-side via `fetch()`
- TanStack Query caches responses (5min stale time, 10min cache)
- Static hosting on GitHub Pages = $0 hosting cost
- No authentication or backend required
- Fully responsive design

---

## Customization

### Updating Branding
- Header colors: Edit `src/App.css` gradient colors
- Event card styling: `src/components/EventCard.css`
- Filter panel: `src/components/FilterPanel.css`

### Adding Features
- New views: Create in `src/views/`
- Reusable components: Create in `src/components/`
- Styling: Use CSS modules or CSS files alongside components

### Hosting Configuration
- Change homepage in `package.json` if deploying to subdirectory
- Update `vite.config.js` `base` option for subdirectory paths

---

## Contribution Workflow (Future)

Currently events are manually edited in JSON. Future enhancements:
1. GitHub-based submission via Pull Requests
2. Optional client-side form with GitHub API integration
3. Automated moderation workflow
