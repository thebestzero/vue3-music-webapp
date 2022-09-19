import { reqSongUrl, reqSongDetail } from '@/api'

export default async function getSongData (songTatgetList) {
  let songList = songTatgetList.map((item) => {
    const singer = item.ar.map((element) => element.name).join('/')
    return {
      al: item.al.name,
      singer,
      id: item.id,
      name: item.name,
      pic: '',
      url: '',
      duration: 0
    }
  })
  const songId = songList.map((item) => item.id).join()
  const [result2, result3] = await Promise.all([reqSongUrl(songId), reqSongDetail(songId)])
  const songUrl = result2.data || []
  songUrl.forEach((element) => {
    songList.forEach((item) => {
      if (item.id === element.id) {
        item.url = element.url
        item.duration = element.time / 1000
      }
    })
  })
  const songPic = result3.songs || []
  songPic.forEach((element) => {
    songList.forEach((item) => {
      if (item.id === element.id) {
        item.pic = element.al.picUrl
      }
    })
  })
  songList = songList.filter((item) => item.url)
  return songList
}
