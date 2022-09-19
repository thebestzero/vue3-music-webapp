import { computed, nextTick, onMounted, onUnmounted, ref, watch, onActivated, onDeactivated } from 'vue'
import { useStore } from 'vuex'
import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'

BScroll.use(Slide)

export default function useMiniSlider () {
  const sliderWrapperRef = ref(null)
  const slider = ref(null)

  const store = useStore()
  const fullScreen = computed(() => store.state.fullScreen)
  const playlist = computed(() => store.state.playlist)
  const currentIndex = computed(() => store.state.currentIndex)

  const sliderShow = computed(() => {
    return !fullScreen.value && !!playlist.value
  })

  onMounted(() => {
    let slideVal
    watch(sliderShow, async (newSliderShow) => {
      if (newSliderShow) {
        await nextTick()
        if (!slideVal) {
          slideVal = slider.value = new BScroll(sliderWrapperRef.value, {
            click: true,
            scrollX: true,
            scrollY: false,
            momentum: false,
            bounce: false,
            probeType: 2,
            slide: {
              autoplay: false,
              loop: true
            }
          })
          // 改变currentIndex，改变实际歌曲
          slideVal.on('slidePageChanged', ({ pageX }) => {
            store.commit('setCurrentIndex', pageX)
          })
        } else {
          slideVal.refresh()
        }
        slideVal.goToPage(currentIndex.value, 0, 0)
      }
    })

    //  监听自动播放下一首，滚动
    watch(currentIndex, (newIndex) => {
      if (sliderShow.value) {
        slideVal.goToPage(newIndex, 0, 0)
      }
    })

    //  监听删除歌曲，更新Dom
    watch(playlist, async (newPlaylist) => {
      if (slideVal && sliderShow && newPlaylist.length) {
        await nextTick()
        slideVal.refresh()
      }
    })
  })

  onUnmounted(() => {
    if (slider.value) {
      slider.value.destroy()
    }
  })
  onActivated(() => {
    slider.value.enable()
    slider.value.refresh()
  })

  onDeactivated(() => {
    slider.value.disable()
  })
  return {
    slider,
    sliderWrapperRef
  }
}
