<template>
  <div class="singer" v-loading="!singers.length">
    <index-list :singers="singers" @select="selectSinger"></index-list>
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :data="selectedSinger"></component>
      </transition>
    </router-view>
  </div>
</template>

<script>
import getSingerData from '@/utils/getSingerData'
import IndexList from '@/components/Index-List'
import { SINGER_KEY } from '@/assets/js/constant'

export default {
  name: 'Singer',
  components: { IndexList },
  data () {
    return {
      singers: [],
      selectedSinger: null
    }
  },
  async created () {
    const result = await getSingerData()
    this.singers = result
  },
  methods: {
    selectSinger (singer) {
      this.selectedSinger = singer
      sessionStorage.setItem(SINGER_KEY, JSON.stringify(singer))
      this.$router.push({ path: `/singer/${singer.id}` })
    }
  }
}
</script>
<style lang="scss" scoped>
.singer {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
}
</style>
