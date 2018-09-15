const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const edge = require("express-edge");
const { join } = require("path");
const { writeFile, readFile } = require("fs").promises;

const utilisateurs = new Set(require("./data/utilisateurs.json"));
const articles = require("./data/listArticles.json");
const app = express();

app.use(edge);
app.set("views", join(__dirname, "views"));
app.use(express.static(join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
    secret: "cleChiffrement",
    resave: false,
    saveUninitialized: true
}));


function isAuth(req, res, next) {
    if (req.session.login !== undefined) {
        return next();
    }
    res.redirect("/");
}

function isNotAuth(req, res, next) {
    if (req.session.login === undefined) {
        return next();
    }
    res.redirect("/list");
}

// routes
app.get("/", isNotAuth, (req, res) => {
    res.render("home", { login: "antoine, faller" });
});
app.post("/login", (req, res) => {
    console.log("/login");
    const login = req.body.login;
    console.log(login);
    if (!utilisateurs.has(login)) {
        return res.json({ error: `L'identifiant ${login} ne correspond à aucun compte existant!` });
    }
    if (req.session.login !== undefined) {
        return res.json({ error: "Déjà authentifié !" });
    }
    if (typeof login !== "string") {
        return res.json({ error: "Merci de fournir une chaîne de caractères valide!" });
    }
    req.session.login = login;
    res.json({ error: null });
});
app.post("/logout", isAuth, (req, res) => {
    req.session.destroy();
    res.json({ error: null });
});
app.get("/create", isAuth, (req, res) => {
    console.log(req.session.article);
    res.render("create", req.session.article);
});
app.post("/saveFormEveryMin", (req, res)=>{
    const article = req.body;
    const err = {};
    req.session.article = article;
    res.json(req.session.article);
});
app.post("/save", (req, res) => {
    const article = req.body;
    const err = {};
    if (article.name === "" || article.prix === "") {
        err.error = "vous devez renseigner les champs obligatoires";
    } else {
        articles.push(article);
        writeFile("./data/listArticles.json", JSON.stringify(articles, null, 4)).then(() => {
            console.log("articles sauvegarder");
        }).catch(console.error);
        err.error = null;
    }
    // remettre à zero article session
    req.session.article = undefined;
    res.json(err);
});

app.get("/list", isAuth, async(req, res) => {
    const list = {};
    const data = await readFile("./data/listArticles.json", "utf-8");
    list.articles = JSON.parse(data);
    res.render("articles", list);
});

app.listen(3000);
console.log("HTTP Server listening on port 3000");
