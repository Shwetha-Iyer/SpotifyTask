//var access_token="";
function createTag(element, elementClass="",elementID=""){
    var tag = document.createElement(element);
    if(elementClass !== "")
    tag.setAttribute("class",elementClass);
    if(elementID !== "")
    tag.setAttribute("id",elementID);
    return tag;
}

async function getToken() {
    try {
      const clientId = "f7ad4e2b25084a1daa232f35e6b3f63a";
      const clientSecret = "2939b6dbf0d6499799b91ea75404b90b";
      const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Basic " + btoa(clientId + ":" + clientSecret),
        },
        body: "grant_type=client_credentials",
      });
      const data = await result.json();
      //localStorage.setItem("access_token", data.access_token);
      window.access_token = data.access_token;
      //const accessToken = data.access_token;
      getPlaylist(window.accessToken);
      //getTrack(accessToken);
    } catch (error) {
      console.log(error);
    }
}

async function getPlaylist(){
    try{
        var resp = await fetch(
            "https://api.spotify.com/v1/users/qu9lafkb0qhg5caw8wnyt4x0d/playlists",
            {
                method: "GET",
                headers: { Authorization: "Bearer " + window.access_token },
            }
        );
        var data = await resp.json();
        console.log(data);
        var div = document.getElementById("play");
        div.innerHTML="";
        var container = createTag("div","container");
        var row = createTag("div","row");
        for(var i=0;i<data.items.length;i++){
            var col = createTag("div","col-md-4");
            col.setAttribute("style","margin-top:20px; margin-bottom:10px; padding-top:30px;");
            var cardgroup = createTag("div","card-group h-100");
            var card = createTag("div","card",data.items[i].id);
            card.setAttribute("name",data.items[i].name);
            card.setAttribute("style","background-color:black;border: 2px solid rgb(76, 173, 76);padding:5px;");
            card.addEventListener("click",calltrack);
            var img = createTag("img","card-img-top");
            img.setAttribute("height","300px");
            img.src = data.items[i].images[0].url;
            var cardbody = createTag("div","card-body text-center");
            var h5 = createTag("h5");
            h5.innerText = data.items[i].name;
            cardbody.append(h5);
            card.append(img,cardbody);
            cardgroup.append(card);
            col.append(cardgroup);
            row.append(col);
            container.append(row);
            div.append(container);
        }
    }
    catch(error){
        console.log(error);
    }
}
async function calltrack(){
    console.log("Clicked");
    console.log(this);
    console.log(this.id);
    console.log(this.textContent);
    var div = document.getElementById("play");
    div.innerHTML ="";
    var h3 = createTag("h3");
    h3.setAttribute("style","padding: 20px;");
    h3.innerHTML = `You are looking at playlist: ${this.textContent}`;
    container = createTag("div","container");
    row = createTag("div","row");
    col = createTag("div","col-12");
    col.setAttribute("style","width:75%; padding-top: 40px;");
    var table = createTag("table","table");
    var thead = createTag("thead");
    thead.setAttribute("style","color:white;");
    var theadtr = createTag("tr");
    var th1 = createTag("th");
    th1.setAttribute("scope","col");
    th1.innerText = "#";
    var th2 = createTag("th");
    th2.setAttribute("scope","col");
    th2.innerText = "Track Name";
    var th3 = createTag("th");
    th3.setAttribute("scope","col");
    th3.innerText = "Track Preview";
    theadtr.append(th1,th2,th3);
    thead.append(theadtr);
    table.append(thead);
    col.append(table);
    row.append(col);
    container.append(row);
    div.append(h3,container);
    var tbody = createTag("tbody");
    tbody.setAttribute("style","color:white");

    try {
        const result = await fetch(
          `https://api.spotify.com/v1/playlists/${this.id}/tracks`,
          {
            method: "GET",
            headers: { Authorization: "Bearer " + window.access_token },
          }
        );
        const data = await result.json();
        console.log(data);
        for(i=0;i<data.items.length;i++){
            var tr = createTag("tr");
            var td1 = createTag("td");
            td1.innerHTML = i+1;
            var td2 = createTag("td");
            td2.innerText = data.items[i].track.name;
            var td3 = createTag("td");
            var audio = createTag("audio");
            audio.setAttribute("controls","");
            var source = createTag("source");
            source.setAttribute("src",data.items[i].track.preview_url);
            audio.append(source);
            td3.append(audio);
            tr.append(td1,td2,td3);
            tbody.append(tr);
            table.append(tbody);
        }

    }
    catch(error){
        console.log(error);
    }
}
