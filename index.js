const express = require("express");
const app = express();
const cors = require('cors')
const PORT = 8080;

app.use(cors())

app.use("/tmdb/movie", require("./routes/movie_route"));
app.use("/tmdb/series", require("./routes/series_route"));
app.use("/tmdb/search", require("./routes/search_route"));

///unknown route
app.use("/*", (req, res, next) => {
  let err = new Error("Route Not Found");
  err.status = 404;
  next(err);
});

///error handling
app.use((err, req, res, next) => {
  var code = err.status || 500;
  res.status(code == 200 ? 500 : code).json({
    status: false,
    message: err.message,
    data: null,
  });
});

app.listen(PORT, () => console.log("Server is running at :", PORT));
