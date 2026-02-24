const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    try{
        const {name, username, password, role} = req.body;

        const checkUser = await pool.query(
            "SELECT * FROM users WHERE username = $1",
            [username]
        );

        if(checkUser.rows.length > 0) {
            return res.status(400).json({message: "Username already exists"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `INSERT INTO users (name, username, password, role)
            VALUES ($1, $2, $3, $4)
            RETURNING id, name, username, role`,
            [name, username, hashedPassword, role || "staff"]
        );

        res. status(201).json({
            message: "Register Successful",
            user: result.rows[0],
        });
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const result = await pool.query(
            "SELECT * FROM users WHERE username = $1",
            [username]
        );

        const user = result.rows[0];

        if (!user) {
            return res.status(404).json({ message: "User not found"});
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(400).json({ message: "Password Salah" });
        };

        const token = jwt.sign(
            {id: user.id, role: user.role},
            process.env.JWT_SECRET,
            {expiresIn: "1h"}
        );

        res.json({
            message: "Login Success",
            token,
            user: {
                id: user.id,
                name: user.name,
                username: user.username,
                role: user.role,
            },
        });
    } catch (err) {
        res.status(500).json({ message: err.message});
    }
};
