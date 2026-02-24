const pool = require("../config/db");

exports.stockIn = async (req, res) => {
  const { item_id, quantity, date } = req.body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const item = await client.query("SELECT * FROM items WHERE id = $1", [
      item_id,
    ]);

    if (item.rows.length === 0) {
      throw new Error(" Item not found");
    }

    await client.query(
      `INSERT INTO stock_in (item_id, quantity, date, user_id)
            VALUES ($1, $2, $3, $4)`,
      [item_id, quantity, date, req.user.id],
    );

    await client.query(`UPDATE items SET stock = stock + $1 WHERE id = $2`, [
      quantity,
      item_id,
    ]);

    await client.query("COMMIT");
    res.json({ message: "Stock added successfully" });
  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ message: err.message });
  } finally {
    client.release();
  }
};

exports.stockOut = async (req, res) => {
  const { item_id, quantity, date } = req.body;

  if (!item_id || !quantity) {
    return res
      .status(400)
      .json({ message: "Item ID and quantity are required" });
  }

  if (quantity <= 0) {
    return res
      .status(400)
      .json({ message: "Quantity must be greater than zero" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const itemResult = await client.query("SELECT * FROM items WHERE id = $1", [
      item_id,
    ]);

    const item = itemResult.rows[0];

    if (!item) {
      throw new Error("Item not found");
    }

    if (item.stock < quantity) {
      throw new Error("Stok tidak cukup");
    }

    await client.query(
      `INSERT INTO stock_out (item_id, quantity, date, user_id)
            VALUES ($1, $2, $3, $4)`,
      [item_id, quantity, date, req.user.id],
    );

    await client.query(`UPDATE items SET stock = stock - $1 WHERE id = $2`, [
      quantity,
      item_id,
    ]);

    await client.query("COMMIT");
    res.json({ message: "Stock reduced successfully" });
  } catch (err) {
    await client.query("ROLLBACK");
    res.status(400).json({ message: err.message });
  } finally {
    client.release();
  }
};

exports.getHistory = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        i.name AS item_name,
        'IN' AS type,
        si.quantity,
        si.date
      FROM stock_in si
      JOIN items i ON i.id = si.item_id

      UNION ALL

      SELECT 
        i.name AS item_name,
        'OUT' AS type,
        so.quantity,
        so.date
      FROM stock_out so
      JOIN items i ON i.id = so.item_id

      ORDER BY date DESC
    `);

    res.json(result.rows);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
