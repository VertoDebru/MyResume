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

class Initialize {
    Start() {
        const reqFile = new Request('./assets/datas/FR.json');
        // Get JSON datas
        fetch(reqFile).then(response => response.json())
        .then(data => {
            // Set dialogs in array.
            let dialogs = data.T;
            dialogs.forEach(dialog => Dials.push(dialog.dial));
            console.log(Dials);

            // Set text projects in array.
            let projects = data.P;
            projects.forEach(project => Projects.push(project.project));
            console.log(Projects);

            // Set words in array.
            let words = data.Words;
            words.forEach(word => Words.push(word));
            console.log(Words);

            // Set text others in array.
            let others = data.O;
            others.forEach(other => Others.push(other.other));
            console.log(Others);
        })
        .catch( (err) => console.log(err) );
    }
}

new Initialize().Start();
