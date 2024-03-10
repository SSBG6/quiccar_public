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
            res.render("sell");
        },
        "/signup-email": (req, res) => {
            res.render("signup-email");
        },
        "/signup-verification-code": (req, res) => {   
            res.render("signup-verification-code");
        }
    };
};

module.exports = routes;
