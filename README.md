# ClarioAI - Intelligent Product Analysis

ClarioAI is an AI-powered product analysis tool that helps users make informed decisions about food and products. Leveraging Google's Gemini models, it provides real-time insights, deep product analysis, and an interactive chat interface to answer your questions.

## 🌟 Features

-   **📸 Smart Scanning**: Instantly capture product images using your device's camera or upload existing photos.
-   **🧠 AI Analysis**: Powered by **Google Gemini** (`gemma-3-27b-it`), ClarioAI analyzes product labels to determine health impact, nutritional value, and safety.
-   **💬 Interactive Chat**: Have a conversation about the analyzed product. Ask specific questions like "Is this safe for diabetics?" or "Does it contain gluten?".
-   **🗣️ Voice Interaction**: Use voice commands to interact with the assistant for a hands-free experience.
-   **⚡ Modern UI**: sleek, responsive interface built with React, Tailwind CSS, and Framer Motion for smooth animations.

## 🛠️ Tech Stack

-   **Frontend**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **AI**: [Google Generative AI SDK](https://www.npmjs.com/package/@google/generative-ai)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Language**: TypeScript

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

-   Node.js (v18 or higher recommended)
-   npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/ClarioAI.git
    cd ClarioAI
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**:
    Create a `.env` file in the root directory and add your Google Gemini API key. You can find a template in `.env.example`.
    
    ```env
    VITE_GEMINI_API_KEY=your_api_key_here
    ```
    
    > **Note**: You can get an API key from [Google AI Studio](https://aistudio.google.com/).

### Running the App

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

## 🏗️ Building for Production

To build the app for production:

```bash
npm run build
```

This will generate the static files in the `dist` directory.

## 📄 License

This project is licensed under the MIT License.
