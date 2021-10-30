const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");
require("dotenv").config(); // Permet d'activer les variables d'environnement qui se trouvent dans le fichier `.env`

const app = express();

app.use(cors());
app.use(formidable());
/* MAILGUN CONFIGURATION */
const api_key = process.env.API_KEY;
const domain = process.env.DOMAIN;
const mailgun = require("mailgun-js")({ apiKey: api_key, domain: domain });

app.get("/", (req, res) => {
  res.send("server is up");
});

app.post("/form", (req, res) => {
  /* DESTRUCTURING */
  const { firstname, lastname, email, subject, message } = req.fields;
  /* CREATION DE L'OBJET DATA */
  const data = {
    from: `${firstname} ${lastname} <${email}>`,
    to: "maxime.kerlidou@gmail.com" /* EMAIL AVEC LAQUELLE VOUS VOUS ÊTES ENREGISTRÉS SUR MAILGUN */,
    subject: subject,
    text: message,
  };
  /* ENVOI DE L'OBJET VIA MAILGUN */
  mailgun.messages().send(data, (error, body) => {
    if (!error) {
      return res.json(body);
    }
    res.status(401).json(error);
  });
});

app.get("*", (req, res) => {
  res.send("All routes : Welcome to my first fullstack project API");
});

app.listen(3000, () => {
  console.log("server is listening");
});
