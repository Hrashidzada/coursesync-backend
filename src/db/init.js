require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function init() {
  const client = await pool.connect();
  try {
    console.log('Initializing database...');

    // Create courses table
    await client.query(`
      CREATE TABLE IF NOT EXISTS courses (
        id          SERIAL PRIMARY KEY,
        name        VARCHAR(100) NOT NULL,
        code        VARCHAR(20)  NOT NULL,
        color       VARCHAR(7)   NOT NULL DEFAULT '#3B82F6',
        created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
      );
    `);

    // Create assignments table
    await client.query(`
      CREATE TABLE IF NOT EXISTS assignments (
        id          SERIAL PRIMARY KEY,
        course_id   INTEGER      NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
        title       VARCHAR(200) NOT NULL,
        description TEXT,
        due_date    DATE         NOT NULL,
        priority    VARCHAR(10)  NOT NULL DEFAULT 'medium'
                    CHECK (priority IN ('low', 'medium', 'high')),
        completed   BOOLEAN      NOT NULL DEFAULT FALSE,
        created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
      );
    `);

    // Seed data
    await client.query(`
      INSERT INTO courses (name, code, color) VALUES
        ('Data Structures & Algorithms', 'EECS 281', '#3B82F6'),
        ('Statistics and Data Analysis', 'STATS 250', '#10B981'),
        ('Discrete Mathematics',         'MATH 465', '#F59E0B')
      ON CONFLICT DO NOTHING;
    `);

    await client.query(`
      INSERT INTO assignments (course_id, title, due_date, priority) VALUES
        (1, 'Project 4 - Branch and Bound', CURRENT_DATE + 7,  'high'),
        (1, 'Lab 11 - DP Practice',         CURRENT_DATE + 2,  'medium'),
        (2, 'Case Study 4 - Regression',    CURRENT_DATE + 5,  'high'),
        (3, 'Problem Set 8',                CURRENT_DATE + 10, 'low')
      ON CONFLICT DO NOTHING;
    `);

    console.log('Database initialized successfully.');
  } catch (err) {
    console.error('Init error:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

init();
