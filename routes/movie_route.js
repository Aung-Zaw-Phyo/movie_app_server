const route = require("express").Router();
const controller = require("../controllers/movie_controller");

route.get("/", [controller.getMovie]);
route.get('/playing', [controller.playingMovie])
route.get('/upcoming', [controller.upcomingMovie])
route.get('/top-rated', [controller.topRatedMovie])
route.get("/detail", [controller.getDetail]);

module.exports = route;
