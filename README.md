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
    - Explaining concepts (`gemini-2.5-pro`).
    - Generating quizzes with a JSON schema (`gemini-2.5-pro`).
    - Editing images based on a prompt (`gemini-2.5-flash-image`).
- **`components/ChatInterface.tsx`**: Renders the conversation history for the learning assistant.
- **`components/QuizView.tsx`**: Manages the state and UI for the interactive quiz experience.
- **`components/ProgressTracker.tsx`**: Displays the bar chart of the user's quiz history.
- **`components/ImageEditor.tsx`**: A self-contained component for the image editing feature. It handles image uploading, state management for the prompt and generated images, and displays the results.

## Project Structure
```
.
├── index.html            # Main HTML entry point
├── index.tsx             # React app root
├── App.tsx               # Main application component
├── types.ts              # Shared TypeScript types
├── metadata.json         # Application metadata
├── README.md             # This file
├── components/
│   ├── ChatInterface.tsx   # Chat UI component
│   ├── ImageEditor.tsx     # NEW: Image editing UI component
│   ├── ProgressTracker.tsx # Quiz progress chart component
│   ├── QuizView.tsx        # Quiz UI component
│   └── icons.tsx           # Reusable SVG icons
└── services/
    └── geminiService.ts    # Service for all Gemini API calls
```
