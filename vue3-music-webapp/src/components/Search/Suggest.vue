<template>
  <div
    ref="rootRef"
    class="suggest"
    v-loading:[loadingText]="loading"
    v-no-result:[noResultText]="noResult"
  >
    <ul class="suggest-list">
      <li
        class="suggest-item"
        v-for="song in songs"
        :key="song.id"
        @click="selectSong(song)"
      >
        <div class="icon">
          <i class="icon-music"></i>
        </div>
        <div class="name">
          <p class="text">
            {{song.singer}}-{{song.name}}
          </p>
        </div>
      </li>
      <div
        class="suggest-item"
        v-loading:[loadingText]="pullUpLoading"
      ></div>
    </ul>
  </div>
</template>

<script>

import { watch, ref, computed, nextTick } from 'vue'
import { search } from '@/api'
import getSongData from '@/utils/getSongData'
import usePullUpLoad from '@/components/Search/use-pull-up-load'
export default {
  name: 'Suggest',
  props: {
    query: String
  },
  emits: ['selectSong'],
  setup (props, { emit }) {
    const songs = ref([])
    const hasMore = ref(true)
    const page = ref(1)
    const loadingText = ref('')
    const noResultText = ref('抱歉，暂无搜索结果')

    // computed
    const loading = computed(() => {
      return !songs.value.length
    })
    const noResult = computed(() => {
      return !songs.value.length && !hasMore.value
    })
    const pullUpLoading = computed(() => {
      return isPullUpLoad.value && hasMore.value
    })

    const { isPullUpLoad, rootRef, scroll } = usePullUpLoad(moreSearch)

    watch(() => props.query, async (newQuery) => {
      if (!newQuery) return
      await firstSearch()
    })

    async function firstSearch () {
      if (!props.query) return
      page.value = 1
      songs.value = []
      hasMore.value = true
      const params = {
        keywords: props.query,
        page: page.value
      }
      const res = await search(params)
      songs.value = await getSongData(res.result.songs)
      hasMore.value = res.result.hasMore
      await nextTick()
      await makeItScrollable()
    }
    async function moreSearch () {
      if (!hasMore.value || !props.query) return

      page.value++

      const params = {
        keywords: props.query,
        page: page.value
      }
      const res = await search(params)
      songs.value = songs.value.concat(await getSongData(res.result.songs))
      hasMore.value = res.result.hasMore
      await nextTick()
      await makeItScrollable()
    }

    // 结果长度不够不能滚动请求更多
    async function makeItScrollable () {
      if (scroll.value.maxScrollY >= -1) {
        await moreSearch()
      }
    }

    function selectSong (song) {
      emit('selectSong', song)
    }
    return {
      songs,
      hasMore,
      loading,
      noResult,
      loadingText,
      noResultText,
      isPullUpLoad,
      rootRef,
      pullUpLoading,
      selectSong
    }
  }
}
</script>

<style lang="scss" scoped>
.suggest {
  height: 100%;
  overflow: hidden;
  .suggest-list {
    padding: 0 30px;
    .suggest-item {
      display: flex;
      align-items: center;
      padding-bottom: 20px;
      .icon {
        flex: 0 0 30px;
        width: 30px;
        [class^="icon-"] {
          font-size: 14px;
          color: $color-text-d;
        }
      }
      .name {
        flex: 1;
        font-size: $font-size-medium;
        color: $color-text-d;
        overflow: hidden;
        .text {
          @include no-wrap();
        }
      }
    }
  }
}
</style>
