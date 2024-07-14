const express = require('express');

const routeAdmin = require("./routes/admin/index.route");
const route = require("./routes/client/index.route");

require("dotenv").config();

const app = express();

const database = require("./config/database");

database.connect();

const port = process.env.PORT;

app.set("views", "./views");
app.set("view engine", "pug");

app.use(express.static("public"));

routeAdmin(app);
route(app);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});