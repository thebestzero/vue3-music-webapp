<template>
  <div class="player" v-show="playlist.length">
    <transition name="normal">
    <div class="normal-player" v-show="fullScreen">
      <div class="background">
        <img :src="currentSong.pic" />
      </div>
      <div class="top">
        <div class="back" @click="goBack">
          <i class="icon-back"></i>
        </div>
        <h1 class="title">{{ currentSong.name }}</h1>
        <h2 class="subtitle">{{ currentSong.singer }}</h2>
      </div>
      <div class="middle"
      @touchstart.prevent = 'onMiddleTouchStart'
      @touchmove.prevent = 'onMiddleTouchMove'
      @touchend.prevent = 'onMiddleTouchEnd'
      >
        <!-- 圆形转盘-->
        <div class="middle-l" :style="middleLStyle">
          <div class="cd-wrapper" ref="cdWrapperRef">
            <div class="cd" ref="cdRef">
              <img
                :src="currentSong.pic"
                class="image"
                :class="cdCls"
                ref="cdImageRef"
              />
            </div>
          </div>
          <!--   单行歌词-->
          <div class="playing-lyric-wrapper">
            <div class="playing-lyric">{{ playingLyric }}</div>
          </div>
        </div>
        <!-- 歌词   -->
        <scroll class="middle-r" ref="lyricScrollRef" :style="middleRStyle">
          <div class="lyric-wrapper">
            <div v-if="currentLyric" ref="lyricListRef">
              <p
                class="text"
                :class="{ current: currentLineNum === index }"
                v-for="(line, index) in currentLyric.lines"
                :key="line.time"
              >
                {{ line.txt }}
              </p>
            </div>
          </div>
        </scroll>
      </div>
      <div class="bottom">
        <!--   cd歌词切换样式     -->
        <div class="dot-wrapper">
          <span class="dot" :class="{ active: currentShow === 'cd' }"></span>
          <span class="dot" :class="{ active: currentShow === 'lyric' }"></span>
        </div>
        <!--   进度条     -->
        <div class="progress-wrapper">
          <span class="time time-l">{{ formatTime(currentTime) }}</span>
          <div class="progress-bar-wrapper">
            <progress-bar
              ref="progressBarRef"
              :progress="progress"
              @progress-changing="onProgressChanging"
              @progress-changed="onProgressChanged"
            ></progress-bar>
          </div>
          <span class="time time-r">{{
            formatTime(currentSong.duration)
          }}</span>
        </div>
        <!--   切换歌曲-->
        <div class="operators">
          <div class="icon i-left">
            <i :class="modeIcon" @click="changeMode"></i>
          </div>
          <div class="icon i-left" :class="disableCls">
            <i class="icon-prev" @click="prev"></i>
          </div>
          <div class="icon i-center" :class="disableCls">
            <i :class="[playIcon]" @click="togglePlay"></i>
          </div>
          <div class="icon icon-right" :class="disableCls">
            <i class="icon-next" @click="next"></i>
          </div>
          <div class="icon icon-right">
            <i
              :class="getFavoriteIcon(currentSong)"
              @click="toggleFavorite(currentSong)"
            ></i>
          </div>
        </div>
      </div>
    </div>
    </transition>
    <mini-player :progress="progress" :togglePlay="togglePlay"></mini-player>
    <audio
      ref="audioRef"
      @pause="pause"
      @canplay="ready"
      @error="error"
      @timeupdate="updateTime"
      @ended="end"
    ></audio>
  </div>
</template>

<script>
import { PLAY_MODE } from '@/assets/js/constant'
import { useStore } from 'vuex'
import { computed, nextTick, ref, watch } from 'vue'
import useMode from '@/components/Player/use-mode'
import useFavorite from '@/components/Player/use-favorite'
import useCd from '@/components/Player/useCd'
import useLyric from '@/components/Player/use-lyric'
import useMiddleInteractive from '@/components/Player/use-middle-interactive'
import formatTime from '@/utils/formatTime'
import progressBar from '@/components/Player/progress-bar'
import Scroll from '@/components/Base/Scroll'
import miniPlayer from '@/components/Player/mini-player'
export default {
  name: 'Player',
  components: { progressBar, Scroll, miniPlayer },
  setup () {
    /* data */
    const audioRef = ref(null)
    const progressBarRef = ref(null)
    // 控制歌曲是否可以播放状态
    const songReady = ref(false)
    // 歌曲时间
    const currentTime = ref(0)
    let progressChanging = false
    /* vuex */
    const store = useStore()
    const currentSong = computed(() => store.getters.currentSong)
    const fullScreen = computed(() => store.state.fullScreen)
    const playing = computed(() => store.state.playing)
    const currentIndex = computed(() => store.state.currentIndex)
    const playlist = computed(() => store.state.playlist)
    const playMode = computed(() => store.state.playMode)
    /* computed */
    const playIcon = computed(() => {
      return playing.value ? 'icon-pause' : 'icon-play'
    })
    const disableCls = computed(() => {
      return songReady.value ? '' : 'disable'
    })
    const progress = computed(() => {
      return currentTime.value / currentSong.value.duration
    })
    /* hooks */
    const { modeIcon, changeMode } = useMode()
    const { getFavoriteIcon, toggleFavorite } = useFavorite()
    const { cdCls, cdRef, cdImageRef } = useCd()
    const {
      lyricScrollRef,
      lyricListRef,
      playingLyric,
      currentLyric,
      currentLineNum,
      playLyric,
      stopLyric
    } = useLyric({
      songReady,
      currentTime
    })
    const {
      currentShow,
      middleLStyle,
      middleRStyle,
      onMiddleTouchStart,
      onMiddleTouchMove,
      onMiddleTouchEnd
    } = useMiddleInteractive()
    /* watch */
    watch(currentSong, (newSong) => {
      const audioEl = audioRef.value
      if (!newSong.id && !newSong.url) {
        return
      }
      currentTime.value = 0
      // 切歌初始化false,新url，触发canplay事件(异步)，改为true
      songReady.value = false
      audioEl.src = newSong.url
      audioEl.play() // 异步
      store.commit('setPlayingState', true)
    })
    watch(playing, (newPlaying) => {
      if (!songReady.value) return
      const audioEl = audioRef.value
      if (newPlaying) {
        playLyric()
        audioEl.play()
      } else {
        stopLyric()
        audioEl.pause()
      }
    })
    watch(fullScreen, async (newFullScreen) => {
      if (newFullScreen) {
        await nextTick()
        progressBarRef.value.setOffset(progress.value)
      }
    })

    /* method */
    function goBack () {
      store.commit('setFullScreen', false)
    }

    // bottom 切换音乐
    function togglePlay () {
      if (!songReady.value) return
      store.commit('setPlayingState', !playing.value)
    }

    // 当歌曲非人为因素暂停触发
    function pause () {
      store.commit('setPlayingState', false)
    }

    function prev () {
      const list = playlist.value
      let index = currentIndex.value - 1
      if (!songReady.value || !list.length) {
        // 播放列表无歌曲
        return
      }
      if (list.length === 1) {
        // 播放列表只有一首歌
        loop()
      }
      if (index < 0) {
        // 第一首歌
        index = list.length - 1
      }
      store.commit('setCurrentIndex', index)
    }

    function next () {
      const list = playlist.value
      let index = currentIndex.value + 1
      if (!songReady.value || !list.length) {
        // 播放列表无歌曲
        return
      }
      if (list.length === 1) {
        // 播放列表只有一首歌
        loop()
      }
      if (index === list.length) {
        // 最后一首
        index = 0
      }
      store.commit('setCurrentIndex', index)
    }

    function loop () {
      const audioEl = audioRef.value
      audioEl.currentTime = 0
      audioEl.play()
      store.commit('setPlayingState', true)
    }

    // canplay回调，处理边界情况，防止多次点击报错
    // The play() request was interrupted by a new load request.
    function ready () {
      if (songReady.value) {
        return
      }
      songReady.value = true
      console.log('ready', songReady.value)
      playLyric()
    }

    function error () {
      // 允许前进后退
      songReady.value = true
    }

    function updateTime (e) {
      if (!progressChanging) {
        currentTime.value = e.target.currentTime
      }
    }

    // 处理进度条拖拽样式
    function onProgressChanging (progress) {
      progressChanging = true
      currentTime.value = currentSong.value.duration * progress
      playLyric()
      stopLyric()
    }

    // 处理播放器真实播放事件
    function onProgressChanged (progress) {
      progressChanging = false
      audioRef.value.currentTime = currentTime.value =
        currentSong.value.duration * progress
      if (!playing.value) {
        store.commit('setPlayingState', true)
      }
      playLyric()
    }

    function end () {
      currentTime.value = 0
      if (playMode.value === PLAY_MODE.loop) {
        loop()
      } else {
        next()
      }
    }

    return {
      //  data
      audioRef,
      currentTime,
      progressBarRef,
      //  computed
      currentSong,
      playlist,
      fullScreen,
      playIcon,
      disableCls,
      progress,
      //  fun
      goBack,
      togglePlay,
      pause,
      prev,
      next,
      ready,
      error,
      updateTime,
      formatTime,
      onProgressChanging,
      onProgressChanged,
      end,
      /* hooks */
      //  mode
      modeIcon,
      changeMode,
      //  favorite
      getFavoriteIcon,
      toggleFavorite,
      //  cd
      cdCls,
      cdRef,
      cdImageRef,
      //  lyric
      currentLyric,
      currentLineNum,
      lyricScrollRef,
      lyricListRef,
      playingLyric,
      //  middle-interactive
      currentShow,
      middleLStyle,
      middleRStyle,
      onMiddleTouchStart,
      onMiddleTouchMove,
      onMiddleTouchEnd
    }
  }
}
</script>

<style lang="scss" scoped>
.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;

    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);

      img {
        width: 100%;
        height: 100%;
      }
    }

    .top {
      position: relative;
      margin-bottom: 25px;

      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;
      }

      .icon-back {
        display: block;
        padding: 9px;
        font-size: $font-size-large-x;
        color: $color-theme;
        transform: rotate(-90deg);
      }

      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        @include no-wrap();
        font-size: $font-size-large;
        color: $color-text;
      }

      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
      }
    }

    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;

      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;

        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          box-sizing: border-box;
          height: 100%;

          .cd {
            width: 100%;
            height: 100%;
            border-radius: 50%;

            img {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border-radius: 50%;
              border: 10px solid rgba(255, 255, 255, 0.1);
            }

            .playing {
              animation: rotate 20s linear infinite;
            }
          }
        }

        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;

          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
        }
      }

      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;

        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;

          .text {
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;

            &.current {
              color: $color-text;
            }
          }

          .pure-music {
            padding-top: 50%;
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
          }
        }
      }
    }

    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;

      .dot-wrapper {
        text-align: center;
        font-size: 0;

        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $color-text-l;

          &.active {
            width: 20px;
            border-radius: 5px;
            background: $color-text-ll;
          }
        }
      }

      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 10px 0;

        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 40px;
          line-height: 30px;
          width: 40px;

          &.time-l {
            text-align: left;
          }

          &.time-r {
            text-align: right;
          }
        }

        .progress-bar-wrapper {
          flex: 1;
        }
      }

      .operators {
        display: flex;
        align-items: center;

        .icon {
          flex: 1;
          color: $color-theme;

          &.disable {
            color: $color-theme-d;
          }

          i {
            font-size: 30px;
          }
        }

        .i-left {
          text-align: right;
        }

        .i-center {
          padding: 0 20px;
          text-align: center;

          i {
            font-size: 40px;
          }
        }

        .i-right {
          text-align: left;
        }

        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }

    &.normal-enter-active,
    &.normal-leave-active {
      transition: all 0.6s;

      .top,
      .bottom {
        transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
      }
    }

    &.normal-enter-from,
    &.normal-leave-to {
      opacity: 0;

      .top {
        transform: translate3d(0, -100px, 0);
      }

      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }
}
</style>
