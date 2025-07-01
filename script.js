document.addEventListener("DOMContentLoaded", () => {
  const inputs = document.querySelectorAll('input[type="number"]');
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      input.value = input.value.replace(/[^0-9]/g, '');
    });
  });
});

const stopEl = document.querySelector(".stop")
const startEl = document.querySelector(".start")
const resetEl = document.querySelector(".reset")
const timerEl = document.getElementById("timer")
const infoEl = document.getElementById("info")

let interval;
let timeLeft;
let initialTime;
let timerStarted = false;


function updateTimer(){
    let hours = Math.floor(timeLeft / 3600);
    let minutes = Math.floor((timeLeft % 3600) / 60);;
    let seconds = timeLeft % 60;
    let formattedTime = `${hours.toString().padStart(2,"0")}:${minutes.toString().padStart(2,"0")}:${seconds.toString().padStart(2,"0")}`;

    timerEl.innerHTML = formattedTime;
}

function startTimer(){
    if (interval) return; 

    let hourInput = document.getElementById("hour-input").value;
    let minInput = document.getElementById("min-input").value;
    let secondInput = document.getElementById("second-input").value;
    let hours = parseInt(hourInput);
    let minutes = parseInt(minInput);
    let seconds = parseInt(secondInput);

    // Kontrol: Boş veya NaN ise hata ver
    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds) ||
        hours < 0 || minutes < 0 || seconds < 0) {
        infoEl.innerText = "Please enter a valid and positive hour, minute, and second!";
        infoEl.style.color = "#e74c3c";
        return; 
    }
    if( minutes > 59 || seconds > 59){
        infoEl.innerText = "Minutes and seconds must be between 0-59!";
        infoEl.style.color = "#e74c3c";
        return;
    }

    if (!timerStarted) {
        timeLeft = (parseInt(hourInput) * 3600) + (parseInt(minInput) * 60) + parseInt(secondInput);
        initialTime = timeLeft;
        timerStarted = true; 
    }

    updateTimer();

    const audio = new Audio("alarm.mp3");

    interval = setInterval(() => {
        timeLeft--;
        updateTimer();

        if(timeLeft <= 0){
            clearInterval(interval);
            interval = null;
            timerStarted = false; 
            audio.play();
            infoEl.innerText = "⏰Time's up!"
        } else {
            infoEl.innerText = "Continues to count"
            infoEl.style.color = "green";

        }
    }, 1000);

    infoEl.innerText = "Started";
    infoEl.style.color = "darkgreen";

}

function stopTimer(){
    if (interval) {
        clearInterval(interval);
        interval = null;
        infoEl.innerText = "Stopped."
        infoEl.style.color = "black";

    } else {
        infoEl.innerText = "You didn't even start."
    }

}

function resetTimer(){
    if(!timerStarted){
        infoEl.innerText = "Nothing to reset!";
        infoEl.style.color = "red";
        return;
    }
    clearInterval(interval);
    interval = null;
    timeLeft = initialTime;
    updateTimer();
    infoEl.innerText = "Reseted";
    infoEl.style.color = "darkgray";
    timerEl.innerText = "00:00:00"
    timerStarted = false;

}

startEl.addEventListener("click",startTimer);
stopEl.addEventListener("click",stopTimer);
resetEl.addEventListener("click",resetTimer);

//keyboard events

document.body.addEventListener("keydown",(event)=>{
    if(event.key === "Enter"){
        startTimer();
    }
    if(event.code === "Space"){
        event.preventDefault();
        stopTimer();
    }
    if(event.key === "r"){
        resetTimer();
    }
})
