const route = require("express").Router();
const controller = require("../controllers/search_controller");

route.get("/", [controller.search ]);

module.exports = route;
