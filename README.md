# Straindog 

A modern, Next.js-powered web application for managing and exploring cannabis strains with an intuitive user interface.

## Features

- Interactive strain browsing and exploration
- Grid and showcase view modes
- Swipeable strain cards with detailed information
- PDF export functionality
- Responsive design for all devices

## Tech Stack

- **Framework**: Next.js 15.1
- **Frontend**: React 19
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Database**: CouchDB (via nano)
- **PDF Generation**: jsPDF + html2canvas

## Project Structure

```
straindog/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── grid/              # Grid view page
│   ├── showcase/          # Showcase view page
│   └── page.js            # Main landing page
├── components/            # Reusable React components
├── context/              # React context providers
├── data/                 # Data management
├── modules/              # Business logic modules
├── public/              # Static assets
└── utils/               # Utility functions
```

## Setup & Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env.local` file with required configuration
   ```
   COUCH_URL=your_couchdb_url
   COUCH_USER=your_username
   COUCH_PASSWORD=your_password
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Development Workflow

1. The application follows Next.js 13+ app directory structure
2. Components are organized by feature in the components directory
3. API routes handle database operations and data processing
4. Styling is managed through Tailwind CSS classes
5. State management uses React Context for global state

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production bundle
- `npm start` - Start production server
- `npm run lint` - Run ESLint checks

## Dependencies

### Core
- next: ^15.1.6
- react: ^19.0.0
- react-dom: ^19.0.0

### UI/UX
- framer-motion: ^12.4.2
- react-swipeable: ^7.0.2
- tailwindcss: ^3.4.1

### Data & Utils
- nano: ^10.1.4
- jspdf: ^2.5.2
- html2canvas: ^1.4.1
- dotenv: ^16.4.7
