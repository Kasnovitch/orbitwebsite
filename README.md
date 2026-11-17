# ORBIT

A countdown task and project management application.

Orbit is a productivity platform/website designed to help you organise your work, manage deadlines, track progress and stay focused on what's important.

The idea behind Orbit is simple: bring your tasks, projects, deadlines, and schedules, together in one organised workspace. Every task has a purpose, every deadline has a countdown and every project has a clear direction.

Orbit aims to make managing your workload easier, whether you're organising personal tasks, managing multiple projects, working with a team or planning something months in advance.

---

## Table of Contents

- [What is Orbit?](#what-is-orbit)
- [MVP (Version 1)](#mvp-version-1)
- [Tech Stack](#tech-stack)
- [Running Locally](#running-locally)
- [Roadmap](#roadmap)
  - [1. Countdown System](#1-countdown-system)
  - [2. Task Management](#2-task-management)
  - [3. Project Management](#3-project-management)
  - [4. Dashboard](#4-dashboard)
  - [5. Calendar and Scheduling](#5-calendar-and-scheduling)
  - [6. Priorities and Urgency](#6-priorities-and-urgency)
- [Completed Features](#completed-features)

---


## What is Orbit?

Orbit is an all-in-one task management and project planning application built around time, organisation and productivity.

Unlike a traditional to-do list, Orbit focuses on connecting tasks to projects, deadlines and progress. 

You should be able to open Orbit and immediately understand:

- What needs to be done
- What you're currently working on
- How much time is left before a deadline
- Which projects are progressing
- Which tasks are overdue
- What needs your attention next
- How much work you've completed

Orbit is intended to become a central workspace for managing everything from small daily tasks to large, long-term projects.

**Who is it for?** Orbit is a *personal* tool. It is designed for one person managing their own work (for example, a student balancing homework and personal projects). Team features and shared workspaces are not part of the plan for version 1.

## MVP (Version 1)
 
The full vision for Orbit is large. To avoid trying to build everything at once, Version 1 focuses on the smallest useful version of the product: **a simple personal task list with live countdowns.**
 
If Orbit can do everything below, Version 1 is finished.

### User stories
 
- As a user, I want to **add a task with a deadline** so that I can see how much time I have left.
- As a user, I want to **see a live countdown** on each task so that I know what is urgent without doing the maths myself.
- As a user, I want to **mark a task as complete** so that I can see my progress.
- As a user, I want **overdue tasks to stand out** so that I never miss them.
- As a user, I want my tasks to **still be there when I come back** so that I don't lose my work.

### In scope for Version 1
 
- [ ] Add a task with a title, due date and time, and priority
- [ ] Edit a task
- [ ] Delete a task
- [ ] Mark a task as complete (and undo it)
- [ ] Live countdown for each task (days, hours, minutes and seconds) that updates automatically
- [ ] Overdue tasks are clearly highlighted
- [ ] Tasks are sorted by the nearest deadline
- [ ] Priority levels (Critical, High, Medium, Low) are visually distinguishable
- [ ] Tasks are saved in the browser so they remain after refreshing the page

### Out of scope for Version 1
 
These are good ideas, but they will wait until later versions:
 
- Projects
- Calendar and scheduling
- Dashboard customisation
- Attachments, notes and subtasks
- Reminders and notifications
- User accounts and team features

---

## Tech Stack
 
Version 1 is a simple front-end website:
 
- **HTML** for the structure of the page
- **CSS** for styling
- **JavaScript** for the countdown logic and task behaviour
- **localStorage** (built into the browser) for saving tasks

No back-end or database is needed for Version 1.
 
---

## Running Locally
 
1. Clone the repository:
    ```bash
    git clone https://github.com/Kasnovitch/orbitwebsite.git
    ```
2. Open the project folder:
    ```bash
    cd orbitwebsite
    ```
3. Open `index.html` in your web browser.
 
---

## Roadmap
 
Everything below is the planned direction of Orbit **after** the MVP. These features are not implemented yet and may change as the project grows.

### 1. Countdown System

Countdowns are one of Orbit's central features.

Every task or project with a deadline should have a clear countdown displaying the remaining time.

Planned functionality: 

- Live countdown timers
- Days, hours, minutes and seconds
- Customisable deadline dates and times
- Deadline notifications
- Overdue countdown indicators
- Visual urgency indicators
- Upcoming deadline overview
- Optional countdowns for tasks without fixed deadlines

Example (as of 3 November):

| Task | Deadline | Remaining |
|--------|----------|-------------|
| Finish website | `10 November` | 7 days |
| Submit homework | `6 November` | 3 days |
| Launch project | `20 November` | 17 days |

Countdowns should update automatically without requiring manual refresh.

### 2. Task Management

Orbit should provide a complete task management system.

Each task should support:

- Task title
- Description
- Due date and time
- Priority level
- Completion status
- Associated projects
- Categories and labels 
- Subtasks and checklists
- Attachments
- Notes
- Creation and modification dates
- Optional reminders

Tasks should support different statuses: 

- Backlog
- To do
- In progress
- On hold
- Completed
- Cancelled

Users should have control over their tasks and be able to organise them according to their own workflow.


### 3. Project Management

Projects allow users to group related tasks into larger objectives.

Each project should have its own dedicated workspace containing:

- Project name and description
- Project status
- Start date
- Target completion date
- Project countdown
- Associated tasks
- Overall completion percentage
- Priority
- Notes and documentation
- Activity history

Projects should have their own progress indicators, allowing users to understand how much work has been completed.

Example: 

**Website development**

- 12 total tasks
- 8 completed
- 3 in progress
- 1 remaining
- 67% overall progress

### 4. Dashboard

The dashboard should act as the main control centre for Orbit.

When opening the application, users should immediately see an overview of their workload.

Planned dashboard sections:

- Welcome and personalised greeting
- Current date and time
- Active projects
- Upcoming deadlines
- Tasks due today
- Overdue tasks 
- Quick task creation
- Recently completed tasks
- Overall productivity statistics
- Important countdowns


The dashboard should be customisable so users have control over what information appears.

### 5. Calendar and Scheduling 

Orbit should include a calendar system for viewing tasks and project deadlines.

Planned functionality:

- Monthly calendar
- Weekly calendar
- Daily schedule
- Task deadline visualisation
- Project milestone tracking
- Drag and drop scheduling 
- Calendar filtering
- Upcoming events
- Reminder management

Users should be able to understand their workload across different periods.

### 6. Priorities and Urgency 

Not every task has the same importance. 

Orbit should prOvide a priority system to help users distinguish between urgent and less important work.

Suggested priority levels:

| Priority | Description  |
|--------|----------------|
| `Critical` | Requires immediate attention |
| `High` | Important and time sensitive |
| `Medium` | Should be completed soon |
| `Low` | No immediate urgency |
| `None` | No assigned priority |

Priority levels should be visually distinguishable throughout the application.

*More coming soon...*

---

## Completed Features and Work Items
 
Features will be ticked off here as they are finished.
 
- [ ] Add a task
- [ ] Edit a task
- [ ] Delete a task
- [ ] Mark a task as complete
- [ ] Live countdowns
- [ ] Overdue highlighting
- [ ] Sort by nearest deadline
- [ ] Priority levels
- [ ] Save tasks in the browser


### Migration to Angular

| Vanilla JS concept | AngularJS equivalent | Where it lives now |
|---|---|---|
| `localStorage` read/write and validation | `StorageService` using `$window.localStorage` | `js/core/storage.service.js` |
| Countdown calculation and rendering | `CountdownService` plus the `countdown` filter | `js/core/countdown.service.js`, `js/filters/countdown.filter.js` |
| `setInterval`, date labels, and countdown refresh | Shared `$interval`-backed `ClockService` | `js/core/clock.service.js` |
| Task state, CRUD, statistics, and upcoming sorting | `TaskService` | `js/core/task.service.js` |
| Search, priority/status filtering, and task rows | `task-panel` component with `ng-model`, `ng-class`, and `ng-repeat` | `js/components/task-panel.js` |
| Upcoming deadline DOM construction | `upcoming-panel` component with `ng-repeat` | `js/components/upcoming-panel.js` |
| Modal open/close state and task form submission | `ModalService` and `task-modal` component | `js/core/modal.service.js`, `js/components/task-modal.js` |
| Toast text and timeout | `ToastService` and `orbit-toast` component | `js/core/toast.service.js`, `js/components/orbit-toast.js` |
| Date formatting | Locale-aware `orbitDate` filter using `Intl.DateTimeFormat` | `js/filters/orbit-date.filter.js` |
| Manual event listeners and DOM bootstrap | Component bindings, AngularJS directives, and `ng-app` | `js/components/`, `js/app.module.js`, `index.html` |

#### Behavior differences and improvements

- Overdue filtering, row styling, metrics, and countdown labels now update live from the shared clock.
- Upcoming task countdowns use the same filter as task rows instead of duplicate refresh logic.
- The unused `includeTime` parameter, countdown `expired` field, `escapeText()`, and local datetime conversion helper were removed.
- Task removal now uses `splice()` so the service's shared task-array reference remains stable.
- Storage failures during task completion or deletion remain visible instead of being overwritten by success toasts.
- Existing task storage key, saved-data validation, task shape, confirmation and validation messages, labels, and aria attributes are retained.
