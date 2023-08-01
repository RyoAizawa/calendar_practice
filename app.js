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

// フォーム送信された値の改行コードを変換するメソッド
function convert(jsonString) {
    return jsonString
        .replace(/(\r\n)/g, "\n")
        .replace(/(\r)/g, "\n")
        .replace(/(\n)/g, "\\n");
}

/*
    トップページ表示
    データベースからスケジュールのデータを全て取得し表示
*/
app.get("/", (req, res) => {
    const sql =
        "SELECT * FROM calendar";
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        res.render("index", { schedule: result });
    });
});

/*
    新規スケジュール投稿
    登録したらトップページをリダイレクト
*/
app.post("/post", (req, res) => {
    req.body.content = convert(req.body.content);
    const sql =
        "INSERT INTO calendar SET ?";
    con.query(sql, req.body, function (err, result, fields) {
        if (err) throw err;
        res.redirect("/");
    });
});

/*
    スケジュール削除
    削除したらトップページをリダイレクト
*/
app.get("/delete/:id", (req, res) => {
    const sql =
        "DELETE FROM calendar WHERE id = " + req.params.id;
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        res.redirect("/");
    });
});

/*
    スケジュール更新
    更新したらトップページをリダイレクト
*/
app.post("/update/:id", (req, res) => {
    req.body.content = convert(req.body.content);
    const sql =
        "UPDATE calendar SET ? WHERE id = " + req.params.id;
    con.query(sql, req.body, function (err, result, fields) {
        if (err) throw err;
        res.redirect("/");
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
