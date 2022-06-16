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
// Dialogs
let isDial = true;
// Projects
const awaitID = [];                             // Project ID await
// Medias
const msgBip = new Audio('./assets/medias/notification.mp3');
msgBip.crossOrigin = "anonymous";
// Localstorage Languages
const Language = ["FR", "EN"];

// === CLASS TO LOAD DATAS.
class Initialize {
    constructor() {
        this.Projects = document.getElementsByClassName("projects")[0];
    }

    Start() {
        let language = new Languages().Get();
        const reqFile = new Request('./assets/datas/'+language+'.json');
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
            
            // Set default theme in localStorage.
            let theme = localStorage.getItem("theme");
            if(theme === null) localStorage.setItem("theme", "dark");
            const bodyTag = document.getElementsByTagName("body")[0];
            const linkTag = document.getElementById("switch-theme");
            if(theme == "light") {
                bodyTag.classList.add('light');
                linkTag.getElementsByTagName("i")[0].classList.replace("bx-sun", "bx-moon");
            }
            else {
                bodyTag.classList.remove('light');
                linkTag.getElementsByTagName("i")[0].classList.replace("bx-moon", "bx-sun");
            }

            // Set Language.
            new Languages().Set();

            // Setting up projects.
            this.setProjects();

            // Start chat.
            new Dialogs(0).Send();
        })
        .catch( (err) => console.log(err) );
    }

    // Setting up projects.
    setProjects() {
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

// === CLASS TO HANDLE LANGUAGES.
class Languages {
    constructor() {
        this.Languages = localStorage.getItem("language");
    }

    // Return language.
    Get() {
        if(!this.Languages) {
            localStorage.setItem("language",Language[0]);
            this.Languages = localStorage.getItem("language");
        }
        
        return this.Languages;
    }

    // Setting up words in selected language.
    Set() {
        if(!this.Languages) this.Languages = this.Get();
        document.getElementsByTagName("html")[0].setAttribute('lang', this.Languages.toLowerCase())
        // Set link Language.
        if(this.Languages == 'FR') document.getElementById("switch-language").innerText = Language[1];
        else document.getElementById("switch-language").innerText = Language[0];

        // Set words in nav bar.
        document.getElementById("ChatBox").innerText = Words[0].Chat;
        document.getElementById("Projects").innerText = Words[0].Projects;
        document.getElementById("Contact").innerText = Words[0].Contact;
        document.getElementById("MyResume").innerText = Words[0].Resume;

        const sections = document.getElementsByTagName("section");
        const title = document.getElementsByTagName("h2");
        title[0].innerText = Words[0].Welcome;
        title[1].innerText = Words[0].MyProjects;

        title[2].innerText = Words[0].ContactMe;
        sections[2].getElementsByTagName("p")[0].innerText = Words[0].ContactDesc;
        sections[2].getElementsByTagName("label")[0].innerText = Words[0].Name;
        sections[2].getElementsByTagName("label")[1].innerText = Words[0].Email;
        sections[2].getElementsByTagName("label")[2].innerText = Words[0].Message;
        
        sections[2].getElementsByTagName("input")[2].setAttribute('value', Words[0].Send);
    }
}

// === CLASS TO HANDLE DIALOGS.
class Dialogs {
    constructor(dial) {
        this.current = dial;
    }

    // Send current dialog in bubbles.
    Send() {
        const interval = this.GetInterval();
        if(Dials[this.current]) new Bubble(this.current,interval).Add();
    }

    // Send project dialog in bubbles.
    SendProject() {
        new Bubble(this.current,1).AddProject();
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

    // Add bubble in chatting box with dialog.
    Add() {
        if(this.dial == 0) this.AddWrite();
        
        const myBubble = document.createElement("div");
        myBubble.classList.add('bubble');
        // If dialogs is not complete.
        if(this.dial != Dials.length) {
            myBubble.innerHTML = `<div>${new Dialogs(this.dial).Format(Dials[this.dial])}</div>`;
            // Adding new message if user is not on chatting box.
            cPage != 0 ? (
                document.getElementsByClassName('mark')[0].setAttribute('style', 'display: block'),
                msgBip.play()
            ) : null;
        }

        let send = setInterval(() => {
            // If dialogs is not complete.
            if(this.dial != Dials.length) {
                this.Bubbles.appendChild(myBubble);

                if((this.dial+1) < Dials.length) new Dialogs((this.dial+1)).Send();
                    
                if(this.dial < Dials.length-1) this.AddWrite();
                else {
                    isDial = false;
                    awaitID.length ? ( new Dialogs(this.dial).SendProject(), this.AddWrite() ) : this.RemoveWrite();
                }
            }
            this.Bubbles.scrollTo({
                top:  this.Bubbles.scrollHeight,
                left: 0,
                behavior: 'smooth'
            });
            clearInterval(send);
        }, this.interval*1000);
    }

    // Add bubble in chatting box with Project.
    AddProject() {
        const myBubble = document.createElement("div");
        myBubble.classList.add('bubble');
        // If projects await.
        if(awaitID.length) {
            const id = awaitID[0];
            this.Project = document.createElement("div");
            this.Project.innerHTML = `<h3>${Projects[id].name}</h3>`;
            this.Project.innerHTML += `<p>${Projects[id].description}</p>`;
            this.Project.innerHTML += `<img src="${Projects[id].image}" alt="${Projects[id].name}">`;

            this.Project.innerHTML += `<h3>${Words[0].Techs}</h3>`;
            const techno = document.createElement("ul");
            techno.classList.add('techs');
            Projects[id].techs.forEach(tech => {
                techno.innerHTML += `<li>${tech}</li>`;
            })
            this.Project.appendChild(techno);

            myBubble.appendChild(this.Project);
            this.AddWrite();

            // Adding new message if user is not on chatting box.
            cPage != 0 ? (
                document.getElementsByClassName('mark')[0].setAttribute('style', 'display: block'),
                msgBip.play()
            ) : null;
        }
        
        let send = setInterval(() => {
            // If projects await.
            if(awaitID.length) {
                this.Bubbles.appendChild(myBubble);
                awaitID.splice(0, 1);

                awaitID.length ? new Dialogs(this.dial).SendProject() : this.RemoveWrite();
            }
            clearInterval(send);
        }, this.interval*1000);
    }

    AddWrite() {
        this.RemoveWrite();
        let newWrite = document.createElement("div");
        newWrite.classList.add('bubble');
        newWrite.innerHTML = this.layoutWrite;
        newWrite.id = 'Write';
        this.Bubbles.appendChild(newWrite);
        
        this.Bubbles.scrollTo({
            top:  this.Bubbles.scrollHeight,
            left: 0,
            behavior: 'smooth'
        });
    }

    RemoveWrite() {
        const writeBubble = document.getElementById('Write');
        if(writeBubble) writeBubble.remove();

        this.Bubbles.scrollTo({
            top:  this.Bubbles.scrollHeight,
            left: 0,
            behavior: 'smooth'
        });
    }
}

new Initialize().Start();
