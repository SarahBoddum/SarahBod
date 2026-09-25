import express, { response } from "express";
import fs from "node:fs/promises";
import { request } from "node:http";
import path from "node:path"; //tilføjet pga css
import { fileURLToPath } from "node:url";//tilføjet pga css
import messagesRouter from "./routes/messages.js";
import answersRouter from "./routes/answers.js";

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);//tilføjet pga css
const __dirname = path.dirname(__filename);//tilføjet pga css

app.use(express.json());


app.use(express.static(path.join(__dirname, "../clients")));//tilføjet pga css

app.get("/", (request, response) => {
    response.sendFile(path.join(__dirname, "../clients/index.html"));
});


app.use("/messages", messagesRouter);
app.use("/answers", answersRouter);


const topicStats = {
  navn: 0,
  bor: 0,
  fritid: 0,
  alder: 0,
};
    
app.get("/", (request, response) => {
  response.sendFile("index.html", { root: "../clients" });
});



app.listen(PORT, () => {
  console.log(`Serveren kører på http://localhost:${PORT}`);
});