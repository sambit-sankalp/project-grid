const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const session = require("express-session");
const dbConnection = require("./database");
const MongoStore = require("connect-mongo")(session);
const app = express();
var cors = require("cors");
const PORT = 5000;
// Route requires
const user = require("./routes/index");

app.use(cors());
app.use(morgan("dev"));

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

// Sessions
app.use(
  session({
    secret: "fraggle-rock", //pick a random string to make the hash that is generated secure
    store: new MongoStore({ mongooseConnection: dbConnection }),
    resave: false, //required
    saveUninitialized: false, //require
  })
);


// Routes
app.use("/", user);
// Starting Server
app.listen(PORT, () => {
  console.log(`App listening on PORT: ${PORT}`);
});