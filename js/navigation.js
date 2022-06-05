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

// BUG !!!
function postForm()
{
    const Content = document.getElementsByTagName("form")[0];
    let name = document.getElementById("Name").value;
    let email = document.getElementById("Email").value;
    let message = document.getElementById("Message").value;

    const reqFile = new Request('https://vervoot.alwaysdata.net/scripts/post.php');
    const data = { name: name, email: email, message: message };
    const options = {
        mode: 'no-cors',
        method: 'POST',
        headers: {'Content-Type':'application/json','Accept': 'application/json','Referer': 'https://vervoot.alwaysdata.net/', 'Access-Control-Allow-Origin': 'http://127.0.0.1:5500/'},
        body: JSON.stringify(data)
    };

    fetch(reqFile, options).then(response => response.json())
    .then((res) => {
        console.log(res);
        // Create Div content message sended
        const validDiv = document.createElement("div");
        if(res.ok) {
            this.setState({ success: true });
            validDiv.id = "ValidForm";
            validDiv.innerHTML = "<h2>Success !</h2>";
            Content.insertBefore(validDiv, Content.firstChild);
        }
        else {
            this.setState({ success: false });
            validDiv.id = "ErrorForm";
            validDiv.innerHTML = `<h2>Error !</h2>`;
            Content.insertBefore(validDiv, Content.firstChild);
        }
    })
    .catch((err) => {
        console.log(err);
        this.setState({ success: false });
        validDiv.id = "ErrorForm";
        validDiv.innerHTML = `<h2>Error !</h2><p>${err}</p>`;
        Content.insertBefore(validDiv, Content.firstChild);
    });

    /*
    $.ajax({
        type : "POST",
        url  : "./js/post.php",
        data : data,
        success: function(res)
        {
            // Create Div content message sended
            const validDiv = document.createElement("div");
            if (res == 'success'){
                validDiv.id = "ValidForm";
                validDiv.innerHTML = "<h2>Success !</h2>";
                Content.insertBefore(validDiv, Content.firstChild);
            } else {
                if(document.getElementById("ErrorForm")) document.getElementById("ErrorForm").remove();
                validDiv.id = "ErrorForm";
                validDiv.innerHTML = "<h2>Error !</h2>";
                Content.insertBefore(validDiv, Content.firstChild);
            }
        }
    });
    */
}
