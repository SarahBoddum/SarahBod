import express from "express";
import fs from "node:fs/promises";
import { loadMessages, saveMessages } from "../data/messages.js";
import { loadAnswers } from "../data/answers.js";

const router = express.Router();

function countMatches(keywords, normalizedQuestion) {
  const matches = keywords.filter((keyword) => {
    return normalizedQuestion.includes(keyword);
  });

  return matches.length;
}


async function findBestAnswer(question) {
  const answers = await loadAnswers();
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


router.get("/", async (request, response) => {
  const messages = await loadMessages();

  response.json(messages);
});


router.post("/", async (request, response) => {
  const messages = await loadMessages();
  console.log(messages);
  console.log(Array.isArray(messages));
  const question = request.body.question.trim();

  if (!question) {
    response.json ({error: "skriv en besked før du sender"})
    return
  } 
  const message ={ type: "question", text: question, createdAt: new Date().toISOString() };
  messages.push(message);

  const result = findBestAnswer(question);
  const answerMessage = { type: "answer", text: result.answer, createdAt: new Date().toISOString() };
  messages.push(answerMessage);

  await saveMessages(messages);

  response.json({ question: message, answer: answerMessage });
});

router.delete("/", async (request, response) => {
  await saveMessages([]);
  response.send();
});

router.delete("/:id", async (request, response) => {
  const messages = await loadMessages();
  const index = messages.findIndex((message) => MessageEvent.id === Number(request.params. id));

  messages.splice(index, 1);
  await saveMessages(messages);
  
  response.status(204).send();
});

export default router;