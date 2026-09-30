# InterviewIQ – AI Smart Interview Analyzer

InterviewIQ is an AI-powered interview practice platform that helps users improve their interview performance by analyzing their **video, voice, communication, and confidence** during a mock interview.

The platform provides a realistic interview experience with timed questions, video recording, and performance analysis.

## 🚀 Features

* 🔐 **User Authentication**

  * Sign Up
  * Login
  * User session management

* 🎤 **AI Mock Interview**

  * Interview questions displayed one by one
  * 20-second thinking time
  * 5-second countdown before recording
  * Camera and microphone-based interview recording

* 🎥 **Video Interview Recording**

  * Live camera preview
  * Records video and audio using the browser
  * Recorded video playback after each answer
  * Retake option
  * Continue to the next question

* 🤖 **AI Interview Analysis**

  * Answer analysis
  * Communication analysis
  * Confidence analysis
  * Overall interview performance score

* 📊 **Performance Results**

  * Interview score
  * Communication feedback
  * Confidence feedback
  * Areas for improvement

* 💻 **Responsive Interface**

  * Modern and user-friendly UI
  * Works on desktop and supported mobile browsers

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* JavaScript
* HTML5
* CSS3

### Browser APIs

* MediaRecorder API
* MediaDevices / getUserMedia API
* HTML5 Video API

### AI

* AI-based interview and response analysis

### Development Tools

* VS Code
* Git
* GitHub

## 🔄 Interview Workflow

```text
User Login
    ↓
Start Interview
    ↓
Question Appears
    ↓
20-Second Thinking Time
    ↓
5-Second Countdown
    ↓
Camera + Microphone Recording
    ↓
Stop Recording
    ↓
Recorded Video Preview
    ↓
Retake OR Continue
    ↓
Next Question
    ↓
Complete Interview
    ↓
AI Analysis
    ↓
Performance Results
```

## 🎯 Project Objective

Traditional interview preparation mainly focuses on written answers and common interview questions. InterviewIQ aims to provide a more realistic practice environment by allowing users to **answer interview questions through video** and receive feedback on their interview performance.

The project focuses on helping users identify areas where they can improve their communication and interview delivery.

## 📂 Project Structure

```text
InterviewIQ/
│
├── public/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── assets/
│   ├── services/
│   ├── App.jsx
│   └── main.jsx
│
├── package.json
├── vite.config.js
└── README.md
```

> The exact structure may vary depending on the current implementation.

## ⚙️ Installation

Clone the repository:

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

Open the project:

```bash
cd InterviewIQ
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL shown in the terminal, usually:

```text
http://localhost:5173
```

## 🎥 Camera & Microphone Requirements

InterviewIQ requires browser permission to access:

* Camera
* Microphone

For the best experience, use a modern browser such as **Google Chrome**.

The browser must allow camera and microphone access for the interview recording functionality.

## 🔒 Privacy

InterviewIQ uses camera and microphone access only for the interview recording functionality.

Users should review the application's implementation and deployment configuration to understand how recorded interview data is stored, processed, or transmitted.

## 🌟 Future Enhancements

* Advanced facial expression analysis
* Voice tone and speaking-speed analysis
* Filler-word detection
* Eye-contact analysis
* Resume-based interview questions
* Multiple interview categories
* Interview history
* Personalized improvement recommendations
* Detailed AI-generated reports
* Support for different job roles and industries

## 👩‍💻 Project Purpose

InterviewIQ was developed as an AI-based project to explore the use of **AI, browser-based video recording, and automated interview analysis** in career preparation.

## 📜 License

This project is developed for educational and project purposes.
