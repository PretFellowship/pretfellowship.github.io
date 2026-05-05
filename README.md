# Preterist Events - Full Preterist Eschatology Community Events

A lightweight, public-facing event aggregation web app for sharing full preterist community events (regional conferences, meetups, online Bible studies, retreats, and fellowship gatherings).

**Live Demo:** https://pretfellowship.github.io

## ✨ Features

- **📋 Event List View** - Chronological list of events with filtering and search
- **📅 Calendar View** - Monthly/weekly calendar visualization  
- **🗺️ Map View** - Geographic display of in-person events
- **🔍 Advanced Filtering** - Filter by location type, tags, date range, and keyword search
- **🌐 Fully Public** - No authentication required for browsing
- **⚡ Zero Backend** - Static JSON data, client-side rendering only
- **💰 $0 Hosting** - Deployed on GitHub Pages
- **📱 Responsive Design** - Works on desktop, tablet, and mobile

## 🚀 Technology Stack

- **Frontend**: React 18 + Vite
- **Data Fetching**: TanStack Query (with caching)
- **Calendar**: FullCalendar
- **Maps**: Leaflet + react-leaflet
- **Hosting**: GitHub Pages (static site)
- **Styling**: CSS3

## 📦 Project Structure

```
.
├── src/
│   ├── main.jsx              # App entry point with TanStack Query setup
│   ├── App.jsx               # Main component with view routing & filters
│   ├── views/                # Three main views
│   │   ├── EventListView.jsx
│   │   ├── CalendarView.jsx
│   │   └── MapView.jsx
│   └── components/           # Reusable components
│       ├── EventCard.jsx
│       └── FilterPanel.jsx
├── data/
│   └── events.json          # Static event database
├── .github/workflows/
│   └── deploy.yml           # GitHub Actions CI/CD
└── [config files]
```

## 🏃 Quick Start

### Development

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Deployment

The app automatically deploys to GitHub Pages via GitHub Actions when you push to `main`.

Manual deployment:
```bash
npm run build
npm run deploy
```

## 📝 Adding Events

Events are stored in `/data/events.json`. Add a new event object:

```json
{
  "id": "unique-event-id",
  "title": "Event Title",
  "description": "Event description...",
  "startDate": "2026-05-15T09:00:00Z",
  "endDate": "2026-05-15T17:00:00Z",
  "locationType": "in_person",
  "locationText": "City, Country",
  "latitude": 40.0000,
  "longitude": -105.0000,
  "url": "https://event-website.com",
  "tags": ["FP", "conference"],
  "featured": false,
  "createdAt": "2026-01-15T10:00:00Z"
}
```

### Event Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | ✓ | Unique identifier (use hyphens, no spaces) |
| `title` | string | ✓ | Event name |
| `description` | string | | Event details |
| `startDate` | ISO 8601 | ✓ | Event start time in UTC |
| `endDate` | ISO 8601 | | Event end time (defaults to startDate) |
| `locationType` | enum | ✓ | "online", "in_person", or "hybrid" |
| `locationText` | string | ✓ | Venue name, city, or URL |
| `latitude` | number | | Required for map view |
| `longitude` | number | | Required for map view |
| `url` | string | | Registration/info link |
| `tags` | string[] | | Category tags (e.g., "FP", "Haskell", "conference") |
| `featured` | boolean | | Whether to highlight the event |
| `createdAt` | ISO 8601 | | When the event was added |

## 📊 Data Architecture

- **No backend database** - Uses static JSON files
- **Client-side fetching** - Browser fetches `/data/events.json`
- **TanStack Query caching** - Avoids repeated network requests
- **Git as versioning** - Events managed via pull requests

### Future Scalability

For large event lists, partition data:
- `/data/events-2026-05.json` (monthly)
- `/data/events-online.json` (by type)
- `/data/events-in-person.json` (by type)

## 🛠️ Customization

### Update Branding

Edit `src/App.css`:
```css
/* Header gradient */
background: linear-gradient(135deg, #YOUR_COLOR1 0%, #YOUR_COLOR2 100%);

/* Primary button color */
background-color: #YOUR_PRIMARY_COLOR;
```

### Add New View

1. Create `src/views/MyView.jsx`
2. Add view-switching button in `src/App.jsx`
3. Import and render the new view

### Environment

If deploying to a subdirectory instead of project root, update:

**vite.config.js:**
```js
export default defineConfig({
  base: '/your-subdirectory/',
  // ...
})
```

**package.json:**
```json
{
  "homepage": "https://yoursite.com/your-subdirectory"
}
```

## 📚 Documentation

- [Deployment Guide](./DEPLOYMENT.md) - Detailed deployment instructions
- [GitHub Actions Workflow](./.github/workflows/deploy.yml) - CD/CI setup

## 🤝 Future Features

- [ ] Event submission form with GitHub API
- [ ] Pull request-based moderation workflow
- [ ] Event categories and organization
- [ ] Email alerts for new events
- [ ] iCalendar export

## 📄 License

[Add your license information here]

## 👥 Contributing

To contribute:
1. Fork the repository
2. Create a branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Submit a pull request

### Adding Events

Simply edit `/data/events.json` to add new events, then create a pull request.

## 💡 Built With

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [TanStack Query](https://tanstack.com/query/latest)
- [FullCalendar](https://fullcalendar.io/)
- [Leaflet](https://leafletjs.com/)
- [GitHub Pages](https://pages.github.com/)

---

**Questions or issues?** Open a GitHub issue or submit a pull request!

