# MASAR Dashboard

<p align="center">
  <strong>Central operations dashboard for MASAR</strong><br />
  Manage intercity bus journeys, bookings, operators, cities, and travellers from one focused workspace.
</p>

<p align="center">
  <a href="https://masar-dash.netlify.app/">Live Platform</a>
  ·
  <a href="https://masar-pullman.netlify.app/">Live Dashboard</a>
  ·
  <a href="https://github.com/EsmaelBizo/masar-dash">Source Code</a>
</p>

## Overview

MASAR Dashboard is the administration portal for [MASAR](https://masar-dash.netlify.app/), a digital platform for discovering and booking intercity bus journeys across Syria. It gives authorized operators a clear, responsive interface for monitoring operations and managing the data that powers the passenger experience.

The dashboard is deployed on Netlify:

**https://masar-pullman.netlify.app/**

## Key Capabilities

- **Operations overview** — Monitor core KPIs, confirmed revenue, company performance, booking status, recent trips, and recent tickets.
- **Trip management** — Create, update, inspect, and remove journeys with interactive seat layouts for VIP `2+1` and standard `2+2` configurations.
- **Booking and ticket management** — Review bookings, cancel reservations, and preview electronic boarding tickets with QR codes.
- **Transport company management** — Maintain the directory of approved bus operators and their service information.
- **City and route management** — Browse Syrian cities and garages, visualize routes, and calculate overland distances.
- **Traveller management** — Review traveller profiles, booking history, and payment activity.
- **Responsive experience** — Use the portal comfortably across desktop and smaller screens with light and dark themes.

## Technology

- React 19 and Vite 6
- Tailwind CSS 4
- React Router 7
- TanStack React Query for server-state management and cache invalidation
- Zustand for authentication, theme, dashboard, and notification state
- Axios with bearer-token authentication interceptors
- Recharts for analytics
- Lucide React for icons

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Vite will start a local development server and provide the local URL in the terminal.

### Production Build

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## API Integration

The dashboard communicates with the MASAR backend through the following services:

- **Dashboard API:** `https://sairna.abdulrahman-hares.com/api/v1/dashboard`
- **Health check:** `https://sairna.abdulrahman-hares.com/api/v1/health`
- **API documentation:** `https://sairna.abdulrahman-hares.com/api/docs/dashboard`

Authentication is handled through the dashboard login flow. Credentials are intentionally not stored in this repository; use the environment and access policy provided for your deployment.

## Project Structure

```text
src/
├── app/          # Application providers and routes
├── components/   # Reusable UI and shared business components
├── hooks/        # Query, mutation, and interaction hooks
├── layouts/      # Dashboard shell, header, and navigation
├── pages/        # Authentication and dashboard pages
├── services/     # API clients and backend services
└── store/        # Zustand stores
```

## Product Links

| Resource | Link |
| --- | --- |
| MASAR passenger platform | [masar-dash.netlify.app](https://masar-dash.netlify.app/) |
| MASAR administration dashboard | [masar-pullman.netlify.app](https://masar-pullman.netlify.app/) |
| GitHub repository | [EsmaelBizo/masar-dash](https://github.com/EsmaelBizo/masar-dash) |

## License

This project is maintained for the MASAR platform. Add licensing terms here if the project is released for external use.
