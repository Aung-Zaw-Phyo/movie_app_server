const axios = require("axios");
const cheerio = require("cheerio");
const response = require("../utils/response");
const baseURL = "https://www.themoviedb.org";
const movieURL = `${baseURL}/movie`;


exports.getMovie = async (req, res, next) => {
    try {
        var page = req.query.page || 1;
        var result = await axios.get(movieURL + `?page=${page}`);
        var html = result.data;
        let movResult = [];
        var $ = cheerio.load(html);
        
        const movies = $(".page_wrapper .style_1", html);
        
        movies.each((idx, e) => {
            const title = $("a", e).attr("title");
            const id = $("a", e).attr("href");
            const cover = $("img", e).attr("src");
            const release = $("p", e).text();
            const rating = $(".user_score_chart", e).attr("data-percent");
            
            if (title != undefined) {
                movResult.push({
                    rating: rating,
                    id: id.split("/")[2],
                    release: release,
                    title: title,
                    cover: baseURL + cover,
                });
            }
        });
        console.log(movResult[0].title)
        response.success(res, {
            data: movResult
        });
    } catch (e) {
        console.log(e);
        next(e);
    }
};

exports.playingMovie = async (req, res, next) => {
    try {
        var page = req.query.page || 1;
        var result = await axios.get('https://www.themoviedb.org/movie/now-playing?page=' + page);
        var html = result.data;
        let movResult = [];
        var $ = cheerio.load(html);

        const movies = $("#media_results .style_1", html);
        movies.each((idx, e) => {
            console.log(idx)
            console.log($(".options", e).attr("data-id"))
            const title = $("a", e).attr("title");
            const id = $("a", e).attr("href");
            const cover = $("img", e).attr("src");
            const release = $("p", e).text();
            const rating = $(".user_score_chart", e).attr("data-percent");

            if (title != undefined) {
                movResult.push({
                    rating: rating,
                    id: id.split("/")[2],
                    release: release,
                    title: title,
                    cover: baseURL + cover,
                });
            }
        });
        response.success(res, {
            data: movResult
        });
    } catch (e) {
        console.log(e);
        next(e);
    }
}

exports.upcomingMovie = async (req, res, next) => {
    try {
        var page = req.query.page || 1;
        var result = await axios.get('https://www.themoviedb.org/movie/upcoming?page=' + page);
        var html = result.data;
        let movResult = [];
        var $ = cheerio.load(html);

        const movies = $("#media_results .style_1", html);
        movies.each((idx, e) => {
            console.log(idx)
            console.log($(".options", e).attr("data-id"))
            const title = $("a", e).attr("title");
            const id = $("a", e).attr("href");
            const cover = $("img", e).attr("src");
            const release = $("p", e).text();
            const rating = $(".user_score_chart", e).attr("data-percent");

            if (title != undefined) {
                movResult.push({
                    rating: rating,
                    id: id.split("/")[2],
                    release: release,
                    title: title,
                    cover: baseURL + cover,
                });
            }
        });
        response.success(res, {
            data: movResult
        });
    } catch (e) {
        console.log(e);
        next(e);
    }
}

exports.topRatedMovie = async (req, res, next) => {
    try {
        var page = req.query.page || 1;
        var result = await axios.get('https://www.themoviedb.org/movie/top-rated?page=' + page);
        var html = result.data;
        let movResult = [];
        var $ = cheerio.load(html);

        const movies = $("#media_results .style_1", html);
        movies.each((idx, e) => {
            console.log(idx)
            console.log($(".options", e).attr("data-id"))
            const title = $("a", e).attr("title");
            const id = $("a", e).attr("href");
            const cover = $("img", e).attr("src");
            const release = $("p", e).text();
            const rating = $(".user_score_chart", e).attr("data-percent");

            if (title != undefined) {
                movResult.push({
                    rating: rating,
                    id: id.split("/")[2],
                    release: release,
                    title: title,
                    cover: baseURL + cover,
                });
            }
        });
        response.success(res, {
            data: movResult
        });
    } catch (e) {
        console.log(e);
        next(e);
    }
}

exports.getDetail = async (req, res, next) => {
    try {
        var id = req.query.id;
        if (id == undefined) {
            response.throwError({
                message: "id is required"
            });
        }
        var result = await axios.get(movieURL + `/${id}`);
        var html = result.data;
        var $ = cheerio.load(html);
        const ytID = $(".play_trailer", html).attr("data-id") || null;
        const rating = $(".user_score_chart", html).attr("data-percent");
        const overview = $(".overview p", html).text();
        const title = $(".title a", html).html();
        const cover = $('#media_scroller .backdrop img', html).attr('src')
        const thumbnail = $('.poster img', html).attr('src')
        const runtime = $(".runtime", html).text().trim();
        const top_cast = $("#cast_scroller .card", html);
        let topCast = [];

        top_cast.each((idx, e) => {
            var character_name = $(".character", e).text();
            var cover = $("img", e).attr("src") || null;
            var name_of_p = $("p", e)[0];
            var person_name = $("a", name_of_p).text();
            topCast.push({
                character_name: character_name,
                person_name: person_name,
                cover: cover == null ? null : baseURL + cover,
            });
        });
        let genres = [];

        for (const e of $(".genres a", html)) {
            genres.push($(e).text());
        }
        response.success(res, {
            data: {
                title: title,
                text_cover: baseURL + cover,
                cover: baseURL + cover.replace('_filter(blur)', '').replace('w533_and_h300_bestv2', 'w1920_and_h800_multi_faces'),
                thumbnail: baseURL + thumbnail.replace('_filter(blur)', ''),
                runtime: runtime,
                overview: overview,
                rating: rating,
                genres: genres,
                trailer: ytID == null ? null : "https://www.youtube.com/watch?v=" + ytID,
                top_cast: topCast,
            },
        });
    } catch (e) {
        next(e);
    }
};