const router = require("express").Router();
const stockController = require("../controllers/stockController");
const auth = require("../middleware/authMiddleware");

router.post("/in", auth, stockController.stockIn);
router.post("/out", auth, stockController.stockOut);
router.get("/history", auth, stockController.getHistory);

module.exports = router;