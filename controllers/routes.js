const routes = () => {
    return {
        "/": (req, res) => {
            res.render("index");
        },
        "/login": (req, res) => {
            res.render("login");
        },
        "/signup": (req, res) => {
            res.render("signup");
        },
        "/buy": (req, res) => {
            res.render("buy");
        },
        "/sell": (req, res) => {
            res.render("ai1_titlegen");
        },
        "/signup-email": (req, res) => {
            res.render("signup-email");
        },
        "/signup-verification-code": (req, res) => {   
            res.render("signup-verification-code");
        },
        "/completelisting":(req, res) => {
            res.render("ai1_restofinfo");
        },
        "/imageupload":(req, res) => {
            res.render("ai1_image");
        },
        "/test":(req, res) => {
            res.render("test");
        },
        "/img":(req, res) => {
            res.render("ai1_image");
        },
        "/qwerty":(req, res) => {
            res.render("qwerty");
        },
        "/community":(req, res) => {
            res.render("community");
        },
        "/createarticle":(req, res) => {
            res.render("createarticle");
        },
    };
};

module.exports = routes;
