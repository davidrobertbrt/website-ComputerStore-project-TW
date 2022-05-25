window.addEventListener("DOMContentLoaded",function(){
    const userContent = document.getElementById("user-list");
    const deleteUserBtns = userContent.querySelectorAll(".btn-stergereUser");

    deleteUserBtns.forEach((btn)=>{
        btn.addEventListener('click',function(){
            fetch(`${window.location.origin}/stergere-client/${btn.dataset.idclient}`,{
                method:'DELETE',
            })
            .then((res) => {return res.json();})
            .then((response)=>{
                return response.json();
            })
        });
    });
});