var client_id = "f7ad4e2b25084a1daa232f35e6b3f63a";
var client_secret = "2939b6dbf0d6499799b91ea75404b90b";
var redirect_uri = "https://brave-meitner-66c283.netlify.app";
function auth(){
    var url = `https://accounts.spotify.com/authorize?client_id=f7ad4e2b25084a1daa232f35e6b3f63a&response_type=code&redirect_uri=${encodeURIComponent(redirect_uri)}&scope=user-read-private playlist-read-private playlist-read-collaborative`;
    window.location.href = url;
}


function onPageLoad(){
    let code = null;
    const params = new URLSearchParams(window.location.search);
    code =  params.get('code');
    console.log(code);
    let body = `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(redirect_uri)}&client_id=${client_id}&client_secret=${client_secret}`;
    let xhr = new XMLHttpRequest();
    xhr.open("POST","https://accounts.spotify.com/api/token",true);
    xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xhr.setRequestHeader('Authorization','Basic '+ btoa(client_id+":"+client_secret));
    xhr.send(body);
    xhr.onload = handleAuthorizationResponse;
}

function handleAuthorizationResponse(){
    if ( this.status == 200 ){
        var data = JSON.parse(this.responseText);
        console.log(data);
        var data = JSON.parse(this.responseText);
        if ( data.access_token != undefined ){
            let access_token = data.access_token;
            console.log("Access token");
            console.log(access_token);
            //localStorage.setItem("access_token", access_token);
        
        if ( data.refresh_token  != undefined ){
            let refresh_token = data.refresh_token;
            console.log("Refresh token");
            console.log(refresh_token);
            //localStorage.setItem("refresh_token", refresh_token);
        }
        callAPI(access_token);
    }
        //onPageLoad();
    }
    else {
        console.log(this.responseText);
        console.log(this.responseText);
    }
}

function callAPI(access_token){
    let xhr = new XMLHttpRequest();
    xhr.open("GET","https://api.spotify.com/v1/me/playlists",true);
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.setRequestHeader('Authorization','Bearer '+access_token);
    xhr.send();
    xhr.onload = playlist;
}

function playlist(){
    console.log("inside onload");
    var div = document.createElement("div");
    div.setAttribute("style","font-size:70px;color:white;text-align:center;");
    div.innerHTML = "<br> My PlayList <br>";
    
    var data = JSON.parse(this.responseText);
    console.log(data);
    console.log(data.items[0]);
    console.log(data.items[0].images[0]);
    console.log(data.items[0].images[0].url);
    var bo = document.getElementById("body");
    bo.innerHTML = "";
    document.body.append(div);
    // var imglink = data.items[0].images[0].url;
    // var img = document.createElement("img");
    // img.setAttribute("src",imglink);
    // document.body.append(img);
    var container = document.createElement("div");
    container.setAttribute("class","container");
    var row = document.createElement("div");
    row.setAttribute("class","row");
    for(var i=0;i<data.items.length;i++){
        var imglink = data.items[i].images[0].url;
        var col = document.createElement("div");
        col.setAttribute("class","col-sm-4");
        col.setAttribute("style","margin-top:30px;")
        var card = document.createElement("div");
        card.setAttribute("class","card");
        var img = document.createElement("img");
        img.setAttribute("src",imglink);
        img.setAttribute("height","300px");
        var cardbody = document.createElement("div");
        cardbody.setAttribute("class","card-body");
        var name = document.createElement("div");
        name.setAttribute("class","card-title");
        name.setAttribute("style","font-size:35px;text-align:center;font-style:italic;");
        name.innerHTML = data.items[i].name;
        cardbody.append(name);
        card.append(img,cardbody);
        col.append(card);
        row.append(col);
        container.append(row);
        document.body.append(container);
    }
}
