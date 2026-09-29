import fs from "node:fs/promises";

export async function loadMessages() {
  try {  const data = await fs.readFile("./data/messages.json", "utf8");
  return JSON.parse(data);
} catch (error) {
  throw new Error("Kunne ikke læse indholdet af messages.json", {cause: error })
}
};

export async function saveMessages(messages) {
  const json = JSON.stringify(messages, null, 2);
  await fs.writeFile("./data/messages.json", json);
};

