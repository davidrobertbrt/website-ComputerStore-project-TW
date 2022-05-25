function addZeroString(nr)
{
    if(nr<10)
        return "0"+nr;
    else
        return nr;
}    

var clientTime = new Date();
var clientFormatTime = `${clientTime.getHours()}:${clientTime.getMinutes()}:${addZeroString(clientTime.getSeconds())}`;

document.getElementById("clientTime").innerHTML = clientFormatTime;

function updateTimeElem(divId)
{
    var divData = document.getElementById(divId);

    if(divData.innerHTML != "")
    {
        var timp = divData.innerHTML.split(":");
        var dt = new Date(2002,3,6,timp[0],timp[1],timp[2]);
    }
    else
        var dt = new Date();

    dt.setSeconds(dt.getSeconds()+1)
    data_div.innerHTML = `${addZeroString(dt.getHours())}:${addZeroString(dt.getMinutes())}:${addZeroString(dt.getSeconds())}`;
}


function updateTime()
{
    updateTimeElem("clientTime");
    updateTimeElem("serverTime");
}

updateTime();
setInterval(updateTime,1000);


