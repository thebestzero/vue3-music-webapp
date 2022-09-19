<template>
  <div class="recommend" v-loading:[loadingText]="loading">
    <scroll class="recommend-content">
      <div>
        <div class="slider-wrapper">
          <div class="slider-content">
            <slider v-if="sliders.length" :sliders="sliders"></slider>
          </div>
        </div>
        <div class="recommend-list">
          <h1 class="list-title" v-show="!loading">热门歌单推荐</h1>
          <ul>
            <li v-for="item in playlists" class="item" :key="item.id" @click="selectItem(item)">
              <div class="icon">
                <img width="60" height="60" v-lazy="item.coverImgUrl" />
              </div>
              <div class="text">
                <h2 class="name">
                  {{ item.creator.nickname }}
                </h2>
                <p class="title">
                  {{ item.name }}
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </scroll>
  </div>
  <router-view v-slot="{ Component }">
    <transition appear name="slide">
      <component :is="Component" :data="selectedAlbum"></component>
    </transition>
  </router-view>
</template>

<script>
import { reqBanner, reqHotPlayList } from '@/api'
import Slider from '@/components/Base/Slider'
import Scroll from '@/components/Base/Scroll'
import { ALBUM_KEY } from '@/assets/js/constant'

export default {
  name: 'Recommend',
  components: { Slider, Scroll },
  data () {
    return {
      sliders: [],
      playlists: [],
      loadingText: '哈哈哈。。。',
      selectedAlbum: null
    }
  },
  computed: {
    loading () {
      return !(!!this.sliders.length && !!this.playlists.length)
    }
  },
  async created () {
    const [bannerData, playListsData] = await Promise.all([
      reqBanner(),
      reqHotPlayList()
    ])
    this.sliders = bannerData.banners
    this.playlists = playListsData.playlists
  },
  methods: {
    selectItem (item) {
      this.selectedAlbum = item
      sessionStorage.setItem(ALBUM_KEY, JSON.stringify(item))
      this.$router.push({ path: `/recommend/${item.id}` })
    }
  }
}
</script>

<style lang="scss" scoped>
.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  overflow: scroll;
  .recommend-content {
    height: 100%;
    overflow: hidden;
    .slider-wrapper {
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 40%;
      overflow: hidden;
      .slider-content {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }
    }
    .recommend-list {
      .list-title {
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-theme;
      }
      .item {
        display: flex;
        box-sizing: border-box;
        align-items: center;
        padding: 0 20px 20px 20px;

        .icon {
          flex: 0 0 60px;
          width: 60px;
          padding-right: 20px;
        }
        .text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          line-height: 20px;
          overflow: hidden;
          font-size: $font-size-medium;
        }
        .name {
          margin-bottom: 10px;
          color: $color-text;
        }
        .title {
          color: $color-text-d;
        }
      }
    }
  }
}
</style>
