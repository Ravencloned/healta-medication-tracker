# Healta – Medication Tracker

A lightweight medication tracking application built as part of the **Healta Technical Challenge**.  
The project focuses on **clarity of logic, correctness, and thoughtful product decisions under constraints**, rather than feature overload or visual complexity.

---

## Overview

This application helps users:

- Manage medications (add, edit, delete)
- Track daily medication schedules
- Mark doses as **Taken** or **Skipped**
- Automatically update remaining stock
- Receive low-stock warnings
- Optionally restrict medications to specific days of the week

The app is intentionally simple, deterministic, and easy to reason about.

---

## Features

### 1. Medication Management
- Add medications with:
  - Name
  - Dosage (optional)
  - One or more times per day
  - Total stock
- Edit or delete existing medications
- All data is persisted locally using `localStorage`

---

### 2. Today’s Schedule
- Displays medications scheduled for **today**
- Each scheduled time is treated as a separate dose
- For each dose, users can:
  - Mark **Taken** (decrements stock)
  - Mark **Skipped** (stock unchanged)
- Dose actions persist across page refreshes

---

### 3. Stock Tracking
- Remaining stock updates automatically when doses are taken
- Low-stock warnings appear when stock falls below a defined threshold
- Prevents negative stock values

---

### 4. Scheduling Model (Design Decision)

#### Baseline (Meets Challenge Requirements)
- Medications are treated as **daily by default**
- If no day restriction is specified, the medication appears every day at its configured times

#### Optional Enhancement
- Medications can optionally be restricted to specific days of the week (e.g., Tue/Wed only)
- If days are selected, the medication appears only on those days
- If no days are selected, the medication behaves as a daily medication

This approach keeps the core experience simple while supporting more realistic schedules as an extension.

---

## Design Choices & Trade-offs

- **No backend / database**  
  The app uses `localStorage` to keep the system simple and deterministic within the scope of the challenge.

- **No push notifications**  
  Reminders are simulated through the Today view, which aligns with the challenge focus and avoids unnecessary complexity.

- **Minimal UI**  
  The interface is intentionally clean and functional, prioritizing clarity and usability over heavy styling or UI libraries.

- **Explicit assumptions documented**  
  Design assumptions (such as daily scheduling defaults) are clearly documented rather than implicitly hidden in code.

---

## Tech Stack

- Next.js (App Router)
- React
- TypeScript
- LocalStorage for persistence

No external UI or state management libraries were used.

---

## Running the Project Locally

```bash
npm install
npm run dev

