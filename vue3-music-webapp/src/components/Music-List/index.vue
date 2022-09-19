<template>
  <div class="music-list">
    <div class="back" @click="goBack">
      <i class="icon-back"></i>
    </div>
    <h1 class="title">{{ title }}</h1>
    <div class="bg-image" :style="bgImageStyle" ref="bgImage">
      <div
        class="play-btn-wrapper"
        :style="playBtnStyle"
      >
        <div
          v-show="song.length > 0"
          class="play-btn"
          @click="random"
        >
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" :style="filterStyle"></div>
    </div>
    <Scroll
      class="list"
      :style="scrollStyle"
      v-loading="loading"
      v-no-result="noResult"
      :probeType="3"
      @scroll="onScroll"
    >
      <div class="song-list-wrapper">
        <song-list :song="song" @select="selectItem" :rank="rank"></song-list>
      </div>
    </Scroll>
  </div>
</template>

<script>
import Scroll from '@/components/Base/Scroll'
import SongList from '@/components/Base/Song-List'
import { mapActions, mapState } from 'vuex'
const RESERVED_HEIGHT = 40
export default {
  name: 'MusicList',
  components: {
    Scroll,
    SongList
  },
  data () {
    return {
      imageHeight: 0,
      // 音乐列表滚动距离
      scrollY: 0,
      // 最大滚动距离
      maxScollY: 0
    }
  },
  props: {
    song: {
      type: Array,
      default: []
    },
    title: {
      type: String,
      default: ''
    },
    pic: {
      type: String,
      default: ''
    },
    loading: Boolean,
    rank: Boolean
  },
  computed: {
    ...mapState(['playlist']),
    noResult () {
      return !this.loading && !this.song.length
    },
    playBtnStyle () {
      let display = ''
      if (this.scrollY >= this.maxScollY) {
        display = 'none'
      }
      return {
        display
      }
    },
    bgImageStyle () {
      const scrollY = this.scrollY
      let zIndex = 0
      let paddingTop = '70%'
      let height = 0
      let translateZ = 0
      if (scrollY > this.maxScollY) {
        zIndex = 10
        paddingTop = 0
        height = `${RESERVED_HEIGHT}px`
        translateZ = 1
      }
      let scale = 1
      if (scrollY < 0) {
        scale = 1 + Math.abs(scrollY / this.imageHeight)
      }
      return {
        zIndex,
        paddingTop,
        height,
        backgroundImage: `url("${this.pic}")`,
        transform: `scale(${scale})translateZ(${translateZ}px)`
      }
    },
    scrollStyle () {
      const bottom = this.playlist.length ? '60px' : '0'
      return {
        top: `${this.imageHeight}px`,
        bottom
      }
    },
    filterStyle () {
      let blur = 0
      const scrollY = this.scrollY
      const imageHeight = this.imageHeight
      if (scrollY > 0) {
        blur = Math.min(scrollY / this.maxScollY, scrollY / imageHeight) * 20
      }
      return {
        backdropFilter: `blur(${blur}px)`
      }
    }
  },
  mounted () {
    this.imageHeight = this.$refs.bgImage.clientHeight
    this.maxScollY = this.imageHeight - RESERVED_HEIGHT
  },
  methods: {
    ...mapActions(['selectPlay', 'randomPlay']),
    goBack () {
      this.$router.back()
    },
    onScroll (pos) {
      this.scrollY = -pos.y
    },
    selectItem ({ song, index }) {
      const songList = this.song
      this.selectPlay({ list: songList, index })
    },
    random () {
      const songList = this.song
      this.randomPlay(songList)
    }

  }
}
</script>

<style lang="scss" scoped>
.music-list {
  position: relative;
  height: 100%;
  .back {
    z-index: 20;
    transform: translateZ(2px);
    position: absolute;
    top: 10px;
    left: 6px;
    .icon-back {
      display: block;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }
  .title {
    z-index: 20;
    transform: translateZ(2px);
    position: absolute;
    top: 0;
    left: 10%;
    width: 80%;
    text-align: center;
    line-height: 40px;
    font-size: $font-size-large;
    color: $color-text;
  }
  .bg-image {
    position: relative;
    width: 100%;
    background-size: cover;
    transform-origin: top;
    .play-btn-wrapper {
      position: absolute;
      bottom: 20px;
      z-index: 10;
      width: 100%;
      .play-btn {
        box-sizing: border-box;
        width: 135px;
        padding: 7px 0;
        margin: 0 auto;
        text-align: center;
        border: 1px solid $color-theme;
        color: $color-theme;
        border-radius: 100px;
        font-size: 0;
      }
      .icon-play {
        display: inline-block;
        vertical-align: middle;
        margin-right: 6px;
        font-size: $font-size-medium-x;
      }
      .text {
        display: inline-block;
        vertical-align: middle;
        font-size: $font-size-small;
      }
    }
    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
    }
  }
  .list {
    position: absolute;
    bottom: 0;
    width: 100%;
    z-index: 0;
    .song-list-wrapper {
      padding: 20px 30px;
      background: $color-background;
    }
  }
}
</style>
