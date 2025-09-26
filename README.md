# Arjuna AI - Healthcare & DBT Platform

A comprehensive healthcare and Direct Benefit Transfer (DBT) awareness platform with AVR Audio Virtual Assistant capabilities.

## Features

### Core Features (Sidebar Navigation)
- **Dashboard** - Main overview and navigation hub
- **Consult Yantra** - AVR Audio Virtual Assistant for DBT guidance
- **Game with Yantra** - Interactive DBT learning with AI companion
- **LearnQuest** - Educational games and rewards system
- **DBT Setup** - Step-by-step Aadhaar seeding and account setup tracker

### Technology Stack
- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **AI Integration**: 
  - VAPI for voice interactions (AVR Audio Virtual Assistant)
  - Google Gemini AI for chat functionality
- **Icons**: Lucide React
- **Deployment**: Render

## Getting Started

### Development
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

## Environment Variables

Required environment variables for deployment:

```env
# VAPI Configuration for AVR Audio Virtual Assistant
NEXT_PUBLIC_VAPI_PUBLIC_KEY=your_vapi_public_key
NEXT_PUBLIC_VAPI_ASSISTANT_ID=your_vapi_assistant_id
VAPI_PRIVATE_KEY=your_vapi_private_key

# Gemini AI for Chat Functionality
GEMINI_API_KEY=your_gemini_api_key

# Optional: Database and Authentication
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_URL=your_deployment_url
NEXTAUTH_SECRET=your_nextauth_secret
```

## Deployment on Render

1. Connect your GitHub repository to Render
2. Set the environment variables in Render dashboard
3. Deploy using the provided `render.yaml` configuration

## Core Functionality

- **AVR Audio Virtual Assistant**: Voice-guided DBT assistance with audio virtual reality
- **DBT Setup Tracker**: Progress tracking for Aadhaar seeding and account setup
- **Interactive Learning**: Games and educational content for DBT awareness
- **AI-Powered Chat**: Intelligent responses for banking and scholarship queries

## License

This project is for educational and awareness purposes regarding DBT and healthcare services.