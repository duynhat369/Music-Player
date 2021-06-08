const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

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
const player = $(".music");
const title = $(".music-title");
const cdThumb = $(".music-image img");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");

const app = {
  currentIndex: 0,
  isPlay: false,

  songs: [
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
      musicName: "Đừng về trễ",
      singer: "Sơn Tùng MTP",
      path: "./img/song8.mp3",
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

  render: function () {
    const htmls = this.songs.map((song) => {
      return `
        <li class="item">
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
    $(".play-list .list-item").innerHTML = htmls.join("");
  },

  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  handleEvents: function () {
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
    };

    //When song paused
    audio.onpause = function () {
      app.isPlay = false;
      player.classList.remove("playing");
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
  },
  loadCurrentSong: function () {
    title.textContent = this.currentSong.musicName;
    cdThumb.src = this.currentSong.img;
    audio.src = this.currentSong.path;
  },
  start: function () {
    //định nghĩa các thuộc tính
    this.defineProperties();

    //xử lí events
    this.handleEvents();

    //Tải bài hát đầu tiên vào UI khi chạy ứng dụng
    this.loadCurrentSong();

    //render play list
    this.render();
  },
};

app.start();
