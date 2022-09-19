<template>
<div class="search">
  <div class="search-input-wrapper">
    <searchInput v-model="query"></searchInput>
  </div>
  <scroll class="search-content" v-show="!query">
    <div class="hot-keys">
      <h1 class="title">热门搜索</h1>
      <ul>
        <li
          class="item"
          v-for="item in hotKeys"
          :key="item.searchWord"
          @click="addQuery(item.searchWord)"
        >
          <span>{{item.searchWord}}</span>
        </li>
      </ul>
    </div>
  </scroll>
  <div class="search-result" v-show="query">
    <Suggest
      :query="query"
      @selectSong = 'selectSong'
    ></Suggest>
  </div>
</div>
</template>

<script>
import searchInput from '@/components/Search/Search-Input'
import Scroll from '@/components/Base/Scroll'
import Suggest from '@/components/Search/Suggest'
import { ref } from 'vue'
import { reqHotKeys } from '@/api'
import { useStore } from 'vuex'
export default {
  name: 'Search',
  components: {
    searchInput,
    Scroll,
    Suggest
  },
  setup () {
    const query = ref('')
    const hotKeys = ref([])

    const store = useStore()

    reqHotKeys().then((result) => {
      hotKeys.value = result.data
    })

    function addQuery (item) {
      query.value = item
    }

    function selectSong (song) {
      store.dispatch('addSong', song)
    }
    return {
      query,
      hotKeys,
      // fun
      addQuery,
      selectSong
    }
  }
}
</script>

<style lang="scss" scoped>
.search {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  display: flex;
  flex-direction: column;
  .search-input-wrapper {
    margin: 20px;
  }
  .search-content {
    flex: 1;
    overflow: hidden;
    .hot-keys {
      margin: 0 20px 20px 20px;
      .title {
        margin-bottom: 20px;
        font-size: $font-size-medium;
        color: $color-text-l;
      }
      .item {
        display: inline-block;
        padding: 5px 10px;
        margin: 0 20px 10px 0;
        border-radius: 6px;
        background: $color-highlight-background;
        font-size: $font-size-medium;
        color: $color-text-d;
      }
    }
    .search-history {
      position: relative;
      margin: 0 20px;
      .title {
        display: flex;
        align-items: center;
        height: 40px;
        font-size: $font-size-medium;
        color: $color-text-l;
        .text {
          flex: 1;
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
  }
  .search-result {
    flex: 1;
    overflow: hidden;
  }
}
</style>
