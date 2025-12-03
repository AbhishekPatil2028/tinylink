import { pool } from "../config/db.js";

export const LinkService = {
  async createLink({ code, url }) {
    const query = `
      INSERT INTO links (code, target_url)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const result = await pool.query(query, [code, url]);
    return result.rows[0];
  },

  async findByCode(code) {
    const result = await pool.query(`SELECT * FROM links WHERE code=$1`, [code]);
    return result.rows[0];
  },

  async listLinks() {
    const result = await pool.query(`SELECT * FROM links ORDER BY created_at DESC`);
    return result.rows;
  },

  async deleteLink(code) {
    return pool.query(`DELETE FROM links WHERE code=$1`, [code]);
  },

  async incrementClicks(code) {
    await pool.query(`
      UPDATE links
      SET total_clicks = total_clicks + 1,
          last_clicked_at = NOW()
      WHERE code=$1
    `, [code]);
  },
};
