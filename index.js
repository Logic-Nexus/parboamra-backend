const express = require("express");
const sequelize = require("./database");
const User = require("./user");
const app = express();
require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const port = process.env.PORT || 3000;

sequelize
  .sync({
    force: true,
  })
  .then(() => {
    // console.log("Database connected");
    // for (let i = 0; i < 5; i++) {
    //   User.create({
    //     name: `User ${i}`,
    //     email: `test${i}@gmail.com`,
    //   });
    // }
  })
  .catch((err) => {
    console.log("Unable to connect to database", err);
  });

app.get("/", async (req, res) => {
  const result = await User.findAll();

  //   console.log(result);
  const count = result.length;

  if (!count || count === 0) {
    return res.status(404).send({
      error: "Not found",
      status: 404,
    });
  }

  res.send({
    number: count,
    result,
  });
});

// / catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.status(404).send({ error: "Not found" });
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500).send({ error: err });
});

app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
});
