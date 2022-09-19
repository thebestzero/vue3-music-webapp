<template>
  <teleport to="body">
    <transition name="list-fade">
      <div class="playlist" v-show="visable && !!playlist.length" @click="hide">
        <div class="list-wrapper" @click.stop>
          <div class="list-header">
            <div class="title">
              <i class="icon" :class="modeIcon" @click="changeMode"></i>
              <span class="text">{{ modeText }}</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </div>
          </div>
          <scroll ref="scrollRef" class="list-content">
            <ul ref="listRef">
              <li
                class="item"
                v-for="song in sequenceList"
                :key="song.id"
                @click="selectItem(song)"
              >
                <i class="current" :class="getCurrentIcon(song)"></i>
                <span class="text">{{ song.name }}</span>
                <span class="favorite">
                  <i :class="getFavoriteIcon(song)"></i>
                </span>
                <span
                  class="delete"
                  @click.stop="removeSong(song)"
                  :class="{ disable: removing }"
                >
                  <i class="icon-delete"></i>
                </span>
              </li>
            </ul>
          </scroll>
          <div class="list-footer" @click="hide">
            <span>关闭</span>
          </div>
        </div>
        <confirm
          ref="confirmRef"
          @confirm="confirmClear"
          text="是否清空播放列表？"
          confirm-btn-text="清空"
        ></confirm>
      </div>
    </transition>
  </teleport>
</template>

<script>
import useMode from '@/components/Player/use-mode'
import useFavorite from '@/components/Player/use-favorite'
import Scroll from '@/components/Base/Scroll'
import confirm from '@/components/Base/Confirm/confirm'
import { computed, nextTick, ref, watch } from 'vue'
import { useStore } from 'vuex'
export default {
  name: 'playlist',
  components: { Scroll, confirm },
  setup () {
    const visable = ref(false)
    const removing = ref(false)
    const scrollRef = ref(null)
    const listRef = ref(null)
    const confirmRef = ref(null)

    const store = useStore()
    const playlist = computed(() => store.state.playlist)
    const sequenceList = computed(() => store.state.sequenceList)
    const currentSong = computed(() => store.getters.currentSong)

    watch(currentSong, async (newSong) => {
      if (!visable.value || !newSong.id) {
        return
      }
      await nextTick()
      scrollToCurrent()
    })

    // hooks
    const { modeIcon, modeText, changeMode } = useMode()
    const { getFavoriteIcon } = useFavorite()

    function getCurrentIcon (song) {
      if (song.id === currentSong.value.id) {
        return 'icon-play'
      }
    }
    async function show () {
      visable.value = true
      await nextTick()
      refreshScroll()
      scrollToCurrent()
    }
    function hide () {
      visable.value = false
    }
    function refreshScroll () {
      scrollRef.value.scroll.refresh()
    }
    function scrollToCurrent () {
      const index = sequenceList.value.findIndex((song) => {
        return currentSong.value.id === song.id
      })
      const target = listRef.value.children[index]
      scrollRef.value.scroll.scrollToElement(target, 300)
    }
    function selectItem (song) {
      const index = playlist.value.findIndex((item) => {
        return item.id === song.id
      })
      store.commit('setCurrentIndex', index)
      store.commit('setPlayingState', true)
    }
    function removeSong (song) {
      if (removing.value) {
        return
      }
      removing.value = true
      store.dispatch('removeSong', song)
      if (!playlist.value.length) {
        hide()
      }
      setTimeout(() => {
        removing.value = false
      }, 300)
    }
    function showConfirm () {
      confirmRef.value.show()
    }
    function confirmClear () {
      store.dispatch('clearSongList')
      hide()
    }
    return {
      visable,
      removing,
      playlist,
      sequenceList,
      currentSong,
      scrollRef,
      listRef,
      confirmRef,
      // fun
      getCurrentIcon,
      show,
      hide,
      selectItem,
      removeSong,
      showConfirm,
      confirmClear,
      //  mode
      modeIcon,
      modeText,
      changeMode,
      //  favorite
      getFavoriteIcon
    }
  }
}
</script>

<style lang="scss" scoped>
.playlist {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 200;
  background-color: $color-background-d;
  &.list-fade-enter-active,
  &.list-fade-leave-active {
    transition: opacity 0.3s;
    .list-wrapper {
      transition: all 0.3s;
    }
  }
  &.list-fade-enter-from,
  &.list-fade-leave-to {
    opacity: 0;
    .list-wrapper {
      transform: translate3d(0, 100%, 0);
    }
  }
  .list-wrapper {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 210;
    width: 100%;
    background-color: $color-highlight-background;
    .list-header {
      position: relative;
      padding: 20px 30px 10px 20px;
      .title {
        display: flex;
        align-items: center;
        .icon {
          margin-right: 10px;
          font-size: 24px;
          color: $color-theme-d;
        }
        .text {
          flex: 1;
          font-size: $font-size-medium;
          color: $color-text-l;
        }
        .clear {
          @include extend-click();
          .icon-clear {
            font-size: $font-size-medium;
            color: $color-text-d;
          }
        }
      }
    }
    .list-content {
      max-height: 240px;
      overflow: hidden;
      .item {
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0 30px 0 20px;
        overflow: hidden;
        .current {
          flex: 0 0 20px;
          width: 20px;
          font-size: $font-size-small;
          color: $color-theme-d;
        }
        .text {
          flex: 1;
          @include no-wrap();
          font-size: $font-size-medium;
          color: $color-text-d;
        }
        .favorite {
          @include extend-click();
          margin-right: 15px;
          font-size: $font-size-small;
          color: $color-theme;
          .icon-favorite {
            color: $color-sub-theme;
          }
        }
        .delete {
          @include extend-click();
          font-size: $font-size-small;
          color: $color-theme;
          &.disable {
            color: $color-theme-d;
          }
        }
      }
    }
    .list-add {
      width: 140px;
      margin: 20px auto 30px auto;
      .add {
        display: flex;
        align-items: center;
        padding: 8px 16px;
        border: 1px solid $color-text-l;
        border-radius: 100px;
        color: $color-text-l;
        .icon-add {
          margin-right: 5px;
          font-size: $font-size-small-s;
        }
        .text {
          font-size: $font-size-small;
        }
      }
    }
    .list-footer {
      text-align: center;
      line-height: 50px;
      background: $color-background;
      font-size: $font-size-medium-x;
      color: $color-text-l;
    }
  }
}
</style>
