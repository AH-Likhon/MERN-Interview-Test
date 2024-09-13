const express = require("express");
const router = require("../modules/drawing/drawing.route");

const routes = express.Router();

const collectionOfRoutes = [
  {
    path: "/drawings",
    route: router,
  },
];

collectionOfRoutes.forEach((route) => routes.use(route.path, route.route));

module.exports = routes;
