const pool = require("../config/db");

exports.getItems = async (req, res) => {
    const result = await pool.query("SELECT * FROM items ORDER BY id DESC");
    res.json(result.rows);
};

exports.createItem = async (req, res) => {
    const { name, code, stock, price } = req.body;

    const result = await pool.query(
        "INSERT INTO items (name, code, stock, price) VALUES ($1, $2, $3, $4) RETURNING *",
        [name, code, stock, price]
    );

    res.json(result.rows[0]);
};

exports.updateItem = async (req,  res) => {
    const { id } = req.params;
    const { name, stock, price } = req.body;

    await pool.query(
        "UPDATE items SET name=$1, stock=$2, price=$3 WHERE id=$4",
        [name, stock, price, id]
    );

    res.json({ message: "Item Updated Successfully"});
};

exports.deleteItem = async (req, res) => {
    const { id } = req.params;

    await pool.query("DELETE FROM items WHERE id=$1", [id]);

    res.json({ message: "Item Deleted Successfully"});
};