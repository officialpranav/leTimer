let startTime, updatedTime, difference, tInterval, lastLapTime, pausedTime;
let running = false;

const timeDisplay = document.getElementById('stopwatch');
const startStopButton = document.getElementById('start-stop');
const resetButton = document.getElementById('reset');
const lapButtons = document.querySelectorAll('#adjusting-parameters-lap, #other-lap, #material-handling-lap, #adding-die-lap, #lin-gauge-lap, #measuring-lap, #removing-die-lap, #first-off-lap');
const lapsContainer = document.getElementById('laps-list');
const lapNameInput = document.getElementById('stopwatch-name');
const shareButton = document.getElementById('share');

startStopButton.addEventListener('click', startStopTimer);
resetButton.addEventListener('click', resetTimer);
lapButtons.forEach(button => button.addEventListener('click', addLap));
shareButton.addEventListener('click', shareLaps);

function startStopTimer() {
    if (!running) {
        startTime = new Date().getTime() - (difference || 0);
        lastLapTime = lastLapTime || startTime;
        tInterval = setInterval(updateTime, 10);
        startStopButton.innerText = 'Stop';
        running = true;
    } else {
        clearInterval(tInterval);
        pausedTime = new Date().getTime();
        startStopButton.innerText = 'Start';
        running = false;
    }
}

function resetTimer() {
    clearInterval(tInterval);
    running = false;
    difference = 0;
    lastLapTime = null;
    timeDisplay.innerHTML = '0:00:00.000';
    startStopButton.innerText = 'Start';
    lapsContainer.innerHTML = '';
}

function updateTime() {
    updatedTime = new Date().getTime();
    difference = updatedTime - startTime;
    let hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((difference % (1000 * 60)) / 1000);
    let milliseconds = Math.floor((difference % 1000) / 10);
    timeDisplay.innerHTML = `${hours}:${pad(minutes)}:${pad(seconds)}.${pad(milliseconds, 3)}`;
}

function pad(number, digits = 2) {
    return number.toString().padStart(digits, '0');
}

function addLap(event) {
    if(!running) return
    const lapName = event.target.innerText;
    const currentTime = running ? new Date().getTime() : pausedTime;
    const lapDuration = currentTime - lastLapTime;
    lastLapTime = currentTime;

    let hours = Math.floor((lapDuration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((lapDuration % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((lapDuration % (1000 * 60)) / 1000);
    let milliseconds = Math.floor((lapDuration % 1000) / 10);

    const lapTime = `${hours}:${pad(minutes)}:${pad(seconds)}.${pad(milliseconds, 3)}`;
    const lapElement = document.createElement('li');
    // lapElement.className = 'list-group-item w-100';
    lapElement.innerText = `${lapName}: ${lapTime}`;
    if(lapsContainer.firstChild){
        lapsContainer.insertBefore(lapElement, lapsContainer.firstChild);
    } else {
        lapsContainer.appendChild(lapElement);
    }
}

function compileLapsToCSV() {
    let csvContent = `${lapNameInput.value || 'Unnamed'}\nLap Name, Lap Time\n`;
    const lapElements = lapsContainer.getElementsByTagName('li');
    for (let i = lapElements.length - 1; i >= 0; i--) {
        const [lapName, lapTime] = lapElements[i].innerText.split(': ');
        csvContent += `${lapName}, ${lapTime}\n`;
    }
    return csvContent;
}

function shareLaps() {
    const csvContent = compileLapsToCSV();
    const mailtoLink = `mailto:?subject=Stopwatch Laps&body=${encodeURIComponent(csvContent)}`;
    window.location.href = mailtoLink;
}