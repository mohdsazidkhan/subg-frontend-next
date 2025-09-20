# SUBG QUIZ - Next.js Frontend

This is the Next.js version of the SUBG QUIZ application, converted from React to Next.js with App Router using JavaScript/JSX.

## Features

- **Next.js 14** with App Router
- **JavaScript/JSX** (No TypeScript)
- **Tailwind CSS** for styling
- **React Redux** for state management
- **Google OAuth** integration
- **Responsive design** with dark mode support
- **API integration** with the backend
- **Authentication** and route protection
- **Search functionality**
- **Quiz management**
- **Admin dashboard**

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running (subg-backend)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd subg-frontend-next
   ```

2. Install dependencies:
   ```bash
   npm install
# or
yarn install
```

3. Create environment file:
   ```bash
cp env.example .env.local
```

4. Update the environment variables in `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
# ... other variables
```

### Google OAuth Setup

To enable Google OAuth login, you need to:

1. **Create a Google Cloud Project:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one

2. **Enable Google+ API:**
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it

3. **Create OAuth 2.0 Credentials:**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized JavaScript origins:
     - `http://localhost:3000` (for development)
     - `https://yourdomain.com` (for production)
   - Add authorized redirect URIs:
     - `http://localhost:3000` (for development)
     - `https://yourdomain.com` (for production)

4. **Update Environment Variables:**
   - Copy the Client ID from Google Cloud Console
   - Replace `your_google_client_id` in `.env.local` with your actual Client ID

**Note:** If Google OAuth is not configured, the Google login buttons will be hidden automatically, and users can still register/login with email and password.

5. Run the development server:
```bash
npm run dev
# or
yarn dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router (JSX files)
│   ├── layout.jsx         # Root layout
│   ├── page.jsx           # Landing page
│   ├── login/page.jsx     # Login page
│   ├── register/page.jsx  # Register page
│   ├── home/page.jsx      # Home page
│   └── search/page.jsx    # Search page
├── components/             # React components (JSX)
│   ├── pages/             # Page components
│   ├── UnifiedNavbar.jsx  # Navigation component
│   ├── UnifiedFooter.jsx  # Footer component
│   └── ...
├── lib/                   # Library files (JavaScript)
│   ├── api.js            # API service
│   ├── store/            # Redux store
│   ├── config/           # Configuration
│   └── utils/            # Utility functions
├── contexts/              # React contexts
└── styles/               # CSS files
```

## Key Features

### Authentication
- Login/Register with email and password
- Google OAuth integration
- JWT token management
- Route protection

### Quiz System
- Browse categories and subcategories
- Level-based quiz progression
- Quiz attempts and results
- Leaderboards and rankings

### Admin Panel
- Dashboard with analytics
- User management
- Quiz and question management
- Content management

### Search
- Global search across quizzes, categories, and articles
- Filtered search results
- Real-time search suggestions

## API Integration

The application integrates with the SUBG backend API. Make sure the backend is running on the configured URL (default: http://localhost:5000).

## Deployment

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Environment Variables for Production

Update the following variables for production:
- `NEXT_PUBLIC_API_URL` - Backend API URL
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` - Google OAuth client ID
- Other production-specific variables

## Technologies Used

- **Next.js 14** - React framework
- **React 18** - UI library
- **JavaScript/JSX** - No TypeScript
- **Tailwind CSS** - Styling
- **Redux Toolkit** - State management
- **React Icons** - Icon library
- **React Toastify** - Notifications
- **Axios** - HTTP client
- **JWT Decode** - Token handling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email subgquiz@gmail.com or create an issue in the repository.