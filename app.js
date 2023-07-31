const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();

const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

const mysql = require("mysql2");

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "rootroot",
    database: "calendar_db",
});

// 外部静的ファイルの取得
app.use(express.static("assets"));

// favicon.icoがリクエストされた場合、空のレスポンスを返す。
app.get("/favicon.ico", (req, res) => {
    res.status(204);
});

/*

*/
app.get("/", (req, res) => {
    const sql =
        "SELECT * FROM calendar";
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        res.render("index", { schedule: result });
    });
});

app.post("/post", (req, res) => {
    const sql =
        "INSERT INTO calendar SET ?";
    con.query(sql, req.body, function (err, result, fields) {
        if (err) throw err;
        res.redirect("index");
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
