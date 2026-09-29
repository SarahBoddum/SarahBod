

const messagesContainer = document.getElementById("messages-containter");
const questionForm = document.querySelector("#chatForm");
const questionInput = document.querySelector("#question");
const clearMessagesButton = document.querySelector("#clear-messages-button");
const API_URL = "http://localhost:3000";
const errorMessage = document.getElementById("error-message");
console.log("errorMessage:", errorMessage);

function displayMessage(message) {
  const html = /*html*/ `
    <article class="${message.type}">
      <p>${message.text}</p>
    </article>`;

 messagesContainer.insertAdjacentHTML("beforeend", html);
     return messagesContainer.lastElementChild; //så det nyeste svar ligger nederst :) Tilføjet af Sarah - ikke copy paste fra en bot <3
};

async function getMessages() {
    const response = await fetch(`${API_URL}/messages`)
    const messages = await response.json()

  if (!response.ok) {
    console.log("VI ER HER");
    console.log("status:", response.status);
    console.log("data:", data);
    console.log("errorMessage:", errorMessage);

    errorMessage.textContent = data.error;
    return;
}

    for (const message of messages) {
        displayMessage(message)
    }
}
getMessages();

questionForm.addEventListener("submit", async (event) =>{
    event.preventDefault();
        console.log("1. Submit virker");

    const question = questionInput.value.trim();
        console.log("2. Spørgsmål:", question);
    const response = await fetch(`${API_URL}/messages`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({question})
    });
        console.log("3. Response:", response.status);

   const data = await response.json();

       console.log("4. Data:", data);

   if (!response.ok) {
    errorMessage.textContent = data.error;
    return;
} errorMessage.textContent = "";
   
   displayMessage(data.question);
 

    const answerElement = displayMessage(data.answer);

    const answerText = answerElement.querySelector("p");
    const text = answerText.textContent;

    answerText.textContent = "";

    let i = 0;

    function typeWriter() {
        if (i < text.length) {
            answerText.textContent += text.charAt(i);
            i++;

            messagesContainer.scrollTop = messagesContainer.scrollHeight;

            setTimeout(typeWriter, 30);
        }
    }

    typeWriter();


    questionInput.value = "";

});

let answers = [];

async function getAnswers() {
    const response = await fetch(`${API_URL}/answers`);
    answers = await response.json();
}

getAnswers();

questionInput.addEventListener("input", () => {
    const question = questionInput.value.trim();

    if (!question) {
        errorMessage.textContent = "";
        return;
    }

    const words = question
        .toLowerCase()
        .split(/\s+/);

    // Vent indtil brugeren har skrevet mindst to ord
    if (words.length < 3) {
        errorMessage.textContent = "";
        return;
    }

    const firstTwoWords = words.slice(0, 2);

    const hasKeyword = answers.some((answerGroup) =>
        answerGroup.keywords.some((keyword) =>
            firstTwoWords.includes(keyword.toLowerCase())
        )
    );

    if (!hasKeyword) {
        errorMessage.textContent =
            "Dit spørgsmål rammer ikke mine keywords";
    } else {
        errorMessage.textContent = "";
    }
});

clearMessagesButton.addEventListener("click", async () => {
    await fetch(`${API_URL}/messages`, {
        method: "DELETE"
    });

    messagesContainer.innerHTML = "";
});



