import getSongData from '@/utils/getSongData'
import MusicList from '@/components/Music-List'

export default function createDetailComponent (name, key, fetch) {
  return {
    name,
    components: { MusicList },
    props: ['data'],
    data () {
      return {
        song: [],
        loading: true
      }
    },
    computed: {
      computedData () {
        let res = null
        const data = this.data
        if (data) {
          res = data
        } else {
          const cached = JSON.parse(sessionStorage.getItem(key))
          if (cached && cached.id == this.$route.params.id) {
            res = cached
          }
        }
        return res
      },
      title () {
        const data = this.computedData
        return data && (data.name || data.title)
      },
      pic () {
        const data = this.computedData
        return data && (data.pic || data.coverImgUrl)
      }
    },
    async created () {
      if (!this.computedData) {
        const path = this.$route.matched[0].path
        this.$router.push({ path })
        return
      }
      const result = await fetch(this.$route.params.id)
      this.song = await getSongData((result.songs || result.tracks))
      this.loading = false
    }
  }
}
