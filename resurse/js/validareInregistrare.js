window.onload = function(){
    let formular = document.getElementById("form_inreg");
    if(formular)
    {
        formular.onsubmit = function(){
            let colectieInput = formular.getElementsByTagName("input");
            let colectieReq = [colectieInput["in-nume"],colectieInput["in-prenume"],colectieInput["in-username"],colectieInput["in-parola"],colectieInput["in-confirm-parola"],colectieInput["in-email"]];
            
            colectieInput["in-parola"].value = colectieInput["in-parola"].value.normalize();
            colectieInput["in-confirm-parola"].value = colectieInput["in-confirm-parola"].value.normalize();

            ///XSS ATTACK PROTECTION
            for(let input of colectieInput)
            {
                input.value.replace(">","&lt;");
                input.value.replace(">","&gt;");
            }
            
            ///verificare required
            for(let input of colectieReq)
            {
                if(emptyOrWhitespace(input.value) === true)
                {
                    alert(`[EROARE] Completați câmpul \"${input.name}\"`);
                    return false;
                }
            }


            
            if(colectieInput["in-parola"].value !== colectieInput["in-confirm-parola"].value)
            {
                alert('[EROARE] Parolele nu coincid!');
                return false;
            }

            let regexNumePrenume = new RegExp("^[a-z -]+$","i");

            if(!colectieInput["in-nume"].value.match(regexNumePrenume) || !colectieInput["in-prenume"].value.match(regexNumePrenume))
            {
                alert("[EROARE] Nume invalid! Sunt permise litere, spațiile și caracterul '\ - '\ ");
                return false;
            }

            ///prima alegere de validare: email cu regex
            let regexEmail = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

            if(!colectieInput["in-email"].value.match(regexEmail))
            {
                alert("[EROARE] Email invalid! Verificați ca emailul respectă acest format: \"exemplu@example.com\"");
                return false;
            }

            ///a doua alegere de validare (sa aleg si una pe server....?)
            let regexUsername = new RegExp("^[a-zA-Z0-9]([._-](?![._-])|[a-zA-Z0-9]){3,18}[a-zA-Z0-9]$");

            if(!colectieInput["in-username"].value.match(regexUsername))
            {
                alert("[EROARE] Username cu format gresit!");
                return false;
            }


            


        }
    }
}

function emptyOrWhitespace(str)
{
    return str === null || str.match(/^ *$/) !== null;
}