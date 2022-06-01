let cPage = 0;                                  // Defined the current page.

function SwitchPage(Id)
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
