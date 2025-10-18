# Development Guide

## Quick Start

### Prerequisites

- **Node.js**: v18.0.0 or higher (recommended: v20.0.0+)
- **npm**: v9.0.0 or higher
- **Git**: for version control

### Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd wedding_invitation

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

The development server will start at `http://localhost:3000` and automatically open in your browser.

## Available Scripts

```bash
# Development
npm run dev          # Start dev server with hot reload

# Production
npm run build        # Build for production (output: dist/)
npm run preview      # Preview production build locally

# Code Quality
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
npm run lint         # Lint code with ESLint
npm run lint:fix     # Fix linting issues automatically
```

## Project Structure

```
wedding_invitation/
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Actions deployment workflow
├── src/
│   ├── scripts/
│   │   └── main.js          # Main JavaScript logic
│   └── styles/
│       └── main.css         # Main stylesheet
├── public/
│   └── assets/
│       ├── images/          # Static images
│       └── fonts/           # Custom fonts
├── index.html               # Main HTML entry point
├── package.json             # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── .prettierrc             # Prettier config
├── eslint.config.js        # ESLint config
└── .gitignore              # Git ignore rules
```

## Development Workflow

### 1. Local Development

```bash
# Start dev server
npm run dev

# The server will:
# - Auto-reload on file changes
# - Show errors in browser overlay
# - Enable source maps for debugging
```

### 2. Code Quality Checks

```bash
# Before committing, run:
npm run format      # Format code
npm run lint:fix    # Fix linting issues
```

### 3. Build for Production

```bash
# Build optimized bundle
npm run build

# Preview the build
npm run preview
```

### 4. Deploy to GitHub Pages

Push to `main` branch - GitHub Actions will automatically:
1. Install dependencies
2. Run production build
3. Deploy to GitHub Pages

## Configuration

### Vite Configuration (`vite.config.js`)

- **Base path**: Set to `'./'` for relative paths (works with any GitHub Pages URL)
- **Build output**: `dist/` directory
- **Dev server**: Port 3000 with auto-open
- **Optimizations**: Terser minification, console removal in production

### Code Quality Tools

**Prettier** - Code formatting:
- Semi-colons: Yes
- Single quotes: Yes
- Tab width: 2 spaces
- Print width: 100 characters

**ESLint** - Linting:
- ES2024 syntax support
- Module system (ESM)
- Warns on unused variables
- Warns on console.log (allows console.warn/error)

## Environment Variables

Currently, no environment variables are required for local development.

For Google Sheets API integration (future):
1. Copy `.env.example` to `.env`
2. Add your API keys
3. Never commit `.env` to git

## Troubleshooting

### Port 3000 already in use

```bash
# Kill the process on port 3000
lsof -ti:3000 | xargs kill -9

# Or specify a different port
npm run dev -- --port 3001
```

### Module not found errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build errors

```bash
# Clear Vite cache
rm -rf node_modules/.vite
npm run build
```

## Performance Tips

- **Images**: Use WebP format, compress before adding
- **Fonts**: Use `font-display: swap` for Google Fonts
- **JavaScript**: Keep bundle size < 100KB
- **CSS**: Use CSS custom properties for theming
- **Target**: Lighthouse score 95+ on mobile

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile Safari: iOS 14+
- Chrome Android: Latest version

## Resources

- [Vite Documentation](https://vite.dev/)
- [MDN Web Docs](https://developer.mozilla.org/)
- [GitHub Pages Docs](https://docs.github.com/en/pages)

## Need Help?

- Check existing issues in the repository
- Review the [PROJECT_PLAN.md](PROJECT_PLAN.md) for architecture decisions
- Consult the [README.md](README.md) for project overview
