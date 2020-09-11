const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const API = require("./api");

const publicDir = __dirname + "/public/";
const sendOpt = {
  root: publicDir,
};

// middleware which sets directory as public folder
app.use(express.static("public")); 

// middleware to process initial request
app.get("/", (req, res) => {
  res.sendFile("index.html", sendOpt, function (err) {
    if (!err) {
    }
  });
});

// middleware to process API Routes
app.use("/api", API);


// Function which listens for requests specific PORT
app.listen(PORT, () => {
  console.log(
    `-------- ${new Date().toUTCString()} : App listening at http://localhost:${PORT} -------`
  );
});
