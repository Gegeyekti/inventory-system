const router = require("express").Router();
const itemController = require("../controllers/itemController")
const auth = require("../middleware//authMiddleware")

router.get("/", auth, itemController.getItems);
router.post("/", auth, itemController.createItem);
router.put("/:id", auth, itemController.updateItem);
router.delete("/:id", auth, itemController.deleteItem);

module.exports = router;
