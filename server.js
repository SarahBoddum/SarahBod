import express from "express";
import fs from "node:fs/promises";

const app = express();
const PORT = 3000;

async function loadMessages() {
  const data = await fs.readFile("./data/messages.json", "utf8");
  return JSON.parse(data);
}

async function saveMessages(messages) {
  const json = JSON.stringify(messages, null, 2);
  await fs.writeFile("./data/messages.json", json);
}

const answers = [
  {
    category: "navn",
    keywords: ["navn", "hedder", "hvem er du"],
    answer: "Jeg hedder Sarah. Hvad vil du ellers vide om mig?"
  },
  {
    category: "bor",
    keywords: ["bor", "by", "fra"],
    answer: "Jeg bor i Beder."
  },
  {
    category: "alder",
    keywords: ["alder", "gammel", "fødselsdag"],
    answer: "Jeg er 35 år gammel."
  },
  {
    category: "fritid",
    keywords: ["fritid", "hobby", "kan lide"],
    answer: "Jeg har en virksomhed på hobbyniveau (...tror Ase) hvor jeg syr og designer tøj. I virkeligheden er det nok ok meget mere end hobby. Shhhh. Ellers broderer jeg mega meget for tiden, tegner og løber"
  }
];

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

function countMatches(keywords, normalizedQuestion) {
  const matches = keywords.filter((keyword) => {
    return normalizedQuestion.includes(keyword);
  });

  return matches.length;
}


function findBestAnswer(question) {
  const normalizedQuestion = question.toLowerCase();
  let bestScore = 0;
  let bestAnswer = "Det kender jeg ikke svaret på endnu.";
  let bestCategory = "";

  for (const answerGroup of answers) {
   const score = countMatches(answerGroup.keywords, normalizedQuestion);
   if (score > bestScore) {
      bestScore = score;
      bestAnswer = answerGroup.answer;
      bestCategory = answerGroup.category;
    }
  }

  return { answer: bestAnswer, category: bestCategory };
}



const topicStats = {
  navn: 0,
  bor: 0,
  fritid: 0,
  alder: 0,
};
    
app.get("/", async (request, response) => {
  const messages = await loadMessages();
  response.render("index", { messages, error: "", topicStats });
});


app.post("/ask", async (request, response) => {
  const messages = await loadMessages();
  const question = request.body.question.trim();
  let error = "";

  if (!question) {
    error = "Skriv et spørgsmål, før du sender.";
  } else {
    messages.push({ type: "question", text: question });

    const result = findBestAnswer(question);
    messages.push({ type: "answer", text: result.answer });

    if (result.category) {
      topicStats[result.category] = topicStats[result.category] + 1;
      console.log("topicStats:", topicStats);
    }

    await saveMessages(messages);
  }

  response.render("index", { messages, error, topicStats });
});

app.listen(PORT, () => {
  console.log(`Serveren kører på http://localhost:${PORT}`);
});