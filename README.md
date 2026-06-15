# CourseSync Backend

REST API for CourseSync, a full-stack assignment tracker with a calendar view. Built with Node.js, Express, and PostgreSQL.

## Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Express
- **Database:** PostgreSQL
- **Other:** dotenv, cors, pg

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL running locally

### Setup

```bash
# Install dependencies
npm install

# Copy environment config
cp .env.example .env
# Edit .env with your PostgreSQL connection string
```

Your `.env` should look like:
```
PORT=3001
DATABASE_URL=postgresql://postgres:password@localhost:5432/coursesync
```

### Initialize the database

```bash
npm run db:init
```

This creates the `courses` and `assignments` tables and seeds them with sample data (3 courses, 4 assignments).

### Run

```bash
npm run dev    # development with auto-reload
npm start      # production
```

API runs on `http://localhost:3001`.

## API Reference

### Courses

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/courses` | List all courses |
| POST | `/api/courses` | Create a course |
| DELETE | `/api/courses/:id` | Delete a course (cascades to assignments) |

**POST /api/courses body:**
```json
{
  "name": "Data Structures & Algorithms",
  "code": "EECS 281",
  "color": "#3B82F6"
}
```

### Assignments

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/assignments` | List assignments |
| POST | `/api/assignments` | Create an assignment |
| PATCH | `/api/assignments/:id` | Update an assignment |
| DELETE | `/api/assignments/:id` | Delete an assignment |

**GET /api/assignments query params:**
- `month` — filter by month, format `YYYY-MM` (e.g. `?month=2026-06`)
- `course_id` — filter by course

**POST /api/assignments body:**
```json
{
  "course_id": 1,
  "title": "Problem Set 4",
  "description": "Chapters 7-9",
  "due_date": "2026-06-20",
  "priority": "high"
}
```

**PATCH /api/assignments/:id** — send only the fields you want to update:
```json
{ "completed": true }
```

## Database Schema

```sql
courses (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100),
  code       VARCHAR(20),
  color      VARCHAR(7),     -- hex color e.g. "#3B82F6"
  created_at TIMESTAMPTZ
)

assignments (
  id          SERIAL PRIMARY KEY,
  course_id   INTEGER REFERENCES courses(id) ON DELETE CASCADE,
  title       VARCHAR(200),
  description TEXT,
  due_date    DATE,
  priority    VARCHAR(10),   -- 'low' | 'medium' | 'high'
  completed   BOOLEAN,
  created_at  TIMESTAMPTZ
)
```

## Project Structure

```
src/
├── index.js              Express app entry point
├── routes/
│   └── index.js          Route definitions
├── controllers/
│   ├── courses.js        Course CRUD logic
│   └── assignments.js    Assignment CRUD logic
└── db/
    ├── pool.js           PostgreSQL connection pool
    └── init.js           Schema creation + seed script
```
