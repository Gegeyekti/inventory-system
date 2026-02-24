const pool = require("../config/db");

exports.getSummary = async (req, res) => {
  try {
    const totalItems = await pool.query("SELECT COUNT(*) FROM items");

    const stockIn = await pool.query(
      "SELECT COALESCE(SUM(quantity),0) FROM stock_in",
    );

    const stockOut = await pool.query(
      "SELECT COALESCE(SUM(quantity),0) FROM stock_out",
    );

    res.json({
      totalItems: parseInt(totalItems.rows[0].count),
      stockIn: parseInt(stockIn.rows[0].coalesce),
      stockOut: parseInt(stockOut.rows[0].coalesce),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
