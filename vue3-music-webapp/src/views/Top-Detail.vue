<template>
  <div class="top-detail">
    <music-list
      :song="song"
      :title="title"
      :pic="pic"
      :loading="loading"
      :rank= true
    ></music-list>
  </div>
</template>

<script>
import createDetailComponent from '@/assets/js/create-detail-component'
import { reqToplistSong } from '@/api'
import { TOP_KEY } from '@/assets/js/constant'

export default createDetailComponent('Top-Detail', TOP_KEY, reqToplistSong)
</script>

<style lang="scss" scoped>
.top-detail {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;
}
</style>
