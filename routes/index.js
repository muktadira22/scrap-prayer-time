var express = require("express");
var router = express.Router();
const scrapData = require("../services/scrap-data");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/generate", scrapData);

module.exports = router;
