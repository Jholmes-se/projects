# Modern Calendar App

A beautiful, feature-rich calendar application built with React, TypeScript, and Vite.

## Features

- **Modern UI Design**
  - Animated gradient backgrounds
  - Glass morphism effects
  - Smooth animations and transitions
  - Inter font typography

- **Event Management**
  - Create, edit, and delete events
  - All-day or timed events with start/end times
  - Event categories with color coding (Work, Personal, Health, Social, Other)
  - Click events to view full details

- **Calendar Views**
  - Monthly calendar with navigation
  - Today highlighting
  - 6-week grid layout
  - Previous/next month days visible

- **Data Persistence**
  - Events saved to browser localStorage
  - Data persists across sessions

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **CSS3** - Styling with modern features

## Getting Started

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## Usage

1. **Add Event** - Click any day on the calendar
2. **View Event** - Click on an event badge
3. **Edit Event** - Click "Edit Event" in the event detail modal
4. **Delete Event** - Click "Delete Event" in the event detail modal
5. **Choose Category** - Select from 5 color-coded categories
6. **Set Times** - Toggle "All-day event" to add specific start/end times

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── Calendar.tsx       # Main calendar component
│   │   └── Calendar.css       # Calendar styles
│   ├── App.tsx                # Root component
│   ├── App.css                # App styles
│   ├── index.css              # Global styles
│   └── main.tsx               # Entry point
├── public/                    # Static assets
├── index.html                 # HTML template
└── package.json               # Dependencies
```

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions to various hosting platforms.

## License

MIT

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
