const express = require("express");
const { check, validationResult } = require("express-validator");
const { users } = require("./db");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const data = require("./data");
const bodyparser = require("body-parser");
const app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.use(express.json());
app.use("/movie", data);

app.get("/", (req, res) => {
  res.send("hello world it is thursday..!!!");
});

app.post(
  "/signup",
  [
    check("email").isEmail().isLowercase(),
    check(
      "password",
      "password length should be minimum 6 characters"
    ).isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const { password, email } = req.body;
    console.log(email, password);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    const user = users.find((user) => {
      return user.email === email;
    });
    if (user) {
      return res.status(400).json({
        errors: [
          {
            msg: "User already exist",
          },
        ],
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    // console.log(hashPassword);

    const token = await JWT.sign(
      {
        email,
      },
      "hgfysdgbcfi6tft8f76r235vf6f46f",
      {
        expiresIn: 2000,
      }
    );

    res.json({
      token,
    });

    users.push({
      email,
      password: hashPassword,
    });
  }
);

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  let user = users.find((user) => {
    return user.email === email;
  });

  if (!user) {
    return res.status(422).json({
      errors: [
        {
          msg: "Invalid Credentials",
        },
      ],
    });
  }

  let passMatch = await bcrypt.compare(password, user.password);

  if (!passMatch) {
    return res.status(404).json({
      errors: [
        {
          msg: "Invalid Credentials",
        },
      ],
    });
  }
  const token = await JWT.sign(
    {
      email,
    },
    "hgfysdgbcfi6tft8f76r235vf6f46f",
    {
      expiresIn: 2000,
    }
  );

  res.json({
    token,
  });
});

app.get("/all", (req, res) => {
  res.json(users);
});

app.listen(3001, () => {
  console.log("App running at 3001");
});
