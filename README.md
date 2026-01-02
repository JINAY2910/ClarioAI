# ClarioAI

> **AI that sees what you eat.**

ClarioAI is a smart nutritional scanner designed to help you make better dietary decisions. By leveraging AI to analyze food ingredients, it provides instant, easy-to-understand insights into the nutritional value of your food.

## Features

- **Smart Scan**: Seamlessly scan food items using the intuitive "portal" interface.
- **Instant Insights**: Receive immediate feedback on your scanned items, categorized as:
  - ✅ **Positive**: Good choices that fit a balanced diet.
  - ⚠️ **Warning**: Items to consume in moderation.
  - 😐 **Neutral**: Standard items with no major concerns.
- **Reasoning Engine**: Understand *why* an item is good or bad with detailed explanations.
- **History Tracking**: Keep a log of your past scans to track your habits over time.
- **Responsive Design**: A fluid, premium experience that works perfectly on both desktop and mobile devices.

## Tech Stack

Built with a focus on performance and modern design principles:

- **Framework**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: Vanilla CSS with Custom Properties (Variables) & Advanced Animations
- **State Management**: React Context API

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```


## License

Private Project.

---

# 🧠 ClarioAI Strategic Execution Plan

**To:** Engineering Team
**From:** Senior Product Architect
**Date:** Oct 28, 2025
**Subject:** Moving from "Scanner" to "AI-Native Co-Pilot"

---

## 1. Executive Summary
Our mandate (per `project_description.txt`) is **not** to build another barcode scanner or database browser. We are building an **AI-Native Co-Pilot**.

**The Shift:**
*   **Old Way:** User scans -> App shows list of chemicals -> User is confused.
*   **ClarioAI Way:** User scans -> AI infers *intent* (e.g., "Is this safe for my kid?") -> AI explains *reasoning* -> User decides.

---

## 2. User Flow Architecture

We need to visualize the "Intent-First" architecture.

```mermaid
graph TD
    User((User))
    
    subgraph "Input Layer (The Eyes)"
        Camera[Camera Capture]
        Upload[Image Upload]
        Voice[Voice Context]
    end

    subgraph "Intelligence Layer (The Brain)"
        VisionModel[Vision Model (OCR + Scene)]
        IntentEngine[Intent Inference Engine]
        ReasoningCore[Reasoning Core]
    end

    subgraph "Output Layer (The Voice)"
        IntentUI[Inferred Intent Display]
        WhyCard[Why It Matters]
        TradeoffCard[Tradeoffs]
        UncertaintyCard[Uncertainty Disclaimer]
    end

    User -->|Scans Product| Camera
    User -->|Uploads Image| Upload
    User -->|Says 'Is this vegan?'| Voice

    Camera --> VisionModel
    Upload --> VisionModel
    
    VisionModel -->|Raw Data + Context| IntentEngine
    Voice -->|Explicit Constraint| IntentEngine
    
    IntentEngine -->|Likely Goal: Safety/Health/Taste| ReasoningCore
    
    ReasoningCore -->|Generates Insight| IntentUI
    ReasoningCore -->|Generates Insight| WhyCard
    ReasoningCore -->|Generates Insight| TradeoffCard
    ReasoningCore -->|Generates Insight| UncertaintyCard
```

---

## 3. Prioritization Strategy: What to Build First?

Based on the judging criteria (**50% AI-Native Experience**, **30% Reasoning**), we must prioritize features that demonstrate *intelligence* over features that demonstrate *completeness*.

### 🚨 Priority 1: The "Uncertainty Engine" (Critical)
*   **Why:** Traditional apps lie by omission. If they don't know an ingredient, they hide it. An AI-Native app must say, *"I see 'Spirulina', but I'm not sure if it's sourced safely here."*
*   **Action:** Improve the `AnalysisResult` to explicitly highlight what the AI *doesn't* know. This builds immense trust.

### 🚨 Priority 2: Context-Aware Scanning
*   **Why:** A protein bar means something different to a bodybuilder vs. a diabetic.
*   **Action:** Add a "User Context" toggle (e.g., "Mode: Parent", "Mode: Athlete") that changes the *entire* analysis output without changing the product.

### 🚨 Priority 3: The "Tradeoff" UI
*   **Why:** Life isn't binary (Good/Bad). It's a tradeoff.
*   **Action:** Refine the UI to show scales: *"High Protein (Good) vs. High Sugar (Bad)"* visually.

---

## 4. Recommendations & "Points to Win"

1.  **Don't Build a Database**: Do not try to scrape every food item. It’s impossible. Focus on the **LLM's ability to reason** about text it sees on the label. The "Reasoning" is the product, not the data.
2.  **Latency Masking**: AI is slow. Make the "Analyzing..." state educational. Show the user *what* the AI is thinking (e.g., "Reading ingredients...", "Checking against health guidelines...", "Formulating summary...").
3.  **Voice Interaction**: The most "AI-Native" action is speech. Allow the user to ask follow-up questions to the result (e.g., "Okay, but is it keto?").

---

## 5. Next Steps for Engineering
1.  **Refine Prompt Engineering**: The magic is in the prompt. We need to tell the AI: *"You are a nutritionist. Don't listing ingredients. Explain them."*
2.  **Mock Diverse Scenarios**: Create mock data for "Ambiguous Product", "Healthy Product", and "Dangerous Product" to test our UI's flexibility.
