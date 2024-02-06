console.log("Working on JavaScript");
let currSong= new Audio();
let songs;

function secondsToMinutesSeconds(seconds) {
    if (typeof seconds !== 'number' || isNaN(seconds)) {
      return '00:00';
    }
  
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = (seconds % 60).toFixed(0);
  
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
  
    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs() {

    let a = await fetch("http://127.0.0.1:3000/project2/songs/");
    let response = await a.text();
    // console.log(response);

    let div = document.createElement("div");
    div.innerHTML = response;

    let as = div.getElementsByTagName("a");
    let songs = [];
    for (let i = 0; i < as.length; i++) {
        const ele = as[i];
        if (ele.href.endsWith(".mpeg")) {
            songs.push(ele.href.split("/songs/")[1]);
        }
    }
    return songs;
}

const playMusic= (track, pause= false)=>{
    currSong.src= "/project2/songs/"+track ;
    if(!pause){
        currSong.play();
        play.src= "pause.svg";
    }

    document.querySelector(".songName1").innerHTML = track.replaceAll("%20", " ");
    document.querySelector(".songTime").innerHTML = "00:00/00:00";
}

async function main() {
    //geting all the songs 
    songs = await getSongs(); 
    playMusic(songs[0], true);
    //listing all the song in playlist
    let songUl = document.querySelector(".songs").getElementsByTagName("ul")[0];
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML + `<li>
                <div class="songCard">
                    <div class="musicDetail">
                        <img src="musicImg.svg" alt="musicImg">
                        <div class="songName">${song.replaceAll("%20", " ")}</div>
                    </div>
                    
                    <div class="playImg"><img src="play.svg" alt="playNow"></div>
                </div>     
            </li>`;
    }

    Array.from(document.querySelector(".songs").getElementsByTagName("li")).forEach(e=>{
        // console.log(e.querySelector(".songName").innerHTML);
        e.addEventListener("click", element=>{
            // console.log(e.querySelector(".songName").innerHTML);
            playMusic(e.querySelector(".songName").innerHTML.trim());
        })
    })

    play.addEventListener("click",()=>{
        if(currSong.paused){
            currSong.play();
            play.src= "pause.svg";
        }
        else{
            currSong.pause();
            play.src= "play.svg";
        }
    })

    currSong.addEventListener("timeupdate", ()=>{
        console.log(currSong.currentTime,currSong.duration);
        document.querySelector(".songTime").innerHTML= 
        `${secondsToMinutesSeconds(currSong.currentTime)}/
        ${secondsToMinutesSeconds(currSong.duration)}`

        document.querySelector(".circle").style.left= (currSong.currentTime/
        currSong.duration)*100+1+"%";
    })

    //seekbar position
    document.querySelector(".seekLine").addEventListener("click",e=>{
        //console.log(e);
        let percent= (e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector(".circle").style.left= percent-1+"%";
        currSong.currentTime= ((currSong.duration)*percent)/100;
    })

    prev.addEventListener("click",()=>{
        let index= songs.indexOf(currSong.src.split("/").slice(-1)[0])
        if(index-1 >= 0){
            playMusic(songs[index-1]);
        }
    })


    next.addEventListener("click",()=>{
        currSong.pause();
        // console.log("NextClicked");
        console.log(currSong.src.split("/").slice(-1)[0]);
        let index= songs.indexOf(currSong.src.split("/").slice(-1) [0]);
        if((index+1) < songs.length){
            playMusic(songs[index+1]);
        }
    })
}

main();