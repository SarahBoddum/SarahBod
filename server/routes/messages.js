import express from "express";
import fs from "node:fs/promises";
import { loadMessages, saveMessages } from "../data/messages.js";
import { loadAnswers } from "../data/answers.js";

const router = express.Router();

function countMatches(keywords, normalizedQuestion) {
  const matches = keywords.filter((keyword) => {
    const regex = new RegExp(`\\b${keyword}\\b`, "i");
    return regex.test(normalizedQuestion);
  });

  return matches.length;
}
function countRelatedMatches(keywords, question) {
  return keywords.filter((keyword) => {
    return question.includes(keyword.toLowerCase());
  }).length;
}

function findRelatedAnswer(answerGroup, question) {
  if (!answerGroup.relatedQuestions) {
    return null;
  }

  const normalizedQuestion = question.toLowerCase();

  for (const relatedQuestion of answerGroup.relatedQuestions) {
    for (const keyword of relatedQuestion.keywords) {
      if (normalizedQuestion.includes(keyword.toLowerCase())) {
        return relatedQuestion.answer;
      }
    }
  }

  return null;
};



async function findBestAnswer(question) {
  const answers = await loadAnswers();
  const normalizedQuestion = question.toLowerCase();

  let bestScore = 0;
  let bestAnswer = "Det kender jeg ikke svaret på endnu.";
  let bestCategory = "";
  let bestAnswerGroup = null;

  // 1. Find hovedkategori
  for (const answerGroup of answers) {
    const score = countMatches(
      answerGroup.keywords,
      normalizedQuestion
    );

    if (score > bestScore) {
      bestScore = score;
      bestAnswer = answerGroup.answer;
      bestCategory = answerGroup.category;
      bestAnswerGroup = answerGroup;
    }
  }

  // 2. Hvis vi fandt en hovedkategori,
  //    så kig efter et mere specifikt relatedQuestion
  if (bestAnswerGroup) {
    const relatedAnswer = findRelatedAnswer(
      bestAnswerGroup,
      normalizedQuestion
    );

    if (relatedAnswer) {
      bestAnswer = relatedAnswer;
    }
  }

  // 3. Hvis vi IKKE fandt en hovedkategori,
  //    så søg direkte i alle relatedQuestions
  if (!bestAnswerGroup) {
    for (const answerGroup of answers) {
      const relatedAnswer = findRelatedAnswer(
        answerGroup,
        normalizedQuestion
      );

      if (relatedAnswer) {
        bestAnswer = relatedAnswer;
        bestCategory = answerGroup.category;
        break;
      }
    }
  }

  return {
    answer: bestAnswer,
    category: bestCategory
  };
}


router.get("/", async (request, response) => {
  const messages = await loadMessages();

  response.status(200).json(messages);
});

function hasKeywordsInStart(question, answers) {
  const normalizedQuestion = question.toLowerCase();

  return answers.some((answerGroup) => {
    // Tjek normale keywords
    const hasNormalKeyword = answerGroup.keywords.some((keyword) =>
      normalizedQuestion.includes(keyword.toLowerCase())
    );

    if (hasNormalKeyword) {
      return true;
    }

    // Tjek relatedQuestions
    const hasRelatedKeyword = answerGroup.relatedQuestions?.some(
      (relatedQuestion) =>
        relatedQuestion.keywords.some((keyword) =>
          normalizedQuestion.includes(keyword.toLowerCase())
        )
    );

    return hasRelatedKeyword;
  });
};


router.post("/", async (request, response) => {
  const messages = await loadMessages();
   const answers = await loadAnswers();

  console.log(messages);
  console.log(Array.isArray(messages));
  const question = request.body.question.trim();

  if (!question) {
    response.status(400).json ({error: "skriv en besked før du sender"})
    return
  } 
  
  console.log("QUESTION:", question);
console.log("ANSWERS:", JSON.stringify(answers, null, 2));
console.log("HAS KEYWORD:", hasKeywordsInStart(question, answers));
  if (!hasKeywordsInStart(question, answers)) {
    response.status(400).json({
      error: "Dit spørgsmål rammer ikke mine keywords"
    });
    return;
  }


  const message ={ type: "question", text: question, createdAt: new Date().toISOString() };
  messages.push(message);

  const result = await findBestAnswer(question);
  const answerMessage = { type: "answer", text: result.answer, createdAt: new Date().toISOString() };
  messages.push(answerMessage);

  await saveMessages(messages);

  response.status(201).json({ question: message, answer: answerMessage });
});

router.delete("/", async (request, response) => {
  await saveMessages([]);
  response.status(204).send();
});

router.delete("/:id", async (request, response) => {
  const messages = await loadMessages();
  const index = messages.findIndex((message) => message.id === Number(request.params.id));

  messages.splice(index, 1);
  await saveMessages(messages);
  
  response.status(204).send();
});

export default router;