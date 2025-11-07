# AI Learning & Image Editing Assistant

This is an advanced web application that serves as a multi-functional AI assistant. It combines a comprehensive learning tool with a powerful, prompt-based image editor. The entire application is built using React, TypeScript, and is powered by the Google Gemini API.

## Features

The application is divided into two main sections:

### 1. Learning Assistant
- **Explain Concepts**: Ask the AI to explain any concept, from quantum physics to historical events.
- **Simplify & Elaborate**: If an explanation is too complex or too simple, you can ask the AI to "Explain Simpler" or "Go Deeper".
- **Interactive Quizzes**: Once you've understood a concept, you can request a quiz to test your knowledge. The quizzes are interactive with immediate feedback.
- **Progress Tracking**: Your quiz scores are automatically saved and visualized in a progress chart, helping you track your learning journey over time.

### 2. Image Editor
- **Upload Image**: Easily upload an image from your device.
- **Text-Based Editing**: Use simple text prompts to perform powerful edits. For example:
  - "Add a retro filter"
  - "Make the sky look like a sunset"
  - "Remove the person in the background"
  - "Turn this into a watercolor painting"
- **Side-by-Side Comparison**: View the original and the newly generated image next to each other to see the changes clearly.
- **Powered by Gemini 2.5 Flash Image**: Utilizes Google's cutting-edge multimodal model for high-quality image generation and editing.


## How It Works

### Frontend
The user interface is built with **React** and **TypeScript**, ensuring a modern, type-safe, and component-based architecture. Styling is handled by **Tailwind CSS** for a responsive and clean design. The progress chart is rendered using the **Recharts** library.

### AI Backend
All AI capabilities are powered by the **Google Gemini API** via the `@google/genai` SDK. The application makes direct, secure calls from the client-side to the Gemini API.

### Core Components
- **`App.tsx`**: The main application component. It manages the global state, including the active view (Learning Assistant vs. Image Editor), and orchestrates all other components.
- **`services/geminiService.ts`**: This is a crucial service module that abstracts all communication with the Gemini API. It contains dedicated functions for:
    - Explaining concepts (`gemini-2.5-flash`).
    - Generating quizzes with a JSON schema (`gemini-2.5-flash`).
    - Editing images based on a prompt (`gemini-2.5-flash-image`).
- **`components/ChatInterface.tsx`**: Renders the conversation history for the learning assistant.
- **`components/QuizView.tsx`**: Manages the state and UI for the interactive quiz experience.
- **`components/ProgressTracker.tsx`**: Displays the bar chart of the user's quiz history.
- **`components/ImageEditor.tsx`**: A self-contained component for the image editing feature. It handles image uploading, state management for the prompt and generated images, and displays the results.

## Running Locally

To run this project on your local machine, you'll need to have Node.js and npm installed. Follow these steps to get your development environment set up.

### 1. Clone the Repository
First, if you don't have the project files, clone the repository to your local machine:
```bash
git clone <repository-url>
cd <repository-directory>
```

### 2. Install Dependencies
Install the required npm packages using the terminal:
```bash
npm install
```

### 3. Set Up Your API Key
This project requires a Google Gemini API key to function. The application is configured to read the key from an environment variable named `API_KEY`.

You need to make this key available to the development server when you run it. Open your terminal and use one of the commands below, depending on your operating system.

**On macOS / Linux:**
You can set the environment variable for your current terminal session like this:
```bash
export API_KEY="YOUR_GEMINI_API_KEY"
```
After setting the key, you can run the server in the same terminal. Alternatively, for a single-command approach:
```bash
API_KEY="YOUR_GEMINI_API_KEY" npm run dev
```

**On Windows (Command Prompt):**
```cmd
set API_KEY="YOUR_GEMINI_API_KEY"
```

**On Windows (PowerShell):**
```powershell
$env:API_KEY="YOUR_GEMINI_API_KEY"
```

Replace `"YOUR_GEMINI_API_KEY"` with your actual key obtained from [Google AI Studio](https://aistudio.google.com/app/apikey).

### 4. Run the Development Server
Once the dependencies are installed and your API key is set, start the local development server:
```bash
npm run dev
```
The application should now be running. Open your web browser and navigate to the URL provided in the terminal (usually `http://localhost:5173`).


## Deployment

You can deploy this application for free on static hosting platforms like Vercel or Netlify. These platforms are ideal for Vite projects.

### Deploying to Vercel (Recommended)

Follow these steps to deploy your assistant to Vercel:

1.  **Push to a Git Repository**: Ensure your project code is pushed to a GitHub, GitLab, or Bitbucket repository.

2.  **Sign up for Vercel**: Create a free account on [Vercel](https://vercel.com/) and connect it to your Git provider.

3.  **Import Your Project**:
    - From your Vercel dashboard, click "Add New... -> Project".
    - Select your project's repository.

4.  **Configure Project Settings**: Vercel is smart and will likely detect that you're using Vite, applying the correct settings. Verify they are as follows:
    - **Framework Preset**: `Vite`
    - **Build Command**: `npm run build`
    - **Output Directory**: `dist`
    - **Install Command**: `npm install`

5.  **Set Environment Variables**: This is the most important step to ensure the app can connect to the Gemini API.
    - In your project's settings on Vercel, navigate to the "Environment Variables" section.
    - Add a new variable with the following details:
        - **Name**: `API_KEY`
        - **Value**: Paste your Google Gemini API key here.
    - Vercel will securely store this key and make it available during the build process.

6.  **Deploy**: Click the "Deploy" button. Vercel will now build and deploy your application. Once it's complete, you will be given a public URL where your AI assistant is live!

## Project Structure
```
.
├── index.html            # Main HTML entry point
├── vite.config.ts        # Vite configuration
├── package.json          # Project dependencies and scripts
├── tailwind.config.js    # Tailwind CSS configuration
├── README.md             # This file
├── index.tsx             # React app root
├── App.tsx               # Main application component
├── types.ts              # Shared TypeScript types
├── style.css             # Main stylesheet for Tailwind
├── components/
│   ├── ...               # React components
└── services/
    └── geminiService.ts    # Service for all Gemini API calls
```