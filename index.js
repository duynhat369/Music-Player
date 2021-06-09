const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

//tab line
const controlItem = $$(".control-item");
const contentItem = $$(".content-item");

const tabLine = $(".tab-line");

controlItem.forEach((control, index) => {
  const content = contentItem[index];

  control.onclick = function () {
    $(".control-item.active").classList.remove("active");
    $(".content-item.active").classList.remove("active");

    tabLine.style.left = this.offsetLeft + "px";
    tabLine.style.width = this.offsetWidth + "px";

    this.classList.add("active");
    content.classList.add("active");
  };
});

// music player
const PLAYER_STORAGE_KEY = "PLAYER-MUSIC";

const player = $(".music");
const title = $(".music-title");
const cdThumb = $(".music-image img");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const redoBtn = $(".btn-repeat");
const playlist = $(".play-list .list-item");

const app = {
  currentIndex: 0,
  isPlay: false,
  isRandom: false,
  isRedo: false,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  songs: [
    {
      musicName: "Đừng về trễ",
      singer: "Sơn Tùng MTP",
      path: "./img/song8.mp3",
      img: "https://photo-resize-zmp3.zadn.vn/w240_r1x1_jpeg/avatars/e/e/ee58fcc0ff45002b8d416bd7685809ce_1487040461.jpg",
    },
    {
      musicName: "Người ta có thương gì mình đâu",
      singer: "Trúc Nhân",
      path: "./img/song11.mp3",
      img: "https://photo-resize-zmp3.zadn.vn/w240_r1x1_jpeg/avatars/f/2/a/7/f2a75a97ba68d7ea223c875fe2eb927e.jpg",
    },
    {
      musicName: "Làm người luôn yêu em",
      singer: "Sơn Tùng MTP",
      path: "./img/song1.mp3",
      img: "https://photo-resize-zmp3.zadn.vn/w240_r1x1_jpeg/avatars/e/e/ee58fcc0ff45002b8d416bd7685809ce_1487040461.jpg",
    },
    {
      musicName: "Ghé qua",
      singer: "Dick, Tofu, PC",
      path: "./img/song7.mp3",
      img: "https://photo-resize-zmp3.zadn.vn/w320_r1x1_jpeg/cover/c/5/f/c/c5fc615c43215c6b72676f42767855ee.jpg",
    },
    {
      musicName: "Anh sai rồi",
      singer: "Sơn Tùng MTP",
      path: "./img/song2.mp3",
      img: "https://photo-resize-zmp3.zadn.vn/w240_r1x1_jpeg/avatars/e/e/ee58fcc0ff45002b8d416bd7685809ce_1487040461.jpg",
    },
    {
      musicName: "Foreign Remix",
      singer: "Justin Bieber",
      path: "./img/song3.mp3",
      img: "https://photo-resize-zmp3.zadn.vn/w240_r1x1_jpeg/avatars/d/b/c/2/dbc2256e873048550e1410a7f65b51d2.jpg",
    },
    {
      musicName: "Hall of Fame",
      singer: "William",
      path: "./img/song4.mp3",
      img: "https://photo-resize-zmp3.zadn.vn/w320_r1x1_jpeg/cover/c/5/f/c/c5fc615c43215c6b72676f42767855ee.jpg",
    },
    {
      musicName: "Reality",
      singer: "Janieck Devy",
      path: "./img/song5.mp3",
      img: "https://photo-resize-zmp3.zadn.vn/w320_r1x1_jpeg/cover/c/5/f/c/c5fc615c43215c6b72676f42767855ee.jpg",
    },
    {
      musicName: "Lệ anh vẫn rơi",
      singer: "Sơn Tùng MTP",
      path: "./img/song6.mp3",
      img: "https://photo-resize-zmp3.zadn.vn/w240_r1x1_jpeg/avatars/e/e/ee58fcc0ff45002b8d416bd7685809ce_1487040461.jpg",
    },
    {
      musicName: "Em đừng đi",
      singer: "Sơn Tùng MTP",
      path: "./img/song9.mp3",
      img: "https://photo-resize-zmp3.zadn.vn/w240_r1x1_jpeg/avatars/e/e/ee58fcc0ff45002b8d416bd7685809ce_1487040461.jpg",
    },
    {
      musicName: "Cơn mưa ngang qua",
      singer: "Sơn Tùng MTP",
      path: "./img/song10.mp3",
      img: "https://photo-resize-zmp3.zadn.vn/w240_r1x1_jpeg/avatars/e/e/ee58fcc0ff45002b8d416bd7685809ce_1487040461.jpg",
    },
  ],
  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },

  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
        <li class="item ${
          index === this.currentIndex ? "active" : ""
        }" data-index="${index}">
          <div class="img">
            <img
              src=${song.img}
              alt="">
          </div>
          <div class="detail">
            <h4 class="music-name">${song.musicName}</h4>
            <p class="music-singer">${song.singer}</p>
          </div>
          <div class="dot">
            <i class="fas fa-ellipsis-h"></i>
          </div>
        </li>
      `;
    });
    playlist.innerHTML = htmls.join("");
  },

  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  handleEvents: function () {
    //image rotate
    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 15000,
      iterations: Infinity,
    });

    cdThumbAnimate.pause();

    //when click play button
    playBtn.onclick = function () {
      if (app.isPlay) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    //When song playing
    audio.onplay = function () {
      app.isPlay = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
    };

    //When song paused
    audio.onpause = function () {
      app.isPlay = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    };

    //when prev button click
    prevBtn.onclick = function () {
      if (app.isRandom) {
        app.playRandomSong();
      } else {
        app.prevSong();
      }

      audio.play();
      app.render();
      app.scrollToActiveSong();
    };

    //when next button click
    nextBtn.onclick = function () {
      if (app.isRandom) {
        app.playRandomSong();
      } else {
        app.nextSong();
      }

      audio.play();
      app.render();
      app.scrollToActiveSong();
    };

    //when random button click
    randomBtn.onclick = function () {
      app.isRandom = !app.isRandom;
      app.setConfig("isRandom", app.isRandom);
      randomBtn.classList.toggle("active", app.isRandom);
    };

    //when redo button click
    redoBtn.onclick = function () {
      app.isRedo = !app.isRedo;
      app.setConfig("isRedo", app.isRedo);
      redoBtn.classList.toggle("active", app.isRedo);
    };

    //When change progress bar
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };

    //xử lí khi tua bài hát
    progress.onchange = function (e) {
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    };

    //When song end
    audio.onended = function () {
      if (app.isRedo) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };

    //when click song list
    playlist.onclick = function (e) {
      const songNode = e.target.closest(".item:not(.active)");

      if (songNode || e.target.closest(".dot")) {
        // xử lí khi click vào bài hát đang active
        if (songNode) {
          app.currentIndex = Number(songNode.dataset.index);
          app.loadCurrentSong();
          app.render();
          audio.play();
        }
        // xử lí khi click vào bài hát chưa active
        // xử lí khi click vào dot
      }
    };
  },

  scrollToActiveSong: function () {
    setTimeout(() => {
      $(".list-item .active").scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 500);
  },

  loadCurrentSong: function () {
    title.textContent = this.currentSong.musicName;
    cdThumb.src = this.currentSong.img;
    audio.src = this.currentSong.path;
  },
  loadConfig: function () {
    this.isRandom = this.config.isRandom;
    this.isRedo = this.config.isRedo;
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);

    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },

  start: function () {
    //load config vào ứng dụng
    this.loadConfig();

    //định nghĩa các thuộc tính
    this.defineProperties();

    //xử lí events
    this.handleEvents();

    //Tải bài hát đầu tiên vào UI khi chạy ứng dụng
    this.loadCurrentSong();

    //render play list
    this.render();

    //hiển thị trạng thái ban đầu của button redo và random
    redoBtn.classList.toggle("active", app.isRedo);
    randomBtn.classList.toggle("active", app.isRandom);
  },
};

app.start();
