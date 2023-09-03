const axios = require("axios");
const cheerio = require("cheerio");
const response = require("../utils/response");
const baseURL = "https://www.themoviedb.org";
const seriesURL = `${baseURL}/tv`;

exports.getSeries = async (req, res, next) => {
  try {
    var page = req.query.page || 1;
    var result = await axios.get(seriesURL + `?page=${page}`);
    var html = result.data;
    let tvResult = [];
    var $ = cheerio.load(html);
    const movies = $(".page_wrapper .style_1", html);
    movies.each((idx, e) => {
      const title = $("a", e).attr("title");
      const id = $("a", e).attr("href");
      const cover = $("img", e).attr("src");
      const release = $("p", e).text();
      const rating = $(".user_score_chart", e).attr("data-percent");

      if (title != undefined) {
        tvResult.push({
          rating: rating,
          id: id.split("/")[2],
          release: release,
          title: title,
          cover: baseURL + cover,
        });
      }
    });
    response.success(res, { data: tvResult });
  } catch (e) {
    next(e);
  }
};

exports.getDetail = async (req, res, next) => {
  try {
    var id = req.query.id;
    if (id == undefined) {
      response.throwError({ message: "id is required" });
    }

    var result = await axios.get(seriesURL + `/${id}`);
    var html = result.data;
    var $ = cheerio.load(html);
    const series_image = $(".image_content img").attr("data-src");
    const title = $(".title a", html).text();
    const rating = $(".user_score_chart", html).attr("data-percent");
    const overview = $(".overview p", html).text();
    const profile_name = $(".profile a", html).text();
    const character_name = $(".profile .character", html).text();
    const runtime = $(".runtime", html).text().trim();
    const series_cast = $("#cast_scroller .card", html);
    const total_season = $(".season .content h2 a").attr("href");

    let genres = [];
    for (const e of $(".genres a", html)) {
      genres.push($(e).text());
    }

    let seriesCast = [];

    series_cast.each((index, e) => {
      var character = $(".character", e).text().trim();
      var character_image = $("img", e).attr("src");
      var person_name = $("p a", e).text();
      var episode_count = $(".episode_count", e).text();
      seriesCast.push({
        character_image: baseURL + character_image,
        character: character,
        person_name: person_name,
        episode_count: episode_count,
      });
    });

    response.success(res, {
      data: {
        series_image: baseURL + series_image,
        title: title,
        rating: rating,
        overview: overview,
        profile_name: profile_name,
        character_name: character_name,
        genres: genres,
        runtime: runtime,
        total_season:
          total_season == undefined ? null : total_season.split("season/")[1],
        series_cast: seriesCast,
      },
    });
  } catch (e) {
    next(e);
  }
};

exports.getSeasonDetail = async (req, res, next) => {
  try {
    var seasonId = req.query.seasonId;
    var seriesId = req.query.seriesId;

    if (!seasonId || !seriesId) {
      response.throwError({ message: "invalid data input" });
    }
    var result = await axios.get(`${seriesURL}/${seriesId}/season/${seasonId}`);
    var html = result.data;
    var $ = cheerio.load(html);
    const poster_image = $(
      ".header .single_column_wrapper .single_column .header .poster img",
      html
    ).attr("src");
    const title = $(
      ".single_column_wrapper .single_column .title a",
      html
    ).text();
    const release_date = $(
      ".single_column_wrapper .single_column .title .tag",
      html
    ).text();
    const episode = $(
      ".column_wrapper .content_wrapper #main_column .filter .episode_sort",
      html
    ).text();
    const episode_list = $(".episode_list .card", html);

    let episodeList = [];

    episode_list.each((index, e) => {
      var episode_number = $(
        ".episode .wrapper .info .title .wrapper .episode_number",
        e
      ).text();
      var episode_rating = $(
        ".episode .wrapper .info .title .wrapper .rating_wrapper .rounded div",
        e
      )
        .text()
        .trim();
      var episode_name = $(
        ".episode .wrapper .info .title .wrapper h3",
        e
      ).text();
      var date = $(".episode .wrapper .info .date span", e).text();
      var overview = $(".episode .wrapper .info .overview p", e).text();

      episodeList.push({
        episode_number: episode_number,
        episode_rating: episode_rating,
        episode_name: episode_name,
        date: date,
        overview: overview,
      });
    });

    response.success(res, {
      data: {
        poster_image: baseURL + poster_image,
        title: title,
        release_date: release_date,
        episode: episode,
        episode_list: episodeList,
      },
    });
  } catch (e) {
    next(e);
  }
};
