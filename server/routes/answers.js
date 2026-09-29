import express from "express";
import fs from "node:fs/promises";
import { loadAnswers, saveAnswers } from "../data/answers.js";
import { resolve } from "node:dns";

const router = express.Router();

router.get("/", async (request, response) => {
  const answers = await loadAnswers();

  response.status(200).json(answers);
});

router.get("/:category", async (request, response) => {
  const answers = await loadAnswers();
  const answerRule = answers.find((a) => a.category === request.params.category);

  if(!answerRule) {
    response.status(404).json({error: "Jeg kender desværre ikke den kategori"})
    return;
  }
  response.status(200).json(answerRule);
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

  response.status(201).json(newAnswerRule);
});

router.put("/:category", async (request, response) => {
  const answers = await loadAnswers();

  const answerRule = answers.find((a) => a.category === request.params.category);

  if(!answerRule) {
    response.status(404).json({error: "Jeg kender ikke kategorien"})
    response;
  }

  response.status(200).json(answerRule);
});

router.delete("/:category", async (request, response) => {
  const answers = await loadAnswers();
  const updatedAnswers = answers.filter((a) => a.category !== request.params.category);

  if (!answerRule) {
  response.status(404).json({ error: "Kategorien blev ikke fundet" });
  return;
}

  await saveAnswers(updatedAnswers);

  response.status(204).send();
});

export default router;