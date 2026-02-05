# PM-ENG - YouTube Video Analysis for Product Managers

Learn PM skills and advanced English from YouTube videos using AI-powered analysis.

## Features

- 🎯 **PM Insights**: Extract 5 actionable insights for Product Manager career development
- 💬 **English Expressions**: Identify 7 advanced business expressions with timestamps
- 🎥 **Interactive Video Player**: Click timestamps to jump to specific moments
- 🤖 **AI-Powered**: Uses Google Gemini Flash for intelligent content analysis

## Setup Instructions

### Prerequisites

- Python 3.9+
- Node.js 16+
- Google API Key ([Get one here](https://aistudio.google.com/app/apikey))

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install Python dependencies:
```bash
pip3 install -r requirements.txt
```

3. Create a `.env` file with your Google API key:
```bash
cp .env.example .env
# Edit .env and add your GOOGLE_API_KEY
```

4. Start the Flask server:
```bash
python app.py
```

The API will be available at `http://localhost:5000`

### Frontend Setup

1. Install Node dependencies (from project root):
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Usage

1. Open `http://localhost:5173` in your browser
2. Paste a YouTube URL (must have English transcripts)
3. Click "Analyze" and wait 30-60 seconds
4. View PM insights and English expressions
5. Click timestamp buttons to jump to video moments

## Tech Stack

**Frontend:**
- React + Vite
- Tailwind CSS
- YouTube IFrame API

**Backend:**
- Python Flask
- youtube-transcript-api
- Google Gemini API

## API Endpoints

### `POST /api/analyze`

Analyze a YouTube video.

**Request:**
```json
{
  "youtube_url": "https://youtube.com/watch?v=..."
}
```

**Response:**
```json
{
  "success": true,
  "video": {
    "id": "VIDEO_ID",
    "thumbnail": "https://...",
    "url": "https://..."
  },
  "pm_insights": [...],
  "english_expressions": [...]
}
```

## Limitations

- Only works with videos that have English transcripts
- Very long videos (>2 hours) may hit token limits
- Rate limits apply based on your Google API plan

## License

MIT
