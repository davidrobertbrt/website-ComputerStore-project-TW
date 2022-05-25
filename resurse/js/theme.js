window.addEventListener("DOMContentLoaded",function(){
    var crStatusTheme = localStorage.getItem("tema");
    btn = document.getElementById("btn-toggleTheme");

    if(!crStatusTheme)
    {
        localStorage.setItem("tema","light");
        btn.innerHTML = `<i class="fa-solid fa-moon"></i>`;
    }
    else{
        if(crStatusTheme === "dark")
        {
            document.body.classList.add("dark");
            btn.innerHTML = `<i class="fa-solid fa-sun"></i>`;
        }
        else
            btn.innerHTML = `<i class="fa-solid fa-moon"></i>`;
    }

    if(btn)
    {
        btn.onclick = function(){
            document.body.classList.toggle("dark");
            if(document.body.classList.contains("dark"))
            {
                localStorage.setItem("tema","dark");
                btn.innerHTML = `<i class="fa-solid fa-sun"></i>`;
            }
            else
            {
                localStorage.setItem("tema","light");
                btn.innerHTML = `<i class="fa-solid fa-moon"></i>`;
            }
        }
    }



});