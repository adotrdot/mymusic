const delay = ms => new Promise(res => setTimeout(res, ms));

window.onload = () => {
  var music = document.getElementById('audio-source');
  var playlist = document.querySelectorAll('.song-item');
  var title = document.querySelector('#music-title span');
  var playBtn = document.getElementById('play-btn');
  var pauseBtn = document.getElementById('pause-btn');
  var duration = document.getElementById('duration');
  var progress = document.getElementById('progress');
  var bar = document.getElementById('bar');
  var currSong = 0;
  var maxSong = 4;
  var musicDur;
  var currDur = "00:00";

  const setMusic = async () => {
    title.innerHTML = "";
    await delay(500);
    music.src = songs[currSong]['path'];
    title.innerHTML = songs[currSong]['name'];
  }

  function playMusic() {
    music.play();
    playBtn.disabled = true;
    pauseBtn.disabled = false;
  }

  function pauseMusic() {
    music.pause();
    playBtn.disabled = false;
    pauseBtn.disabled = true;
  }

  function getMusicDur() {
    let tmp = parseInt(music.duration);
    musicDur = ("0" + parseInt(tmp / 60)).slice(-2) + ":" + ("0" + tmp % 60).slice(-2);
  }

  function updateDuration() {
    let tmp = parseInt(music.currentTime);
    currDur = ("0" + parseInt(tmp / 60)).slice(-2) + ":" + ("0" + tmp % 60).slice(-2);
    duration.innerHTML = currDur + " / " + musicDur;
  }

  function updateBar() {
    bar.style.width = parseInt(((music.currentTime / music.duration) * 100), 10) + "%";
  }

  music.addEventListener('canplay', () => {
    getMusicDur();
    duration.innerHTML = currDur + " / " + musicDur;
    music.addEventListener('timeupdate', () => {
      updateDuration();
      updateBar();
    });
  });

  music.addEventListener('ended', () => {
    if (currSong == maxSong) {
      currSong = 0;
    } else {
      currSong++;
    }
    playlist[currSong].click();
  });

  playBtn.addEventListener('click', () => {
    playMusic();
  });

  pauseBtn.addEventListener('click', () => {
    pauseMusic();
  });

  progress.addEventListener('click', function(e) {
    let clickPos = (e.pageX  - this.offsetLeft) / this.offsetWidth;
    let clickTime = clickPos * music.duration;

    music.currentTime = clickTime;
  });

  setMusic();

  playlist[0].className += " active";

  playBtn.disabled = true;
  pauseBtn.disabled = true;

  for (let i = 0; i < songs.length; i++) {
    playlist[i].addEventListener('click', async () => {
      pauseMusic();
      let selected = document.getElementsByClassName("active");
      if (selected.length > 0) {
        selected[0].className = selected[0].className.replace(" active", "");
      }
      currSong = i;
      setMusic();
      music.currentTime = 0;
      playlist[i].className += " active";
      await delay(1500);
      playMusic();
    });
  }

  playBtn.disabled = false;
}
