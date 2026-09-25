import express from "express";
import fs from "node:fs/promises";
import { loadAnswers, saveAnswers } from "../data/answers.js";

const router = express.Router();

router.get("/", async (request, response) => {
  const answers = await loadAnswers();

  response.json(answers);
});

router.get("/:category", async (request, response) => {
  const answers = await loadAnswers();
  const answerRule = answers.find((a) => a.category === request.params.category);

  response.json(answerRule);
});


router.post("/", async (request, response) => {
  const answers = await loadAnswers();
  const newAnswerRule = {
    category: request.body.category,
    keywords: request.body.keywords,
    answer: request.body.answer
  };

  answers.push(newAnswerRule);
  await saveAnswers(answers);

  response.json(newAnswerRule);
});

router.put("/:category", async (request, response) => {
  const answers = await loadAnswers();

  const answerRule = answers.find((a) => a.category === request.params.category);

  response.json(answerRule);
});

router.delete("/:category", async (request, response) => {
  const answers = await loadAnswers();
  const updatedAnswers = answers.filter((a) => a.category !== request.params.category);

  await saveAnswers(updatedAnswers);

  response.send();
});

export default router;