// Send infos project in chat box.
function getProject(id) {
    awaitID.push(id);
    if(!isDial) {
        new Bubble(Dials.length,1).AddProject();
        switchPage(0);
    }
}

// Navigation
function switchPage(Id)
{
    if(Id == 3) return window.open("./assets/moncv.pdf");

    const navList = document.getElementsByTagName("nav")[0].getElementsByTagName("li");
    for (let i = 0; i < navList.length; i++) {
        navList[i].classList.remove("active");
        if(i == Id) navList[i].classList.add("active");
    }
    
    let wrap = document.getElementsByClassName("wrap")[0];
    let widthWrap = wrap.clientWidth;
    let scrollX = Id * widthWrap;

    cPage = Id;
    if(cPage == 0) document.getElementsByClassName('mark')[0].setAttribute('style', '');
    wrap.scrollTo({
        left: scrollX,
        behavior: 'smooth'
    });
}

// Switch Language.
function switchLang() {
    let language = localStorage.getItem("language");
    if(language == "FR") localStorage.setItem("language", "EN");
    if(language == "EN") localStorage.setItem("language", "FR");
    window.location.reload();
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

// Post message. !!! BUG !!!
function postForm()
{
    const Content = document.getElementsByTagName("form")[0];
    let name = document.getElementById("Name").value;
    let email = document.getElementById("Email").value;
    let message = document.getElementById("Message").value;
    
    // Check forms
    if(name.length <= 2  || message.length <= 20 || !checkEmail()) {
        if(document.getElementById("ErrorForm")) document.getElementById("ErrorForm").remove();
        // Create Div content message sended
        const validDiv = document.createElement("div");
        validDiv.id = "ErrorForm";
        validDiv.innerHTML = `<h3>${Words[0].ErrorForm}</h3>`;
        Content.insertBefore(validDiv, Content.firstChild);
        setInterval(() => {
            validDiv.remove();
        }, 9000);
        return;
    }

    const reqFile = new Request('https://vervoot.alwaysdata.net/js/post.php');
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("message", message);
    const options = {
        mode: 'no-cors',
        method: 'POST',
        headers: {'Content-Type':'application/json','Accept': 'application/json','Referer': 'https://vervoot.alwaysdata.net/', 'Access-Control-Allow-Origin': 'http://127.0.0.1:5500/'},
        body: formData
    };

    fetch(reqFile, options)
    .then((res) => {
        if(document.getElementById("ErrorForm")) document.getElementById("ErrorForm").remove();

        // Create Div content message sended
        const validDiv = document.createElement("div");
        if(res.ok) {
            validDiv.id = "ValidForm";
            validDiv.innerHTML = `<h3>${Words[0].Sent}</h3>`;
            Content.insertBefore(validDiv, Content.firstChild);
        }
        else {
            validDiv.id = "ErrorForm";
            validDiv.innerHTML = `<h3>${Words[0].ErrorSend}</h3>`;
            Content.insertBefore(validDiv, Content.firstChild);
        }
        setInterval(() => { validDiv.remove(); }, 9000);
    })
    .catch((err) => {
        console.log(err);
        validDiv.id = "ErrorForm";
        validDiv.innerHTML = `<h3>${Words[0].Error}</h3><p>${err}</p>`;
        Content.insertBefore(validDiv, Content.firstChild);
    });
}

function checkEmail() {
    let email = document.getElementById("Email");
    let regEmail = new RegExp(/^[a-zA-Z0-9.-]+@[a-zA-Z0-9.-]+(\.[a-zA-Z]{2,})/g);
    if(!email.value.match(regEmail)) {
      // Change style
      email.classList.add("error");
      email.focus();
      return false;
    }
    else {
        // Change style
        email.classList.remove("error");
        return true;
    }
}
