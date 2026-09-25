let input = document.getElementById('message-input')
let counter = document.getElementsById('char-count')
let container = document.querySelector('.char-counter')

input.addEventListener('input', function(event){
    let length = event.target.value.length
    counter.innerText = length

    container.classList.remove('warning', 'danger')

    if (lenght > 250){
        container.classList.add('danger')
    } else if (lenght > 200){
        container.classList.add('warning')
    }
})

/*const form = document.getElementById("chatForm");
const input = document.getElementById("userInput");
const answer = document.getElementById("answer");

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const question = input.value.toLowerCase();

    if (question.includes("hej")) {
        answer.textContent = "Hej! Hvad har du lyst til at spørge om?";
    } 
    else if (question.includes("hvad hedder du")) {
        answer.textContent = "Jeg hedder SarahBot 🤖";
    } 
    else if (question.includes("hvordan har du det")) {
        answer.textContent = "Jeg har det godt, tak fordi du spørger!";
    } 
    else {
        answer.textContent = "Det spørgsmål forstår jeg ikke endnu.";
    }

    input.value = "";
});*/