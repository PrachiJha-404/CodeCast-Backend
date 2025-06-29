#  CodeCast

**CodeCast** is a real-time collaborative coding platform built for classrooms and online lessons. It allows teachers to live-code during lessons, share code updates with students in real time, control the pace of the lesson, and enable students to branch, edit, and review code independently — making it perfect for interactive, hands-on learning environments.

## Problem Statement

CodeCast addresses a growing need in tech education: enabling seamless real-time code sharing between teachers and students while maintaining clarity, engagement, and interactivity. Traditional screen-sharing is static and lacks flexibility. CodeCast reimagines this experience with features focused on **synchronized, editable, replayable code sharing**.

---

## Features

- **Real-time Code Broadcasting**
  - Teachers write code live — students see updates in real-time using WebSockets.

- **Access & Review Previous Code**
  - Students can scroll back to earlier parts of the session to review the flow of logic.

- **Embedded Code Editor**
  - Syntax-highlighted, VS Code-like editor for seamless typing, reading, and editing.

- **Playback Feature**
  - Students can replay the session to see how the code evolved over time.

- **Branch & Practice**
  - Each student can branch into their own version of the codebase and experiment without disrupting the class session.

---

## Pros

- Enables interactive, collaborative teaching.
- Maintains classroom focus and pacing.
- Supports self-paced revision and learning.
- Empowers students to practice live code independently.

## Known Constraints

- Requires a stable internet connection.
- Students may still get distracted if not engaged actively.

---

## Tech Stack

- **Backend:** Node.js, Express.js
- **Real-time Communication:** WebSockets (Socket.IO)
- **Database:** MongoDB

---

## Project Highlights

- Co-designed and built the backend to handle real-time code streaming for classrooms.
- Presented at **CIE Ignite 2025** — secured **2nd place** and won **₹15,000** in as prize money.

---

## Future work

- Scale the system to support **50+ concurrent users**.
- Implement the other features like branching, replaying. 
- Compare current real-time code sharing mechanism with the same thing implemeneted using P2P, weigh pros and cons of both. Might pivot to the same in the future.

---

## Getting Started (Backend)

```bash
git clone https://github.com/PrachiJha-404/CodeCast-Backend.git
cd CodeCast-Backend
npm install
npm run dev

```

## Funny Promo Ad

Before you dive in — here's a light-hearted ad we made to show what **CodeCast** is all about:

👉 [Watch our Funny CodeCast Ad](https://drive.google.com/file/d/1esAisrIpIluYv5bQEVe0BpeKD5pPW63E/view)

_(Real coding pain meets real-time collaboration. Drama included.)_
 
