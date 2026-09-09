import express from "express";

const app = express();
const PORT = 3000;
const messages = [];


const answers = [
  {
    keywords: ["navn", "hedder", "hvem er du"],
    answer: "Jeg hedder Sarah. Hvad vil du ellers vide om mig?"
  },
  {
    keywords: ["bor", "by", "fra"],
    answer: "Jeg bor i Beder."
  },
  {
    keywords: ["fritid", "hobby", "kan lide"],
    answer: "Jeg har en virksomhed på hobbyniveau (...tror Ase) hvor jeg syr og designer tøj. I virkeligheden er det nok ok meget mere end hobby. Shhhh. Ellers broderer jeg mega meget for tiden, tegner og løber"
  }
];

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));


function findAnswer(question) {
  const normalizedQuestion = question.toLowerCase();

  for (const answerGroup of answers) {
    const hasMatch = answerGroup.keywords.some((keyword) => normalizedQuestion.includes(keyword));

    if (hasMatch) {
      return answerGroup.answer;
    }
  }

  return "Det kender jeg ikke svaret på endnu.";
}

    
app.get("/", (request, response) => {
  response.render("index", { messages, error: "" });
});


app.post("/ask", (request, response) => {
  const question = request.body.question;
  let error = "";

  if (!question) {
    error = "Du skal stille et spørgsmål!";
  } else {
    messages.push({ type: "question", text: question });
    const answer = findAnswer(question);
    messages.push({ type: "answer", text: answer });    
  }

  response.render("index", { messages, error  });
});

app.listen(PORT, () => {
  console.log(`Serveren kører på http://localhost:${PORT}`);
});