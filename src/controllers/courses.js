const pool = require('../db/pool');

// GET /api/courses
async function getCourses(req, res) {
  try {
    const result = await pool.query(
      'SELECT * FROM courses ORDER BY name ASC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
}

// POST /api/courses
async function createCourse(req, res) {
  const { name, code, color } = req.body;
  if (!name || !code) {
    return res.status(400).json({ error: 'name and code are required' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO courses (name, code, color) VALUES ($1, $2, $3) RETURNING *',
      [name, code, color || '#3B82F6']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create course' });
  }
}

// DELETE /api/courses/:id
async function deleteCourse(req, res) {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM courses WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete course' });
  }
}

module.exports = { getCourses, createCourse, deleteCourse };
