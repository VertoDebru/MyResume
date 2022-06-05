/* ************************************************************ *
 *  File : scripts.js
 *  ===========================================================
 *  Description : 
 *  {W5}Text here{T1}
 *  {W5} => First Tag is for Time await before see text.
 *  5 = number of seconds before see text.
 *  {T1} => Last Tag is for switch to the next text.
 *  1 = Id of the next text.
 *  You can adding more Tags between First an Last Tag.
 *  See more Tags in class 'Tag'.
 *  ===========================================================
 *  Author : Tony Vervoot - Create : 05/27/2021
 *  Update : 06/05/2021
 * ************************************************************ */
// Dialogs, Projects, Words, Others datas
const Dials = [];
const Projects = [];
const Words = [];
const Others = [];
// Medias
const msgBip = new Audio('./assets/medias/notification.mp3');

// === CLASS TO LOAD DATAS.
class Initialize {
    Start() {
        const reqFile = new Request('./assets/datas/FR.json');
        // Get JSON datas
        fetch(reqFile).then(response => response.json())
        .then(data => {
            // Set dialogs in array.
            let dialogs = data.T;
            dialogs.forEach(dialog => Dials.push(dialog.dial));

            // Set text projects in array.
            let projects = data.P;
            projects.forEach(project => Projects.push(project.project));

            // Set words in array.
            let words = data.Words;
            words.forEach(word => Words.push(word));

            // Set text others in array.
            let others = data.O;
            others.forEach(other => Others.push(other.other));

            // Start chat.
            new Bubble().Add(true);
        })
        .catch( (err) => console.log(err) );
    }
}

/* === CLASS TO HANDLE BUBBLES.
 * Add(true/false) = For add bubble in chatting box.
 *  TRUE  : if you need add writing text.
 *  FALSE : if you send message.
 * === */
class Bubble {
    constructor() {
        this.Bubbles = document.getElementsByClassName("bubbles")[0];
        this.layoutWrite = `<ul class="write">
            <li class="write-point"></li>
            <li class="write-point"></li>
            <li class="write-point"></li>
        </ul>${Words[0].Write}`;
    }

    // Add bubble in chatting box.
    Add(isWrite) {
        const myBubble = document.createElement("div");
        myBubble.classList.add('bubble');

        if(isWrite) myBubble.innerHTML = this.layoutWrite;
        else myBubble.innerHTML = 'TEST';

        console.log("Add Bubble");
        this.Bubbles.appendChild(myBubble);
    }
}

new Initialize().Start();
