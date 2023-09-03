const axios = require("axios");
const cheerio = require("cheerio");
const response = require("../utils/response");
const baseURL = "https://www.themoviedb.org";
const searchURL = `${baseURL}/search`;

exports.search = async (req, res, next) => {
  try {
    const query_value = req.query.query;
    const page = req.query.page || 1;
    if (!query_value) {
      response.throwError({
        message: "There are no movies that matched your query.",
      });
    }
    let result = await axios.get(
      searchURL + `?query=${query_value}&page=${page}`
    );
    let html = result.data;
    let $ = cheerio.load(html);
    let list = $(".card .wrapper", html);

    let search_movies = [];

    list.each((idx, e) => {
      const id = $(".details a", e).attr("href");
      const type = $(".details a", e).attr("data-media-type");
      const cover = $(".image img", e).attr("src");
      const title = $(".details h2", e).text();
      const release_date = $(".details .release_date", e).text();
      const overview = $(".details .overview p", e).text();
      if (title != "") {
        search_movies.push({
          id: id.split("/")[2],
          cover: cover ? baseURL + cover : null,
          title: title,
          type: type,
          release_date: release_date,
          overview: overview,
        });
      }
    });

    response.success(res, { data: search_movies });
  } catch (error) {
    next(error);
  }
};
