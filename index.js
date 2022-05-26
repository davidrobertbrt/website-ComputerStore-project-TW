//librarii
const express = require('express');
const fs = require('fs');
const ejs = require('ejs');
const path = require('path');
const sass = require('sass');
const formidable = require('formidable');
const { Client } = require("pg");
const { url } = require('inspector');
const mime = require('mime-types');
const utils = require('pg/lib/utils');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const helmet = require('helmet');
const session = require('express-session');
var QRCode = require('qrcode');
const html_to_pdf = require('html-pdf-node');
const juice = require('juice');
const { Server } = require('http');
const { render } = require('express/lib/response');
const { nonVisualElements } = require('juice');
const sharp = require('sharp');
const resize = require('sharp/lib/resize');
const xmljs = require('xml-js');
const socket = require('socket.io');
const { parse } = require('path');
//configurare server
const server = express();

var client;

const varGlobale={
    protocol:null,
    numeDomeniu:null,
    port:process.env.PORT || 8080,
    saltTemplate:"localhost",
    sirAlpha:"",
    obImagini:null,
    obDynamicImg:null,
    cale_qr: null,
    xmlPath: path.join(__dirname,"resurse","xml","contact.xml")
};

server.use(session({
    secret:"abcdefg",
    resave: true,
    saveUninitialized: false
}));


if(process.env.SITE_ONLINE){
    varGlobale.protocol="https://";
    varGlobale.numeDomeniu="proiect-pixelpro-tw.herokuapp.com"//atentie, acesta e domeniul pentru aplicatia mea; voi trebuie sa completati cu datele voastre
    client=new Client({ 
        user: 'jjzzsqymwymdxl', 
        password:'567183f9f64d5a68f93f04620101ac1ec79306f426d4de3d1262eb95333c501b', 
        database:'dcbo1pdcg5f8is', host:'ec2-52-48-159-67.eu-west-1.compute.amazonaws.com', port:5432,
        ssl: {
            rejectUnauthorized: false
          } });
}
else{
    client = new Client({
        user: "postgres",
        password: "root",
        database: "db-pixelpro",
        host:"localhost",
        port: 5432
    });
    varGlobale.protocol="http://";
    varGlobale.numeDomeniu="localhost:8080";
}

client.connect();
server.set('view engine','ejs');
//server.use("/resurse",express.static(__dirname+"/resurse"));
server.use(express.static('resurse'));
server.use(express.static('uploads'));
server.use(express.json());
server.use(express.urlencoded({extended: false}));
server.use(helmet.frameguard());
server.listen(varGlobale.port);


function generareSirAlpha(){
    varGlobale.sirAlpha="";
    var intervaleSir = [[65,90],[97,122]];
    for(let interval of intervaleSir)
    {
        for(let i = interval[0]; i<=interval[1]; i++)
            varGlobale.sirAlpha += String.fromCharCode(i);
    }
}

function getIP(req)
{
    ///stocam ip-ul utilizatorului
    let ip = req.headers["x-forwarded-for"];
    if(ip){
        let headerSplit = ip.split(",");
        return headerSplit[headerSplit.length-1];
    }
    else
        return req.connection.remoteAddress;
}

function QRCodeGeneration()
{
    varGlobale.cale_qr = "./resurse/imagini/qrcode";
    if(fs.existsSync(varGlobale.cale_qr))
        fs.rmSync(varGlobale.cale_qr,{force:true, recursive:true});
    fs.mkdirSync(varGlobale.cale_qr);

    client.query("SELECT ID FROM produse",function(err,rez){
        console.log("[DATABASE] Accesate id produse");
        for(let prod of rez.rows)
        {
            console.log(`[GENERARE-QR-CODE] COD QR PT PRODUSUL ${prod.id}`)
            let cale_prod = varGlobale.protocol+varGlobale.numeDomeniu+"/produs/"+prod.id;
            QRCode.toFile(varGlobale.cale_qr+"/"+prod.id+".png",cale_prod);
        }
    });

}


function importStatusAssets()
{
    var fisierJSON = fs.readFileSync(path.normalize(__dirname + "/resurse/json/status-codes.json"),{},function(err, data){ console.log(data);}).toString("utf-8");
    varGlobale.obErori = JSON.parse(fisierJSON);
}


function renderStatusPage(res, identificator = -1, titlu, text, imagine)
{
    var eroare= varGlobale.obErori.erori.find(function(elem){ return elem.identificator == identificator })
    titlu= titlu || (eroare && eroare.titlu) || varGlobale.obErori.eroare_default.titlu;
    text= text || (eroare && eroare.text) || varGlobale.obErori.eroare_default.text;
    imagine= imagine || (eroare && path.join(varGlobale.obErori.cale_baza,eroare.imagine)) 
        || path.join(varGlobale.obErori.cale_baza, varGlobale.obErori.eroare_default.imagine);
    if(eroare && eroare.status)
        res.status(eroare.identificator)
    res.render("pagini/statusError",{titlu:titlu, text:text, imagine:imagine });
}

async function getCategoriiProduse()
{
    var catProduse = [];
    const rez = await client.query("select * from unnest(enum_range(null::cat_produs))");

    for(let prod of rez.rows)
        catProduse.push(prod.unnest);

    return catProduse;
}

async function getProducatoriProduse()
{
    var producatoriProduse = [];
    const rez = await client.query("select * from unnest(enum_range(null::producator_produs))");

    for(let prod of rez.rows)
        producatoriProduse.push(prod.unnest);

    return producatoriProduse;
}

// async function getOcupatiiUser(){
//     var ocupatiiUser = [];
//     const rez = await clientDb.query("select * from unnest(enum_range(null::ocupatie_client))");

//     for(let ocupatie of rez.rows)
//         ocupatiiUser.push(ocupatie.unnest);

//     return ocupatiiUser;
// }

function getOcupatiiUser(data)
{   
    return client.query("select * from unnest(enum_range(null::ocupatie_client))").then(rez=>{
        var ocupatii = [];
        for(let ocupatie of rez.rows)
            ocupatii.push(ocupatie.unnest);

        return ocupatii;
    });
    
}

// function genToken(length)
// {
//     let sir_aleator = "";
//     for(let i = 0; i < length; i++)
//         sir_aleator += global.sirAlphaNum[Math.floor(Math.random()*global.sirAlphaNum.length)];

//     return sir_aleator;
// }

function generateToken(userName)
{
    let sir_aleator = "";
    for(let i = 0; i<4; i++)
        sir_aleator += varGlobale.sirAlpha[Math.floor(Math.random()*varGlobale.sirAlpha.length)];

    sir_aleator += (crypto.scryptSync(userName,varGlobale.saltTemplate,32).toString("hex"));

    ///regex pentru a inlocui caracterele non alfanumerice cu -
    sir_aleator.replace("/[^a-z0-9]/gi","-");
    console.log(sir_aleator);

    return sir_aleator;
}

async function sendMailConfirmCode(username,email,token)
{
    var transp = nodemailer.createTransport({
        host: "mail.idigit.ro",
        port: 465,
        secure: true,
        auth: {
          user: "pixelpro-proiect-tw@idigit.ro",
          pass: "9zce^G7%22KM",
        },
      });
    ///generate HTML

    await transp.sendMail({
        from:"pixelpro-proiect-tw@idigit.ro",
        to:email,
        subject:"Cont nou - PixelPro Computers",
        text:`Mulțumim pentru accesare!`,
        html:`<h1>Bine ai venit în comunitatea PixelPro Computers!</h1> <p>Username-ul tău este <span style=\"color:green; font-weight:bold;\">${username}</span></p><p><a href=\"http://${varGlobale.numeDomeniu}/confirmare/${username}/${token}\">Click aici pentru confirmarea contului</a></p>`
    });

    console.log(`[INFO] Mail de inregistrare trimis la adresa ${email} cu succes către user ${username} cu token-ul ${token}!`);
}

async function sendMailDelete(email)
{
    var transp = nodemailer.createTransport({
        host: "mail.idigit.ro",
        port: 465,
        secure: true,
        auth: {
          user: "pixelpro-proiect-tw@idigit.ro",
          pass: "9zce^G7%22KM",
        },
      });
    ///generate HTML

    await transp.sendMail({
        from:"pixelpro-proiect-tw@idigit.ro",
        to:email,
        subject:"Stergerea contului de către administrator - PixelPro Computers",
        text:`Cu sinceră părere de rău, vă anunțăm că ați fost șters! Adio!`,
        html:`<p>Cu sinceră părere de rău, vă anunțăm că ați fost șters! Adio!</p>`
    });

    console.log(`[INFO] Mail de stergere trimis la adresa ${email} cu succes`);
}

async function sendMailFactura(username,email,numefis)
{
    var transp = nodemailer.createTransport({
        host: "mail.idigit.ro",
        port: 465,
        secure: true,
        auth: {
          user: "pixelpro-proiect-tw@idigit.ro",
          pass: "9zce^G7%22KM",
        },
      });

    await transp.sendMail({
        from:"pixelpro-proiect-tw@idigit.ro",
        to:email,
        subject:"Factură",
        text:`Stimate ${username}, aveți atașată factura`,
        html:`<h1>Salut!</h1><p>Stimate ${username}, aveți atașată factura </p>`,
        attachments:[
            {
                filename:`factura-${(new Date()).getTime()}.pdf`,
                content:fs.readFileSync(numefis)
            }
        ] 
    })
    console.log(`[INFO] Factura a fost trimisă la ${email}`);
}

function createImages()
{
    var buffer = fs.readFileSync(path.join(__dirname,"resurse","json","galerie.json")).toString("utf8");
    varGlobale.obImagini = JSON.parse(buffer);
    
    for(let img of varGlobale.obImagini)
    {
        let numeImg,extImg;
        [numeImg,extImg] = img.cale_imagine.split(".");
        let smallSize = 150;
        img.small = path.join("galerie","mic",`${numeImg}-${smallSize}.webp`);
        img.big = path.join("galerie",img.cale_imagine);
        if(!fs.existsSync(img.small))
            sharp(path.join(__dirname,"resurse","imagini",img.big)).resize(smallSize).toFile(path.join(__dirname,"resurse","imagini",img.small));
    }
}

function createXMLFile()
{
    const xmlPath = path.join(__dirname,"resurse","xml","contact.xml");
    const xmlHeader = `<?xml version="1.0" encoding="utf-8"`;

    if(!fs.existsSync(xmlPath))
    {
        let initXML={
            "declaration":{
                "attributes":{
                    "version": "1.0",
                    "encoding": "utf-8"
                }
            },
            "elements": [
                {
                    "type": "element",
                    "name":"contact",
                    "elements": [
                        {
                            "type": "element",
                            "name":"mesaje",
                            "elements":[]                            
                        },
                    ]
                }
            ]
        }

        let xmlContent = xmljs.js2xml(initXML,{compact:false,spaces:4});
        fs.writeFileSync(xmlPath,xmlContent);
        
        return false;
    }
    else
        return true;
}

function parseMessage()
{
    let xmlExists = createXMLFile();
    let xmlMessages = [];
    let obJson;

    if(xmlExists)
    {
        let xmlContent = fs.readFileSync(varGlobale.xmlPath,'utf8');
        obJson = xmljs.xml2js(xmlContent,{compact:false,spaces:4});

        let contentMessages = obJson.elements[0].elements.find(function(el){
            return el.name === "mesaje"
        });

        let arrayMessages = contentMessages.elements?contentMessages.elements:[];

        let messageXML = arrayMessages.filter(function(el){
            return el.name === "mesaj";
        });
        
        return [obJson,contentMessages,messageXML];
    }

    return [obJson,[],[]];
}

function getFirstMonday()
{
    var d = new Date(); ///extragem data curenta

    d.setDate(1); ///setam data ca fiind prima zi a lunii
    d.setHours(0,0,0,0);

    while(d.getDay() !== 1) ///cautam prima zi de luni
        d.setDate(d.getDate() + 1);
    
    return d;
}

function getWeekends(){
    var d = new Date(); ///extragem data curenta
    d.setDate(1); ///setam prima zi a lunii
    d.setHours(0,0,0,0);
    var crMonth = d.getMonth();
    var weekends = [];

    // ///last day of month
    // var lastDayMonth = d; 
    // lastDayMonth.setMonth(lastDayMonth.getMonth() + 1);
    // lastDayMonth.setDate(lastDayMonth.getDate() - 1);

    ///Get first saturday
    while(d.getDay() !== 6){
        d.setDate(d.getDate() + 1);
    }


    while(d.getMonth() ===  crMonth){
        if(d.getDay() % 6 === 0){ ///0 - duminica | 6 - sambata
            weekends.push(new Date(d.getTime()));
            d.setDate(d.getDate() + 1);
        }
        else
            d.setDate(d.getDate() + 5); ///trece saptamana
    }

    console.log(weekends);
    return weekends;
}



//test promisiuni ca nu le intelegeam
// Promise.all([getOcupatiiUser()]).then(value=>{
//     console.log(value);
// });
importStatusAssets();
// getCategoriiProduse();
generareSirAlpha();
QRCodeGeneration();
createImages();


console.log("Serverul este funcțional. Vedeți console logs pentru orice activitate.");

var ipuri_active = {};

server.use("/*",function(req,res,next){
    getCategoriiProduse().then(catProduse => {
        let ipReq = getIP(req);
        let ip_gasit = ipuri_active[ipReq+"|" + req.url];
        let crTime = new Date();

        if(ip_gasit)
        {
            if((crTime - ip_gasit.data) < 5 * 1500)
            {
                if(ip_gasit.nr > 10)
                {
                    res.render("pagini/status",{message:"Prea multe cereri într-un interval scurt. Vă rugăm să reveniți."});
                    ip_gasit.data = crTime;
                    return;
                }
                else
                {
                    ip_gasit.data = crTime;
                    ip_gasit.nr++;
                }
            }
            else
            {
                ip_gasit.data = crTime;
                ip_gasit.nr = 1;
            }
        }
        else
        {
            ipuri_active[ipReq+"|"+req.url] = {nr:1, data:crTime};
        }

        let queryAccesari = `insert into accesari(ip,user_id,pagina) values($1,$2,$3)`;
        if(ipReq)
        {
            var id_user = req.session.utilizator?req.session.utilizator.id:null;
            client.query(queryAccesari,[ipReq,id_user,req.url],function(err,rez){
                if(err)
                    console.log(err);
            });
        }

        try{
            var optiuniFisier = fs.readFileSync(path.normalize(__dirname + "/resurse/json/server.json"),{},function(err, data){ console.log(data);}).toString("utf-8");
            var optiuniServer = JSON.parse(optiuniFisier);
            if(optiuniServer.mentenanta === false)
            {
                res.locals.utilizatorCr = req.session.utilizator;
                res.locals.categoriiProduse = catProduse;
                next();
            }
            else
            {
                res.locals.utilizatorCr = req.session.utilizator;
                res.locals.categoriiProduse = catProduse;
                renderStatusPage(res,1);
            }
        }
        catch{
            res.locals.utilizatorCr = req.session.utilizator;
            res.locals.categoriiProduse = catProduse;
            next();
        }

    });
});

function stergereAccesariVechi()
{
    let query = `delete from accesari where now() - data_accesare > interval '10 minutes'`;

    client.query(query,function(err,rez){
        if(err)
            console.log(err);
    });
}


function stergereIpBlocat()
{
    let crTime = new Date();
    for (let crIp in ipuri_active)
    {
        if(crTime - ipuri_active[crIp].data > 2 * 60 * 1000)
        {
            console.log(`[IP-INFO] Deblocat IP ${crIp}`);
            delete ipuri_active[crIp];
        }
    }
}

stergereAccesariVechi();
setInterval(stergereAccesariVechi,10*60*1000);
setInterval(stergereIpBlocat,2*60*1000);


server.get(["/","/home","/index"],(req,res)=>{

    client.query("select username from utilizatori where id in (select distinct user_id from accesari where now() - data_accesare < interval '5 minutes')").then(function(rezultat){
        console.log("[INFO] Accesari curente");
        console.log(rezultat.rows);
        var events = [];
        var crDate = new Date();
        var firstMonday = getFirstMonday();
        var weekends = getWeekends();
        var aniversare = new Date(crDate.getFullYear(),crDate.getMonth(),16);
    
        events.push({data: firstMonday,text:"Reducere de început"});
    
    
        for(i = weekends.length-1; i>=weekends.length-4; i--)
            events.push({data: weekends[i],text:"Promoție weekend"});
    
        events.push({data: weekends[0],text:"Podcast"});
        events.push({data: weekends[1],text:"Security day"});
        events.push({data:aniversare,text:"Aniversare"});

        let obJson, elementMesaje,mesajeXML;

        [obJson,elementMesaje,mesajeXML] = parseMessage();
    
        res.render('pagini/index',{ip:getIP(req),evenimente:events,page:"/index",onlineUsers:rezultat.rows,mesaje:mesajeXML});
    });    
});

// server.get("/admin",function(req,res){
//     res.render("admin/inserare_produse");
// });


server.get("/galerie",(req,res)=>{

    var crTime = new Date();
    var crMin = crTime.getMinutes();
    
    var imgStatic = [];

    for(let img of varGlobale.obImagini)
    {
        if(img.sfert_ora === parseInt(crMin/15))
            imgStatic.push(img);
    }

    var randomLengthDynamic = 0;

    do{
        randomLengthDynamic = Math.floor(Math.random() * ((11-7+1)+7));
    }while(randomLengthDynamic === 10 || randomLengthDynamic < 7 || randomLengthDynamic > 11);

    var selectionPictures = varGlobale.obImagini;

    selectionPictures.sort(()=>Math.random()-0.5);

    selectionPictures = selectionPictures.slice(0,randomLengthDynamic);

    varGlobale.obDynamicImg = selectionPictures;



    res.render('pagini/galerie',{galerieStatic: imgStatic,galerieDinamic: varGlobale.obDynamicImg,page:"/galerie"});
});

server.get("*/galerie-animata.css.map",function(req,res){
    res.sendFile(path.join(__dirname,"temp/galerie-animata.css.map"));
});

server.get("*/galerie-animata.css",function(req,res){
    let sirScss = fs.readFileSync("./resurse/scss/galerie_animata.scss").toString("utf8");

    let rezScss = ejs.render(sirScss,{nrImag: varGlobale.obDynamicImg.length});

    fs.writeFileSync("./temp/galerie-animata.scss",rezScss);

    let cale_css = path.join(__dirname,"temp","galerie-animata.css");
    let cale_scss = path.join(__dirname,"temp","galerie-animata.scss");

    try{
        rezCompilare = sass.compile(cale_scss,{sourceMap:true});
        fs.writeFileSync(cale_css,rezCompilare.css);
        res.setHeader("Content-Type","text/css");
        res.sendFile(cale_css);
    }
    catch(err){
        console.log(`eroare:${err.message}`);
        res.end();
        return;
    }
});


///afisare produse
server.get("/produse",(req,res)=>{
    var categorie="";
    if(req.query.tip)
        categorie+=` and categorie='${req.query.tip}'`;

    getProducatoriProduse().then(producatori => {res.locals.producatori = producatori});

    if(categorie === "")
        res.locals.tipSelectat = "null";
    else
        res.locals.tipSelectat = req.query.tip;

    client.query(`SELECT * FROM produse WHERE 1=1 ${categorie}`,function(err,rez){
        if(!err)
        {
            console.log(rez.rows);
            res.render("pagini/produse",{produse:rez.rows,page:"/produse"});
        }
        else
        {
            console.log(err);
            renderStatusPage(res,404);
        }
    });
})

server.get("/produs/:id", function(req, res){
    client.query(`select * from produse where id=${req.params.id}`, function(err,rez){
        if (!err){
            
            res.render("pagini/produs",{prod:rez.rows[0]});
        }
        else{
            console.log(err);
            renderStatusPage(res,404);
        }
    })
})

server.get("/inregistrare",function(req,res){

    const promiseReturn = getOcupatiiUser();

    promiseReturn.then((returnData) => {
        res.locals.ocupatiiUser = returnData;
        res.render("pagini/inregistrare");
    })
});

server.post("/register-user",function(req,res){
    //varGlobale.saltTemplate = req.hostname;
    let formular = new formidable.IncomingForm();
    let username;
    formular.parse(req,function(err,campuriText,campuriFile){
        let eroareInreg = "";
        console.log(campuriText);

            if(!campuriText["username"] || !campuriText["nume"] || !campuriText["prenume"] || !campuriText["parola"] || !campuriText['confirm-parola'] || !campuriText["email"])
                eroareInreg += "Nu ai completat toate câmpurile required!\n"

            const regexNumePrenume = new RegExp("^[a-z -]+$","i");
            //const regexEmail = new RegExp("^[^\s@]+@[^\s@]+\.[^\s@]+$");
            const regexUsername = new RegExp("^[a-zA-Z0-9]([._-](?![._-])|[a-zA-Z0-9]){3,18}[a-zA-Z0-9]$");


            if(!campuriText["nume"].match(regexNumePrenume) || !campuriText["prenume"].match(regexNumePrenume))
                eroareInreg += "Nume și prenumele conțin caractere ilegale!\n";

            if(!campuriText["email"].includes("@"))
                eroareInreg += "Email-ul nu are un format corect!\n";
            
            if(!campuriText["username"].match(regexUsername))
                eroareInreg += "Username-ul nu are un format corect!\n";

            if(eroareInreg !== "")
            {
                console.log(`[EROARE-FORMULAR] ${eroareInreg}`);
                res.render("pagini/status",{message:eroareInreg});
                return;
            }

            const queryExistUser = `SELECT * FROM utilizatori WHERE username='${campuriText["username"]}'`;

            client.query(queryExistUser,function(err,rez){
                if(err)
                {
                    console.log(`[EROARE-DB] ${err}`);
                    renderStatusPage(res,2);
                    return;
                }
                else
                {
                    if(rez.rows.length === 0)
                    {
                        let pathRelativ = null;
                        if(campuriFile["poza-profil"].originalFilename)
                        {
                            pathRelativ = path.join("uploads",`${campuriText["username"]}-${campuriFile["poza-profil"].newFilename}.${campuriFile["poza-profil"].mimetype.split('/')[1]}`);
                            //pathRelativ = `/uploads/${username}-${campuriFile["poza-profil"].newFilename}.${campuriFile["poza-profil"].mimetype.split('/')[1]}`;
                            const pathNou = path.join(__dirname,pathRelativ);
                            const dateImg = fs.readFileSync(campuriFile["poza-profil"].filepath);
                            fs.writeFileSync(pathNou,dateImg);
                        }
            

                        let criptareParola = crypto.scryptSync(campuriText.parola,varGlobale.saltTemplate,32).toString("hex");
                        let tokenCr = generateToken(campuriText["username"]);

                        const queryInsertUser = `INSERT INTO utilizatori(username,nume,prenume,email,parola,culoare_chat,ocupatie,cod,cale_imagine) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)`;
                        console.log(queryInsertUser,criptareParola);

                        client.query(queryInsertUser,[campuriText["username"],campuriText["nume"],campuriText["prenume"],campuriText["email"],criptareParola,campuriText["culoare-chat"],campuriText["ocupatie"],tokenCr,pathRelativ],function(err,rez){
                            if(err){
                                console.log(`[EROARE-DB] ${err}`);
                                renderStatusPage(res,2);
                                return;
                            }
                            else
                            {
                                sendMailConfirmCode(campuriText["username"],campuriText["email"],tokenCr);
                                res.render("pagini/status",{message:"Cont inregistrat cu succes!"});
                            }
                        });

                    }
                    else{
                        eroareInreg += "Username-ul deja exista!\n";
                        res.render("pagini/status",{message:eroareInreg});
                    }
                }
            });
    });
});


server.get("/confirmare/:username/:token",function(req,res){
    var queryConfirmUser = `update utilizatori set confirmat_email = true where username=$1 and cod=$2`;

    client.query(queryConfirmUser,[req.params.username,req.params.token],function(err,rez){
        if(err)
        {
            console.log(err);
            renderStatusPage(res,2);
            return;
        }

        if(rez.rowCount > 0)
            res.render("pagini/status",{message:"Cont confirmat!"});
        else
            res.render("pagini/status",{message:"Link de confirmare invalid!"});

    });

});

server.post("/login",function(req,res){
    console.log("[INFO] Un utilizator incearca sa se conecteze");
    let formular = new formidable.IncomingForm();

    formular.parse(req,function(err,campuriText,campuriFile){
        console.log(campuriText);

        let queryLogin = `SELECT * FROM utilizatori WHERE username = $1`;
        client.query(queryLogin,[campuriText["username"]],function(err,rez){
            if(err){
                renderStatusPage(res,2);
                return;
            }
            
            if(rez.rows.length != 1){
                res.render("pagini/status",{message:"Contul nu există!"});
                return;
            }

            let criptareParola = crypto.scryptSync(campuriText["parola"],varGlobale.saltTemplate,32).toString("hex");
            if(criptareParola === rez.rows[0].parola && rez.rows[0].confirmat_email)
            {
                req.session.mesajLogin = null;
                if(req.session)
                {
                    var pathImage = path.join(__dirname,rez.rows[0].cale_imagine);
                    var existsImage = fs.existsSync(pathImage);
                    req.session.utilizator = {
                        id:rez.rows[0].id,
                        username: rez.rows[0].username,
                        nume:rez.rows[0].nume,
                        prenume:rez.rows[0].prenume,
                        culoare_chat: rez.rows[0].culoare_chat,
                        ocupatie: rez.rows[0].ocupatie,
                        email:rez.rows[0].email,
                        rol:rez.rows[0].rol,
                        imagine:existsImage?rez.rows[0].cale_imagine.replace("uploads\\",""):"default.png"
                    }
                }
            }
            else
            {
                res.render("pagini/status",{message:"Cont neconfirmat / date conectare greșite"});
                return;
            }

            res.redirect("/index");
        });
    });

});

server.get("/manageUsers",function(req,res){

    if(typeof req.session.utilizator !== 'undefined')
    {
        if(req.session.utilizator.rol === 'admin')
        {
            let query = "SELECT id,nume,prenume,username,email FROM utilizatori WHERE (rol = $1)";

            client.query(query,["comun"],function(err,rez){
                if(err)
                {
                    console.log(err);
                    renderStatusPage(res,2);
                    return;
                }
                else
                    res.render("admin/manageUserPanel",{allClienti:rez.rows});
            })
        }
        else
        {
            console.log("access restrictionat!");
            renderStatusPage(res,403);
            return;
        }
    }
    else
    {
        console.log("access restrictionat!");
        renderStatusPage(res,403);
        return;
    }
});



server.get("/logout",function(req,res){
    req.session.destroy();
    res.locals.utilizatorCr = null;
    res.redirect("/index");
});

server.delete("/stergere-client/:id",function(req,res){
    if(req.params !== null)
    {
        let stergereUserId = parseInt(req.params.id);
        let stergereEmailUser = "";

        console.log(req.params.id);

        client.query("SELECT email FROM utilizatori WHERE id = $1",[stergereUserId],function(err,res){
            if(err)
            {
                console.log(err);
                renderStatusPage(res,2);
            }
            else
            {
                console.log(res.rows[0].email);
                stergereEmailUser = res.rows[0].email;
                console.log(stergereEmailUser);
                let stergereQuery = "DELETE FROM utilizatori WHERE id = $1";
                client.query(stergereQuery,[stergereUserId],function(err,res){
                    if(err)
                        console.log(err);
                    else
                    {
                        console.log(stergereEmailUser);
                        sendMailDelete(stergereEmailUser);
                    }
                });
            }
        });

    }
});

server.get("/cos",function(req,res){
    if(!req.session.utilizator)
    {
        res.render("pagini/status",{message:"Pentru a vizualiza produsele, trebuie să te conectezi!"});
        return;
    }

    res.render("pagini/cos_virtual",{page:"/cos"});
});

server.post("/extract/ProdSelected",function(req,res){
    var idProduse = [];
    for(let elem of req.body.produseID)
    {
        let num = parseInt(elem);
        if(!isNaN(num))
            idProduse.push(num);
    }

    if(idProduse.length === 0)
    {
        res.send("eroare");
        return;
    }

    client.query(`SELECT EXISTS(SELECT id FROM produse WHERE id in (${idProduse}))`,function(err,rez){
        console.log(rez.rows[0].exists);
        if(err)
        {  
            console.log(err);
            res.send(err);
            return;
        }
        
        if(rez.rows[0].exists === false)
        {
            console.log(err);
            res.send(err);
            return;
        }

        client.query(`SELECT id,nume,imagine,categorie,stare,pret,gaming,stoc,producator_produs FROM produse WHERE id in (${idProduse})`,function(err,rez){
            res.send(rez.rows);
        })
    });
});

server.post("/cumpara",function(req,res){
    if(!req.session.utilizator){
        res.write("Nu puteți cumpăra dacă nu sunteți logat!");
        res.end();
        return;
    }
    
    var idProduse = req.body.produseSelectate.map(prod => prod.id);
    var mapProduse = new Map();
    for(let prod of req.body.produseSelectate)
        mapProduse.set(prod.id,prod.cant);

    
    client.query(`SELECT EXISTS(SELECT id FROM produse WHERE id in (${idProduse}))`,function(err,rez){
        console.log(rez.rows[0].exists);
        if(err)
        {  
            console.log(err);
            res.write(err);
            return;
        }
        
        if(rez.rows[0].exists === false)
        {
            console.log(err);
            res.write(err);
            return;
        }


        client.query(`SELECT id,nume,imagine,categorie,stare,pret,gaming,stoc,producator_produs FROM produse WHERE id in (${idProduse})`,function(err,rez){
            let rezFactura = ejs.render(fs.readFileSync("views/pagini/factura.ejs").toString("utf8"),{utilizator:req.session.utilizator,produse:rez.rows,protocol:varGlobale.protocol,domeniu:varGlobale.numeDomeniu,selectList:mapProduse});

            let options = {format:'A4',args:['--no-sandbox','--disable-extensions','--disable-setuid-sandbox']};

            let file = {content: juice(rezFactura,{inlinePseudoElements:true})};

            html_to_pdf.generatePdf(file,options).then(function(pdf){
                if(!fs.existsSync("./temp"))
                    fs.mkdirSync("./temp");
                
                var numeFis = "./temp/test"+(new Date()).getTime() + ".pdf";
                fs.writeFileSync(numeFis,pdf);
                sendMailFactura(req.session.utilizator.username,req.session.utilizator.email,numeFis);
                res.write("Produse cumparate!");
                res.end();
            })
        
            
        })
    });

});

server.get("/termeni-conditii",function(req,res){
    res.render("pagini/termeni-conditii");
})

server.get("/politica-conf",function(req,res){
    res.render("pagini/politica-conf");
})


server.post("/contulMeu-update",function(req,res){
    ///START
    console.log("start...");
    ///1. Parse data
    let formular = new formidable.IncomingForm();
    let username;
    formular.parse(req,function(err,campuriText,campuriFile){
        ///2. Validare date text
        let eroareParse = "";
        if(!campuriText["email"] || !campuriText["nume"] || !campuriText["prenume"] || !campuriText["parola"])
            eroareParse += "Nu ai completat toate câmpurile required!\n";

        const regexNumePrenume = new RegExp("^[a-z -]+$","i");

        if(!campuriText["nume"].match(regexNumePrenume) || !campuriText["prenume"].match(regexNumePrenume))
            eroareParse += "Nume și prenumele conțin caractere ilegale!\n";

        if(!campuriText["email"].includes("@"))
            eroareParse += "Email-ul nu are un format corect!\n";
        
        if(eroareParse !== "")
        {
            console.log(`[EROARE-FORMULAR] ${eroareParse}`);
            res.render("pagini/status",{message:eroareParse});
            return;
        }

        const queryCheck = "SELECT * FROM utilizatori WHERE id = $1 AND parola = $2";
        let criptareParola = crypto.scryptSync(campuriText.parola,varGlobale.saltTemplate,32).toString("hex");

        console.log(req.session.utilizator.id);
        client.query(queryCheck,[req.session.utilizator.id,criptareParola],function(err,rez){
            if(err)
            {
                console.log("e aici eroarea..?");
                console.log(err);
                renderStatusPage(res,2);
                return;
            }

            if(rez.rows.length !== 1)
            {
                res.render("pagini/status",{message:"Parola incorectă!"});
                return;
            }




            let tokenCod = rez.rows[0].cod;

            let pathRelativ = null;
            
            if(campuriFile["poza-profil"].originalFilename)
            {
                let caleImagine = path.join(__dirname,"uploads",req.session.utilizator.imagine);
                const dateImgOriginala = fs.readFileSync(caleImagine);
                const dateImg = fs.readFileSync(campuriFile["poza-profil"].filepath);

                if(dateImgOriginala !== dateImg)
                {
                    pathRelativ = path.join("uploads",`${req.session.utilizator.username}-${campuriFile["poza-profil"].newFilename}.${campuriFile["poza-profil"].mimetype.split('/')[1]}`);
                    const pathNou = path.join(__dirname,pathRelativ);

                    if(req.session.utilizator.imagine !== "default.png")
                        fs.renameSync(caleImagine,path.join("uploads","poza.png"));

                    fs.writeFileSync(pathNou,dateImg);

                    let queryUpdate = "UPDATE utilizatori SET cale_imagine = $1 WHERE id = $2";
                    client.query(queryUpdate,[pathRelativ,req.session.utilizator.id],function(err,rez){
                        if(err)
                        {
                            console.log(err);
                            renderStatusPage(res,2);
                            return;
                        }
                    });
                }

                
            }



            if(req.session.utilizator.nume !== campuriText["nume"])
            {
                let queryUpdate = "UPDATE utilizatori SET nume = $1 WHERE id = $2";
                client.query(queryUpdate,[campuriText["nume"],req.session.utilizator.id],function(err,rez){
                    if(err)
                    {
                        console.log(err);
                        renderStatusPage(res,2);
                        return;
                    }
                });
            }

            if(req.session.utilizator.prenume !== campuriText["prenume"])
            {
                let queryUpdate = "UPDATE utilizatori SET prenume = $1 WHERE id = $2";
                client.query(queryUpdate,[campuriText["prenume"],req.session.utilizator.id],function(err,rez){
                    if(err)
                    {
                        console.log(err);
                        renderStatusPage(res,2);
                        return;
                    }
                });
            }

            if(req.session.utilizator.culoare_chat !== campuriText["culoare-chat"])
            {
                let queryUpdate = "UPDATE utilizatori SET culoare_chat = $1 WHERE id = $2";
                client.query(queryUpdate,[campuriText["culoare-chat"],req.session.utilizator.id],function(err,rez){
                    if(err)
                    {
                        console.log(err);
                        renderStatusPage(res,2);
                        return;
                    }
                });
            }

            if(req.session.utilizator.ocupatie !== campuriText["ocupatie"])
            {
                let queryUpdate = "UPDATE utilizatori SET ocupatie = $1 WHERE id = $2";
                client.query(queryUpdate,[campuriText["ocupatie"],req.session.utilizator.id],function(err,rez){
                    if(err)
                    {
                        console.log(err);
                        renderStatusPage(res,2);
                        return;
                    }
                });
            }

            if(req.session.utilizator.email !== campuriText["email"])
            {
                let queryUpdate = "UPDATE utilizatori SET email = $1, confirmat_mail = false WHERE id = $2";
                client.query(queryUpdate,[campuriText["nume"],req.session.utilizator.id],function(err,rez){
                    if(err)
                    {
                        console.log(err);
                        renderStatusPage(res,2);
                        return;
                    }

                    sendMailConfirmCode(req.session.utilizator.username,campuriText["email"],tokenCod);

                });
            }


            req.session.destroy();
            res.locals.utilizatorCr = null;
            res.render("pagini/status",{message:"Date cont modificate cu succes! Te rugăm să te reconectezi!"});

        });
    });
});



server.get("/contul-meu",function(req,res){

    if(req.session.utilizator)
    {
        const promiseReturn = getOcupatiiUser();

        promiseReturn.then((returnData) => {
            res.render("pagini/panouCont",{ocupatii:returnData});
        })
    }
    else
    {
        res.render("pagini/status",{message:"Nu vă puteți edita contul dacă nu sunteți conectat!"})
    }
});

server.get("/contact",function(req,res){
    let obJson, elementMesaje,mesajeXML;

    [obJson,elementMesaje,mesajeXML] = parseMessage();

    res.render("pagini/contact",{utilizator: req.session.utilizator,mesaje:mesajeXML,page:"/contact"});
})

server.post("/send-contact",function(req,res){
    let obJson, elMesaj,mesajXML;

    [obJson,elMesaj,mesajXML] = parseMessage();

    let username,rol;
    username = rol = null;

    if(req.session.utilizator)
    {
        username = req.session.utilizator.username;
        rol = req.session.utilizator.rol;
    }

    let mesajNou = {
        type:"element",
        name:"mesaj",
        attributes:{
            username: username?username:"anonim",
            data: new Date(),
            rol: rol?rol:"comun"
        },
        elements:[{type:"text","text":req.body.mesaj}]
    }

    if(elMesaj.elements)
        elMesaj.elements.push(mesajNou);
    else
        elMesaj.elements = [mesajNou];

    let contentXML = xmljs.js2xml(obJson,{compact:false, spaces:4});
    fs.writeFileSync(varGlobale.xmlPath,contentXML);

    res.render("pagini/contact",{utilizator:req.session.utilizator,mesaje:elMesaj.elements});
});



server.get("/*.ejs",function(req,res){
    renderStatusPage(res,403);
    //res.status(403).render("pagini/403");
});

server.get("/*",function(req,res){
    res.render("pagini"+req.url,function(err,rezRandare){
        if(err)
        {
            console.log(err.message);
            if(err.message.includes("Failed to lookup"))
            {
                renderStatusPage(res,404);
                return;
            }
            else
            {
                console.log(err);
                res.render("pagini/eroare");
            }
        }
        else
            res.send(rezRandare);
    });
});



// functie ce genereaza json dupa imaginile descarcate
// function createJSONImagini(){

//     var vecImagini = [];

//     var imaginiPaths = [];

//     var descrieri = ['Technologia schimbă vieți', 'Calculatorul are și o formă portabilă','Programarea este grea','0 = false, 1 = true','Placa de baza este inima calculatorului','Este calculatorul o ființă?','Mulți oameni folosesc PC-uri de la PixelPro','Această descriere este undefined','Fun times ahead with progress'];


//     const folderImagini = path.join(__dirname,"resurse","imagini","galerie");

//     fs.readdirSync(folderImagini).forEach(file=>{
//         imaginiPaths.push(file);
//     });

//     console.table(imaginiPaths);

//     var counter = 0;
//     for(let relPath of imaginiPaths)
//     {   
//         var obImagine = {
//             cale_imagine: null,
//             titlu: null,
//             descriere:null,
//             sfert_ora:0
//         };
    

//         obImagine.cale_imagine = relPath;
//         obImagine.titlu = `Poza ${counter}`;
//         obImagine.descriere = descrieri[parseInt(Math.random() * descrieri.length)];
//         obImagine.sfert_ora = parseInt(counter / 10);

//         counter++;

//         vecImagini.push(obImagine);
//     }

//     console.table(vecImagini);
    
//     fs.writeFileSync(path.join(__dirname,"resurse","json","galerie.json"),JSON.stringify(vecImagini));

//    // fs.writeFileZinc();

// }

// createJSONImagini();

// transp.verify(function(error,success){
//     if(error){
//         console.log(error);
//     }
//     else{
//         console.log("Serverul e gata pentru mailuri! Bravo man!");
//     }
// })