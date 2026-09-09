import express from "express";

const app = express();
const PORT = 3000;
const messages = [];


app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

    
app.get("/", (request, response) => {
  response.render("index", { messages });
});


app.post("/ask", (request, response) => {
  const question = request.body.question;

  messages.push(question);

  response.render("index", { messages });
});

app.listen(PORT, () => {
  console.log(`Serveren kører på http://localhost:${PORT}`);
});