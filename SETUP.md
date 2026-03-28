# Setup and Installation Guide

## Quick Start (5 minutes)

### Prerequisites
- Node.js 18 or higher ([Download](https://nodejs.org/))
- npm (comes with Node.js)
- Google Gemini API key ([Get one free](https://makersuite.google.com/app/apikey))

### Installation Steps

Open PowerShell and run:

```powershell
# 1. Navigate to project directory
cd "C:\Users\OM40105410\Downloads\Gen AI Antigravity"

# 2. Install backend dependencies
npm install

# 3. Install frontend dependencies
cd client
npm install
cd ..

# 4. Create environment file
Copy-Item .env.example .env

# 5. Edit .env and add your Gemini API key
notepad .env
```

In the `.env` file, replace `your_gemini_api_key_here` with your actual API key:
```env
GEMINI_API_KEY=AIzaSyD...your_actual_key_here
```

Save and close the file.

### Start the Application

```powershell
# Start both frontend and backend
npm run dev
```

Wait for the servers to start (about 10-30 seconds). You should see:
```
🚀 Server running on port 5000
📝 Environment: development
🔐 Security: Helmet, CORS, Rate Limiting enabled
```

### Access the Application

Open your browser and go to:
- **Frontend:** http://localhost:5173
- **API Health Check:** http://localhost:5000/health

---

## Detailed Setup Instructions

### Step 1: Install Node.js

1. Download Node.js from https://nodejs.org/
2. Choose LTS version (18.x or higher)
3. Run the installer
4. Verify installation:
```powershell
node --version  # Should show v18.x.x or higher
npm --version   # Should show 9.x.x or higher
```

### Step 2: Get Gemini API Key

1. Visit https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key
5. Keep it secure (never commit to git)

### Step 3: Install Dependencies

Backend dependencies:
```powershell
npm install
```

This installs:
- Express (web server)
- Gemini AI SDK
- Security packages (Helmet, CORS, Rate Limiting)
- Validation (Joi)
- Logging (Winston)

Frontend dependencies:
```powershell
cd client
npm install
```

This installs:
- React 18
- Vite (build tool)
- Tailwind CSS (styling)
- Axios (HTTP client)
- Lucide React (icons)

### Step 4: Configure Environment

Create `.env` file:
```powershell
Copy-Item .env.example .env
```

Edit with your values:
```env
# Required
GEMINI_API_KEY=your_actual_api_key_here

# Optional (defaults shown)
PORT=5000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Step 5: Verify Setup

Run health check:
```powershell
npm run server
```

In another terminal:
```powershell
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2026-03-28T10:00:00.000Z",
  "environment": "development"
}
```

---

## Development Commands

### Start Development Server
```powershell
# Start both frontend and backend
npm run dev

# Or start separately:
npm run server    # Backend only (port 5000)
npm run client    # Frontend only (port 5173)
```

### Run Tests
```powershell
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

### Code Quality
```powershell
# Lint code
npm run lint

# Security check
npm run security-check
```

### Build for Production
```powershell
# Build frontend
npm run build

# Output will be in client/dist/
```

---

## Project Structure

```
Gen AI Antigravity/
├── server/                    # Backend (Node.js/Express)
│   ├── index.js              # Main server file
│   ├── controllers/          # Request handlers
│   │   └── aiController.js   # AI processing endpoints
│   ├── services/             # Business logic
│   │   └── geminiService.js  # Gemini AI integration
│   ├── middleware/           # Express middleware
│   │   ├── errorHandler.js   # Error handling
│   │   └── validation.js     # Input validation
│   ├── routes/               # API routes
│   │   ├── index.js          # Main router
│   │   └── ai.routes.js      # AI endpoints
│   └── utils/                # Utilities
│       └── logger.js         # Winston logger
│
├── client/                    # Frontend (React/Vite)
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── Header.jsx
│   │   │   ├── InputPanel.jsx
│   │   │   ├── ResultsPanel.jsx
│   │   │   ├── UseCaseSelector.jsx
│   │   │   └── StatsBar.jsx
│   │   ├── services/         # API integration
│   │   │   └── api.js
│   │   ├── App.jsx           # Main app component
│   │   ├── main.jsx          # Entry point
│   │   └── index.css         # Global styles
│   ├── index.html            # HTML template
│   ├── vite.config.js        # Vite configuration
│   └── tailwind.config.js    # Tailwind CSS config
│
├── tests/                     # Test files
│   ├── api.test.js           # API tests
│   └── validation.test.js    # Validation tests
│
├── logs/                      # Application logs
│
├── package.json              # Dependencies
├── .env.example              # Environment template
├── .gitignore               # Git ignore rules
├── jest.config.json         # Jest test config
├── README.md                # Main documentation
├── API_DOCS.md              # API documentation
├── SECURITY.md              # Security documentation
└── DEPLOYMENT.md            # Deployment guide
```

---

## Using the Application

### 1. Select Use Case
Choose from:
- **Medical**: Emergency triage, health analysis
- **Traffic**: Incident reporting, route analysis
- **Weather**: Alert processing, safety recommendations
- **News**: Article analysis, fact checking
- **General**: Universal input processing

### 2. Input Your Data

**Text Input:**
- Type or paste text in the input area
- Add context if needed
- Select priority level

**Image Input:**
- Click the image icon
- Upload a photo or screenshot
- Add descriptive text (optional)

**Voice Input:** (Coming soon)
- Click the microphone icon
- Speak your input

### 3. Process and Review Results

Click "Process Input" to:
1. Send data to AI
2. Get structured analysis
3. View recommended actions
4. Review alerts and priorities

### 4. Example Inputs

**Medical Example:**
```
Patient: 45-year-old male, chest pain radiating to left arm,
sweating, shortness of breath. BP 160/95, heart rate 105.
```

**Traffic Example:**
```
Multi-vehicle accident on Highway 101 northbound near Exit 42.
Multiple injuries reported. Traffic backed up 3 miles.
```

**Weather Example:**
```
Severe thunderstorm warning. Large hail, winds 70+ mph expected
in downtown area within 30 minutes.
```

---

## Troubleshooting

### Port Already in Use
```powershell
# Find and kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <process_id> /F
```

### Module Not Found
```powershell
# Clean install
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

### CORS Errors
- Ensure frontend is running on http://localhost:5173
- Check ALLOWED_ORIGINS in .env
- Restart both servers

### API Key Issues
- Verify key is correct in .env
- Check key is active at https://makersuite.google.com
- Ensure no spaces in key value

### Build Errors
```powershell
# Clear cache and rebuild
cd client
Remove-Item -Recurse -Force node_modules, dist
npm install
npm run build
```

---

## Next Steps

1. **Explore the API:** Check [API_DOCS.md](API_DOCS.md)
2. **Review Security:** Read [SECURITY.md](SECURITY.md)
3. **Deploy:** Follow [DEPLOYMENT.md](DEPLOYMENT.md)
4. **Customize:** Modify components in `client/src/components/`
5. **Extend:** Add new use cases in `server/services/geminiService.js`

---

## Getting Help

- **Documentation:** Read all .md files in root directory
- **Logs:** Check `logs/` folder for error details
- **Tests:** Run `npm test` to verify functionality
- **API Testing:** Use Postman or curl to test endpoints
- **Community:** Open an issue on GitHub

---

## Tips for Best Results

1. **Be Specific:** Provide detailed input for better AI analysis
2. **Use Context:** Add background information when available
3. **Set Priority:** Use appropriate priority levels
4. **Include Images:** Upload photos when relevant
5. **Review Output:** Always verify AI recommendations

---

**🎉 You're all set! Start processing inputs and see the magic happen!**
