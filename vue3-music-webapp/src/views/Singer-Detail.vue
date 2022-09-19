<template>
  <div class="singer-detail">
    <MusicList
      :song="song"
      :title="title"
      :pic="pic"
      :loading="loading"
    ></MusicList>
  </div>
</template>

<script>
// import getSongData from '@/utils/getSongData'
// import MusicList from '@/components/Music-List'
import { reqArtistSong } from '@/api'
import { SINGER_KEY } from '@/assets/js/constant'
import createDetailComponent from '@/assets/js/create-detail-component'
// export default {
//   name: 'SingerDetail',
//   components: { MusicList },
//   props: ['singer'],
//   data () {
//     return {
//       song: [],
//       loading: true
//     }
//   },
//   computed: {
//     computedSinger () {
//       let res = null
//       const singer = this.singer
//       if (singer) {
//         res = singer
//       } else {
//         const cachedSinger = JSON.parse(sessionStorage.getItem(SINGER_KEY))
//         if (cachedSinger && cachedSinger.id == this.$route.params.id) {
//           res = cachedSinger
//         }
//       }
//       return res
//     },
//     title () {
//       const songer = this.computedSinger
//       return songer && songer.name
//     },
//     pic () {
//       const songer = this.computedSinger
//       return songer && songer.pic
//     }
//   },
//   async created () {
//     if (!this.computedSinger) {
//       const path = this.$route.matched[0].path
//       this.$router.push({ path })
//       return
//     }
//     const result = await reqArtistSong(this.$route.params.id)
//     this.song = await getSongData(result.songs)
//     this.loading = false
//   }
// }
export default createDetailComponent('SingerDetail', SINGER_KEY, reqArtistSong)
</script>

<style lang="scss" scoped>
.singer-detail {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;
}
</style>
