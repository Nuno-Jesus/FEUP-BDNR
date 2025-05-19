const express = require("express");
const router = express.Router();
const controller = require("../controllers/products");

router.get("/low-stock", controller.getLowStockProducts);
router.get("/:id", controller.getProductById);
router.get("/:id/similar", controller.getSimilarProducts);
router.get("/:id/review/average", controller.getReviewsAverage);

router.post("/:id/review", controller.postReview);
router.post("/search", controller.searchProducts);

module.exports = router;