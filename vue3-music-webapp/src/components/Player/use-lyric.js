import { useStore } from 'vuex'
import { computed, ref, watch } from 'vue'
import { reqLyric } from '@/api'
import Lyric from 'lyric-parser'

export default function useLyric ({ songReady, currentTime }) {
  const store = useStore()
  const currentLyric = ref(null)
  const currentLineNum = ref(0)
  const lyricScrollRef = ref(null)
  const lyricListRef = ref(null)
  const playingLyric = ref('')
  const currentSong = computed(() => store.getters.currentSong)

  watch(currentSong, async (newCurrentSong) => {
    if (!newCurrentSong.id || !newCurrentSong.url) return
    stopLyric()
    currentLyric.value = null
    playingLyric.value = ''
    const lyric = await reqLyric(newCurrentSong)
    store.commit('addSongLyric', { song: newCurrentSong, lyric })
    // 频繁调用，可能导致currentSong不一样
    if (currentSong.value.lyric !== lyric) return
    currentLyric.value = new Lyric(lyric, handlerLyric)
    if (songReady.value) {
      playLyric()
    }
  })

  function handlerLyric ({ lineNum, txt }) {
    currentLineNum.value = lineNum
    playingLyric.value = txt
    const scrollComp = lyricScrollRef.value
    const listEl = lyricListRef.value
    if (!listEl) return
    if (lineNum > 5) {
      const lineEl = listEl.children[lineNum - 5]
      scrollComp.scroll.scrollToElement(lineEl, 1000)
    } else {
      scrollComp.scroll.scrollTo(0, 0, 1000)
    }
  }

  function playLyric () {
    const currentLyricVal = currentLyric.value
    if (currentLyricVal) {
      currentLyricVal.seek(currentTime.value * 1000)
    }
  }
  function stopLyric () {
    const currentLyricVal = currentLyric.value
    if (currentLyricVal) {
      currentLyricVal.stop()
    }
  }

  return {
    lyricScrollRef,
    lyricListRef,
    playingLyric,
    currentLyric,
    currentLineNum,
    playLyric,
    stopLyric
  }
}
