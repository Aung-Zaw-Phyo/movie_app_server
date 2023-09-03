const route = require("express").Router();
const controller = require("../controllers/series_controller");

route.get("/", [controller.getSeries]);
route.get("/detail", [controller.getDetail]);
route.get("/season-detail/", [controller.getSeasonDetail]);

module.exports = route;
