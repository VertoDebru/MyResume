// Switch Theme.
function switchTheme() {
    const bodyTag = document.getElementsByTagName("body")[0];
    const linkTag = document.getElementById("switch-theme");

    if(bodyTag.classList.length) {
        linkTag.getElementsByTagName("i")[0].classList.replace("bx-moon", "bx-sun");
        bodyTag.classList.remove('light');
    }
    else {
        linkTag.getElementsByTagName("i")[0].classList.replace("bx-sun", "bx-moon");
        bodyTag.classList.add('light');
    }
}