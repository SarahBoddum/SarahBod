

const messagesContainer = document.getElementById("messages-containter");
const questionForm = document.querySelector("#chatForm");
const questionInput = document.querySelector("#question");
const clearMessagesButton = document.querySelector("#clear-messages-button");
const API_URL = "http://localhost:3000";


displayMessage({
  type: "question",
  text: "Test"
});

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

    for (const message of messages) {
        displayMessage(message)
    }
}
getMessages();

questionForm.addEventListener("submit", async (event) =>{
    event.preventDefault();

    const question = questionInput.value.trim();
    const response = await fetch(`${API_URL}/messages`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({question})
    });
   const data = await response.json();
   
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

clearMessagesButton.addEventListener("click", async () => {
    await fetch(`${API_URL}/messages`, {
        method: "DELETE"
    });

    messagesContainer.innerHTML = "";
});



