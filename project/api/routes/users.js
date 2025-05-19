const express = require("express");
const router = express.Router();
const controller = require("../controllers/users");

router.get("/", controller.getAllUsers);
router.get("/:id", controller.getUserById);
router.get("/:id/orders", controller.getUserOrders);

router.post("/:id/buy", controller.buyProduct);

module.exports = router;