const express = require('express');
var methodOverride = require('method-override')
const routeAdmin = require("./routes/admin/index.route");
const route = require("./routes/client/index.route");
const bodyParser = require('body-parser');
const systemConfig = require("./config/system");

require("dotenv").config();

const app = express();
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: false }));

const database = require("./config/database");

database.connect();

const port = process.env.PORT;

app.set("views", "./views");
app.set("view engine", "pug");

app.locals.prefixAdmin = systemConfig.prefixAdmin;

app.use(express.static("public"));

routeAdmin(app);
route(app);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});