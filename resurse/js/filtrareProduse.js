window.addEventListener("DOMContentLoaded",function(){
    let btnAscending = document.getElementById("btn-asc");
    let btnDescending = document.getElementById("btn-desc");
    let btnPret = document.getElementById("btn-pret");
    let btnFilter = document.getElementById("btn-filter");
    let btnResetare = document.getElementById("btn-reset");
    let rangePretInput = document.getElementById("in-pret");

    function startFiltrare()
    {
        const articole = document.getElementsByClassName("produs");

        for(let art of articole)
        {
            art.style.display="none";
            var numeProd = art.getElementsByClassName("val-nume")[0].innerText.toLowerCase();
            var inputNume = document.getElementById("in-nume").value;
            var condNume = true;

            if(inputNume !== "")
            {
                if(inputNume.includes("*") === true)
                {
                    condNume = false;
                    var splitInputNume = inputNume.split('*');
                    if(numeProd.includes(splitInputNume[0]) && numeProd.includes(splitInputNume[1]))
                        condNume = true;
                }
                else{
                    var condNume = numeProd.includes(inputNume);
                }
            }
            else
                alert("Nu ai completat un criteriu!");

            var pretProd = parseFloat(art.getElementsByClassName("val-pret")[0].innerText);
            var condPret = pretProd >= parseFloat(document.getElementById("in-pret").value);

            var condTag = true;
            if(document.getElementById("in-tag").value !== "")
            {
                var tagInput = document.getElementById("in-tag").value.replace(/\s+/g, '').split(',');
                var tagsProduct = art.getElementsByClassName("val-taguri")[0].textContent.split(',');
                condTag = tagInput.every(tagProd => tagsProduct.includes(tagProd));
            }

            var radStoc = document.getElementsByName("stoc-produs");
            for(let rad of radStoc)
            {
                if(rad.checked === true)
                {
                    var alegereStoc = rad.value;
                    break;
                }
            }
            
            var stocProd = parseInt(art.getElementsByClassName("val-stoc")[0].innerText);
            var condStoc = false;

            switch(alegereStoc)
            {
                case "1": condStoc = (stocProd >= 10); break;
                case "2": condStoc = (stocProd >= 5 && stocProd < 10); break;
                case "3": condStoc = (stocProd === 0); break;
                default: condStoc = true; break;
            }

            var producatorSelected = [];
            var producatorList = document.getElementById("in-producator");
            for(let option of producatorList.options)
            {
                if(option.selected === true)
                    producatorSelected.push(option.value);
            }

            var produsProducator = art.getElementsByClassName("val-producator")[0].innerText;

            if(producatorSelected.length > 0)
                condProducator = (producatorSelected.indexOf(produsProducator) > -1);
            else
                condProducator = true;

            var inputStareProd = document.getElementById("in-stare").value;
            var condStare = true;
            if(inputStareProd !== "")
            {
                if(inputStareProd !== art.getElementsByClassName("val-stare")[0].innerText)
                    condStare = false;
            }
            else
                alert("Nu ai completat un criteriu!");
            
            var checkCategorie = document.getElementsByName("cat-produs");
            var catSelected = [];
            var condCategorie = true;

            for(let checkBox of checkCategorie)
            {
                if(checkBox.checked === true && checkBox.disabled === false)
                    catSelected.push(checkBox.value);
            }

            var prodCategorie = art.getElementsByClassName("val-categorie")[0].innerHTML;

            condCategorie = (catSelected.indexOf(prodCategorie)> -1);

            if(condNume && condPret && condTag && condStoc && condProducator && condStare && condCategorie)
                art.style.display="block";

        }
    }

    function customSort(sign)
    {
        let articoleCollection = document.getElementsByClassName("produs");
        let articole = Array.from(articoleCollection);

        articole.sort(function(p1,p2){
            let numePair = [p1.getElementsByClassName("val-nume")[0].innerHTML,p2.getElementsByClassName("val-nume")[0].innerHTML];
            let descPair = [p1.getElementsByClassName("val-descriere")[0].innerHTML,p2.getElementsByClassName("val-descriere")[0].innerHTML];

            if(numePair[0] != numePair[1])
                return sign*numePair[0].localeCompare(numePair[1]);
            else
                return sign*(descPair[0].length-descPair[1].length);
        });

        for(let prod of articole)
            prod.parentNode.appendChild(prod);
    }

    function calcPret()
    {
        let articoleCollection = document.getElementsByClassName("produs");
        let articole = Array.from(articoleCollection);
        let selectedProducts = false;
        let rez = 0;

        for(let prod of articole)
        {
            if(prod.getElementsByClassName("in-add-produs")[0].checked === true){
                selectedProducts = true;
            }
        }

        if(selectedProducts === true)
        {
            for(let prod of articole)
            {
                let pretCr = parseFloat(prod.getElementsByClassName("val-pret")[0].innerHTML);
                if(prod.getElementsByClassName("in-add-produs")[0].checked === true){
                    rez += pretCr;
                }
            }
        }
        else
        {
            for(let prod of articole)
            {
                let pretCr = parseFloat(prod.getElementsByClassName("val-pret")[0].innerHTML);
                rez += pretCr;
            }

            rez /= articole.length;
        }


        createBoxCalcPret(rez,selectedProducts);
        setTimeout(function(){document.getElementById("rez-pret").remove()},2000);

    }

    function createBoxCalcPret(val,initSelect)
    {
        const boxAfisare = document.createElement('div');
        boxAfisare.classList.add('box');
        boxAfisare.id = "rez-pret";
        boxAfisare.style.position = "fixed";
        boxAfisare.style.zIndex = "3"; boxAfisare.style.bottom = "0"; boxAfisare.style.right = "0";
        boxAfisare.style.backgroundColor = "orange";
        
        let rezPret = document.createElement("span");

        if(initSelect === true)
            rezPret.innerHTML += `Prețul produselor tale este momentan: ${val}`;
        else
            rezPret.innerHTML += `Media preturilor este momentan:${val}`;

        rezPret.style.color = "white";

        boxAfisare.appendChild(rezPret);
        document.body.append(boxAfisare);
    }

    function minMaxPret()
    {
        let articoleCollection = document.getElementsByClassName("produs");
        let articole = Array.from(articoleCollection);
        let selectedProducts = false;
        let rez = 0;
        let minPret = Number.MAX_VALUE;
        let maxPret = Number.MIN_VALUE;

        for(let prod of articole)
        {
            const pretCr = parseFloat(prod.getElementsByClassName("val-pret")[0].innerHTML);
            minPret = Math.min(pretCr,minPret);
            maxPret = Math.max(pretCr,maxPret);
        }

        return [minPret,maxPret];
    }



    function priceRangeInit()
    {
        var rangePret = minMaxPret();
        const minRangeLabel = document.getElementById("min-pret");
        const maxRangeLabel = document.getElementById("max-pret");

        minRangeLabel.textContent = rangePret[0].toString();
        maxRangeLabel.textContent = rangePret[1].toString();

        rangePretInput.min = rangePret[0];
        rangePretInput.max = rangePret[1];
        rangePretInput.value = rangePretInput.min;


        document.getElementById("infoRange").innerText = `(${rangePretInput.value})`;
    }

    priceRangeInit();

    rangePretInput.onchange = function(){
        var info = document.getElementById("infoRange");
        if(!info)
        {
            info = document.createElement("span");
            info.id="infoRange"
            this.parentNode.appendChild(info);
        }

        info.innerText=`(${this.value})`;
    }



    function CartStart()
    {
        var listCheckbox = document.getElementsByClassName("in-add-produs");
        var cart = null;
        if(localStorage.getItem("cart"))
            cart = JSON.parse(localStorage.getItem('cart'));
        
        if(cart !== null)
        {
            cart.forEach((produs,index)=>{
                var indexCheckbox = document.querySelector(`[data-idproduct=\"${produs.id}\"`);
                if(typeof indexCheckbox !== 'undefined')
                {
                    indexCheckbox.checked = true;
                    const cantSelector = document.querySelector('#in-cantitate-'+ produs.id);
                    cantSelector.value = produs.cant;
                }
            });
        }
    }

    function CartManage(idProdus,status)
    {
        let cart = null;
        if(status === true)
        {
            const id = parseInt(idProdus);
            const cantSelector = document.querySelector('#in-cantitate-'+ id);
            const cant = cantSelector.value ? parseInt(cantSelector.value) : 1;

            if(!localStorage.getItem("cart"))
                cart = [{id,cant}];
            else
                cart = JSON.parse(localStorage.getItem('cart'));

            const produsExistent = cart.filter(function(e){return e.id == id;});

            if(produsExistent.length > 0)
            {
                let indexProdus = null;
                cart.forEach((produs,index)=>{
                    if(produs.id === produsExistent[0].id)
                    {
                        indexProdus = index;
                        return;
                    }
                });
                cart[indexProdus].cantitate += cant;
            }
            else
                cart.push({id,cant});
        }
        else
        {
            if(localStorage.getItem("cart"))
                cart = JSON.parse(localStorage.getItem('cart'));
            
                let indexStergere = null;
                cart.forEach((produs,index)=>{
                    if(produs.id === idProdus)
                        indexStergere = index;
                });

                cart.splice(indexStergere,1);
        }

        localStorage.setItem("cart",JSON.stringify(cart));
    }


    let listCheckbox = document.getElementsByClassName("in-add-produs");

    for(let i = 0; i < listCheckbox.length; i++)
        listCheckbox[i].addEventListener('click',() => {CartManage(listCheckbox[i].dataset.idproduct,listCheckbox[i].checked)},false);

    CartStart();


    btnAscending.onclick = function(){
        customSort(1)
    };

    btnDescending.onclick = function(){
        customSort(-1)
    };

    btnPret.onclick = function(){
        calcPret();
    };

    btnFilter.onclick = function(){
        startFiltrare();
    }

    btnResetare.onclick = function(){
        const articole = document.getElementsByClassName("produs");
        for(let art of articole)
            art.style.display = "block";

        
        document.getElementById("in-nume").value = "";
        document.getElementById("in-tag").value = "";
        priceRangeInit();

        var producatorList = document.getElementById("in-producator");
        for(let option of producatorList.options)
            option.selected = false;
        
        var radStoc = document.getElementsByName("stoc-produs");
        radStoc[0].checked = true;

        var checkCategorie = document.getElementsByName("cat-produs");

        for(let checkBox of checkCategorie)
            checkBox.checked = true;

        document.getElementById("in-stare").selectedIndex = 0;

    }

    
})