<template>
  <m-header></m-header>
  <tab> </tab>
  <router-view :style="viewStyle" v-slot="{ Component }">
    <keep-alive>
      <component :is="Component"/>
    </keep-alive>
  </router-view>  <player></player>
</template>

<script>
import Header from '@/components/Header'
import Tab from '@/components/Tab'
import Player from '@/components/Player'
import { mapState } from 'vuex'
export default {
  components: {
    MHeader: Header,
    Tab,
    Player
  },
  computed: {
    viewStyle () {
      const bottom = this.playlist.length ? '60px' : '0'
      return {
        bottom
      }
    },
    ...mapState(['playlist'])
  }
}
</script>
