const pool = require('../db/pool');

// GET /api/assignments?month=2026-06
async function getAssignments(req, res) {
  try {
    const { month, course_id } = req.query;

    let query = `
      SELECT a.*, c.name AS course_name, c.code AS course_code, c.color AS course_color
      FROM assignments a
      JOIN courses c ON a.course_id = c.id
      WHERE 1=1
    `;
    const params = [];

    // Filter by month if provided (e.g. "2026-06")
    if (month) {
      params.push(month);
      query += ` AND TO_CHAR(a.due_date, 'YYYY-MM') = $${params.length}`;
    }

    if (course_id) {
      params.push(course_id);
      query += ` AND a.course_id = $${params.length}`;
    }

    query += ' ORDER BY a.due_date ASC, a.priority DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
}

// POST /api/assignments
async function createAssignment(req, res) {
  const { course_id, title, description, due_date, priority } = req.body;
  if (!course_id || !title || !due_date) {
    return res.status(400).json({ error: 'course_id, title, and due_date are required' });
  }
  try {
    const result = await pool.query(
      `INSERT INTO assignments (course_id, title, description, due_date, priority)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [course_id, title, description || null, due_date, priority || 'medium']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create assignment' });
  }
}

// PATCH /api/assignments/:id
async function updateAssignment(req, res) {
  const { id } = req.params;
  const { title, description, due_date, priority, completed } = req.body;
  try {
    const result = await pool.query(
      `UPDATE assignments
       SET title       = COALESCE($1, title),
           description = COALESCE($2, description),
           due_date    = COALESCE($3, due_date),
           priority    = COALESCE($4, priority),
           completed   = COALESCE($5, completed)
       WHERE id = $6
       RETURNING *`,
      [title, description, due_date, priority, completed, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update assignment' });
  }
}

// DELETE /api/assignments/:id
async function deleteAssignment(req, res) {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM assignments WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete assignment' });
  }
}

module.exports = { getAssignments, createAssignment, updateAssignment, deleteAssignment };
