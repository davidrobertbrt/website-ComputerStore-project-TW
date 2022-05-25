window.addEventListener("load",function(){
    var prodSel = localStorage.getItem("cart");
    if(prodSel){
        var arrayProdSel = JSON.parse(prodSel);
        var arrayProdId = arrayProdSel.map(prod => prod.id);
        fetch('/extract/ProdSelected',{
            method:'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
             },
            body: JSON.stringify({
                produseID: arrayProdId
            })
        }).then(function(rasp){console.log(rasp); temp = rasp.json(); console.log(temp); return temp;})
        .then(function(obJson){
            console.log(obJson);
            var sumTotal = 0;
            var map = new Map();
            for(let prod of arrayProdSel)
            {
                map.set(prod.id,prod.cant);
            }

            console.log(map);

            var template = document.querySelector("#productTemplate");
            console.log(template);
            for(let prod of obJson)
            {
                sumTotal += (prod.pret * map.get(prod.id));

                var clone = template.content.cloneNode(true);

                var div = clone.querySelector(".product");
                var nume = clone.querySelector(".product-nume");
                var pret = clone.querySelector(".product-pret");
                var cantitate = clone.querySelector(".product-cantSelected");
                var categorie = clone.querySelector(".product-categorie");
                var stare = clone.querySelector(".product-stare");
                var producator = clone.querySelector(".product-producator");
                var gaming = clone.querySelector(".product-gaming");
                var buttonStergere = clone.querySelector(".delete-product");
            
                div.setAttribute('id',`${prod.id}`);
                nume.textContent = prod.nume;
                pret.textContent = prod.pret * map.get(prod.id);
                cantitate.textContent = map.get(prod.id);
                categorie.textContent = prod.categorie;
                stare.textContent = prod.stare;
                producator.textContent = prod["producator_produs"];
                gaming.textContent = prod.gaming;
                buttonStergere.id = `${prod.id}`;
                buttonStergere.addEventListener("click",(e) => {
                    let cart = null;
                    if(localStorage.getItem("cart"))
                        cart = JSON.parse(localStorage.getItem('cart'));
                
                    let indexStergere = null;
                    let deleteId = parseInt(e.target.id);
                    
                    cart.forEach((produs,index)=>{
                        if(produs.id === deleteId)
                            indexStergere = index;
                    });
    
                    if(!isNaN(indexStergere))
                        cart.splice(indexStergere,1);

                    localStorage.setItem("cart",JSON.stringify(cart));
                    location.reload();
                });
            

                template.parentNode.appendChild(clone);
            }


            document.querySelector(".pret-total").textContent = sumTotal;

        });

        document.getElementById("cumparaProduse").onclick = function(){
            var arrayProduse = JSON.parse(localStorage.getItem("cart"));
            fetch("/cumpara",{
                method: "POST",
                headers:{'Content-Type':'application/json'},
                mode:'cors',
                cache:'default',
                body:JSON.stringify({produseSelectate: arrayProduse})
            }).then((rasp) =>{console.log(rasp); return rasp.text()})
            .then((raspunsText)=>{
                console.log(raspunsText);
                let p = document.createElement("p");
                p.innerHTML = raspunsText;
                document.getElementsByTagName("main")[0].innerHTML = "";
                document.getElementsByTagName("main")[0].appendChild(p)
                if(raspunsText.includes("Produse cumparate!")){
                    localStorage.removeItem("cart");
                }
            });
        };
    }
    else
    {
        document.getElementsByClassName("main")[0].innerHTML = "<p class=\"box\">Niciun produs în coș....</p>";
    }

});

