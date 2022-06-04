let cPage = 0;                                  // Defined the current page.

// Navigation
function switchPage(Id)
{
    const navList = document.getElementsByTagName("nav")[0].getElementsByTagName("li");
    for (let i = 0; i < navList.length; i++) {
        navList[i].classList.remove("active");
        if(i == Id) navList[i].classList.add("active");
    }
    
    let wrap = document.getElementsByClassName("wrap")[0];
    let widthWrap = wrap.clientWidth;
    let scrollX = Id * widthWrap;

    cPage = Id;
    wrap.scrollTo({
        left: scrollX,
        behavior: 'smooth'
    });
}

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