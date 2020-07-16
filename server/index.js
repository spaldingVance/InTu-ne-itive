const express = require("express");
const http = require("http");
const router = require("./router.js");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const redis = require("redis")


app.use(cors())

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(function(req, res, next) {
  req.redis = client;
  next();
});

router(app);

// if (process.env.NODE_ENV === "production") {
//   // Express will serve up production assets
//   // like our main.js file, or main.css file!
//   app.use(express.static("client/build"));

//   // Express will serve up the index.html file
//   // if it doesn't recognize the route
//   const path = require("path");
//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
//   });
// }


const port = process.env.PORT || 5000;
const redis_port = process.env.PORT || 6379;

const client = redis.createClient(redis_port);

const server = http.createServer(app);


server.listen(port);
console.log("Server listening on:", port);

