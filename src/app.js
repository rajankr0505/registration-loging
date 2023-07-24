require("dotenv").config();
const express = require("express");
const app = express();
require("./db/connect");
const bcrypt = require("bcryptjs");
const Register = require("./models/registers");

const path = require("path");
const port = process.env.PORT || 5000;
const hbs = require("hbs");

const staticPath = path.join(__dirname, "../public/javascript");
app.use(express.static(staticPath));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static("public"));
const templatesPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");
app.set("view engine", "hbs");
app.set("views", templatesPath);
hbs.registerPartials(partialsPath);





app.get("/", (req, res) => {
  res.render("index");
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/register", (req, res) => {
  res.render("register");
});

// create a new user and send data in database  // registration page
app.post("/register", async (req, res) => {
  try {
    const password = req.body.password;
    const cpassword = req.body.confirmpassword;
    if (password === cpassword) {
      const employeePassword = await Register({
        name: req.body.name,
        email: req.body.email,
        gender: req.body.gender,
        phone: req.body.phone,
        password: req.body.password,
        confirmpassword: req.body.confirmpassword,
      });

      console.log("the success part" + employeePassword);
      const token = await employeePassword.generateAuthToken();
      console.log(token);
      const postRegister = await employeePassword.save();
      res.status(200).render("index");
    } else {
      res.send("Password not match");
    }
  } catch (e) {
    res.status(500).send(e);
  }
});

// login page
app.post("/login", async (req, res) => {
  try {
    const emails = req.body.email;
    const passwords = req.body.password;
    const useremail = await Register.findOne({ email: emails });

    // hashing password matching in login page
    const matchPassword = await bcrypt.compare(passwords, useremail.password);
    const token = await useremail.generateAuthToken();
    console.log(token);

    if (matchPassword) {
      res.status(200).render("index");
    } else {
      res.send("Password are not matching");
    }
  } catch (e) {
    res.status(500).send("invalid email");
  }
});

// authentication jwt package
// const jwt = require("jsonwebtoken");
// const createToken = async () => {
//   const token = await jwt.sign(
//     { _id: "64bbc44e0ac1c402519b4303" },
//     "mynameakshaysinghmyhomeishajipurvaishalibiharnea",
//     {
//       expiresIn: "2 minutes",
//     }
//   );
//   console.log(token);

//   const userVerify = await jwt.verify(
//     token,
//     "mynameakshaysinghmyhomeishajipurvaishalibiharnea"
//   );
//   console.log(userVerify);
// };
// createToken();

app.listen(port, () => {
  console.log(`server is run at port ${port}`);
});
