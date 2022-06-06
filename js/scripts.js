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
 *  Author : Tony Vervoot - Create : 06/01/2022
 *  Update : 06/06/2022
 * ************************************************************ */
// RegExp
const reg = RegExp("(\{(.*?)\})","g");
const regSimplify = RegExp(/[{}]/g);
const regPre = RegExp(/[A-Z]{1}/g);
const regId = RegExp(/[0-9]{1,2}/g);
// Dialogs, Projects, Words, Others datas
const Dials = [];
const Projects = [];
const Words = [];
const Others = [];
// Navigation
let cPage = 0;                                  // Current page.
// Medias
const msgBip = new Audio('./assets/medias/notification.mp3');
msgBip.crossOrigin = "anonymous";

// === CLASS TO LOAD DATAS.
class Initialize {
    constructor() {
        this.Projects = document.getElementsByClassName("projects")[0];
    }

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
            projects.forEach(project => Projects.push(project));

            // Set words in array.
            let words = data.Words;
            words.forEach(word => Words.push(word));

            // Set text others in array.
            let others = data.O;
            others.forEach(other => Others.push(other.other));
            
            // Setting up projects.
            this.Set();

            // Start chat.
            new Dialogs(0).Send();
        })
        .catch( (err) => console.log(err) );
    }

    // Setting up projects.
    Set() {
        Projects.forEach((project, index) => {
            const myProject = document.createElement("div");
            myProject.classList.add('project');
            myProject.innerHTML = `<h3>${project.name}</h3>`;
            myProject.innerHTML += `<img src="${project.image}" alt="${project.name}" onclick="getProject(${index})">`;
            myProject.innerHTML += `<span>${Words[0].More}</span>`;

                const myFooter = document.createElement("div");
                myFooter.classList.add('foot');
                if(project.demo) myFooter.innerHTML += `<a href="${project.demo}" target="_blank" rel="noopener">${Words[0].Demo} <i class='bx bx-link-external max-size'></i></a>`;
                if(project.github) myFooter.innerHTML += `<a href="${project.github}" target="_blank" rel="noopener">${Words[0].Project} <i class='bx bxl-github max-size'></i></a>`;
                myProject.appendChild(myFooter);

            this.Projects.appendChild(myProject);
        });
    }
}

// === CLASS TO HANDLE DIALOGS.
class Dialogs {
    constructor(dial) {
        this.current = dial;
    }

    // Send current dialog in bubbles.
    Send() {
        const currentDial = this.Format(Dials[this.current]);
        const interval = this.GetInterval();
        //console.log(`Dialog : ${this.current} / Interval : ${interval} / Next : ${next}`);
        new Bubble(this.current,interval).Add(currentDial);
    }

    // Remove all {Tags} in text and return it.
    Format(text) {
        if(text == null || text == "undefined")
            return console.warn("Dialogs Format -> Error no text received !");
        
        let formated = text.replace(reg, "");
        return formated;
    }
    
    // Get Interval in dialog.
    GetInterval() {
        const interval = parseInt(this.FirstTag().match(regId)[0]);
        return interval;
    }
    
    // Get the first tag in text and return it without {}.
    FirstTag()
    {
        const fTag = this.GetTag(Dials[this.current], 0).replace(regSimplify, "");
        return fTag;
    }

    // Get Tag by position in text.
    GetTag(text, position)
    {
        if(text == null || text == "undefined")
            return console.log("Tag.Get -> Error no text received !");
        if(position == null)
            return console.log("Tag.Get -> Error no position received !");
        
        let tag = text.match(reg)[position];
        return tag;
    }
}

/* === CLASS TO HANDLE BUBBLES.
 * Add(true/false) = For add bubble in chatting box.
 *  TRUE  : if you need add writing text.
 *  FALSE : if you send message.
 * === */
class Bubble {
    constructor(dial, interval) {
        this.Bubbles = document.getElementsByClassName("bubbles")[0];
        this.layoutWrite = `<ul class="write">
            <li class="write-point"></li>
            <li class="write-point"></li>
            <li class="write-point"></li>
        </ul>${Words[0].Write}`;
        this.dial = dial;
        this.interval = interval;
    }

    // Add bubble in chatting box whit text/not.
    Add(text) {
        const writeBubble = document.getElementById('Write');
        const myBubble = document.createElement("div");
        myBubble.classList.add('bubble');
        myBubble.innerHTML = `<div>${text}</div>`;

        let send = setInterval(() => {
            if(writeBubble) writeBubble.remove();
            this.Bubbles.appendChild(myBubble);

            this.dial = this.dial+1;
            if(this.dial !== Dials.length) {
                let newWrite = document.createElement("div");
                newWrite.classList.add('bubble');
                newWrite.innerHTML = this.layoutWrite;
                newWrite.id = 'Write';
                this.Bubbles.appendChild(newWrite);
                // Adding new message if user is not on chatting box.
                if(cPage != 0)
                {
                    document.getElementsByClassName('mark')[0].setAttribute('style', 'display: block');
                    msgBip.play();
                }
                new Dialogs(this.dial).Send();
            }

            this.Bubbles.scrollTo({
                top:  this.Bubbles.scrollHeight,
                left: 0,
                behavior: 'smooth'
            });
            clearInterval(send);
        }, this.interval*1000);
    }
}

new Initialize().Start();
