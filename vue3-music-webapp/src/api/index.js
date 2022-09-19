// 统一管理项目前部的接口
import axios from './axios'

let key
// 扫码登录
export const loginImg = () => axios.get('/login/qr/key').then((result) => {
  key = result.data.unikey
  return axios.get('/login/qr/create', { params: { key, qrimg: true } })
})
// 二维码检测扫码状态接口
export const checkLogin = () => axios.get('/login/qr/check', { params: { key } })

// 获取轮播图的数据
export const reqBanner = () => {
  return axios({ method: 'get', url: '/banner?type=2' })
}

// 获取热门歌单
export const reqHotPlayList = () =>
  axios.get('/top/playlist?order=hot&limit=10')

// 获取热门歌手
export const reqHotArtists = () => axios.get('/top/artists?limit=10')

// 获取全部歌手列表
export const reqArtistsList = () =>
  axios.get('/artist/list?type=-1&area=-1&limit=100')

// 获取歌手全部歌曲
export const reqArtistSong = (id, limit = 100) =>
  axios.get('/artist/songs', { params: { id, limit } })

// 获取歌曲url
export const reqSongUrl = (id) => axios.get(`/song/url?id=${id}`)

// 获取歌曲详情
export const reqSongDetail = (ids) => axios.get('/song/detail', { params: { ids } })

const lyricMap = {}

// 获取歌词
export const reqLyric = function (song) {
  if (song.lyric) {
    return Promise.resolve(song.lyric)
  }
  const { id } = song
  const lyric = lyricMap[id]
  if (lyric) {
    return Promise.resolve(lyric)
  }
  return axios.get('/lyric', { params: { id } }).then(result => {
    return result ? result.lrc.lyric : '[00:00:00]该歌曲暂时无法获取歌词'
  })
}

// 获取歌单歌曲
export const reqPlaylistSong = (id) => axios.get('/playlist/track/all', { params: { id } })

// 所有榜单内容摘要
export function reqToplist () {
  return axios.get('/toplist/detail')
    .then((result) => {
      const list = result.list.map((listItem) => {
        return {
          id: listItem.id,
          pic: listItem.coverImgUrl,
          name: listItem.name,
          songList: listItem.tracks.map((songItem) => {
            return {
              singerName: songItem.first,
              songName: songItem.second
            }
          })
        }
      })
      return list.filter((element) => {
        return !!element.songList.length
      })
    })
}

// 获取榜单歌曲
export function reqToplistSong (id) {
  return axios.get('/playlist/detail', { params: { id } })
    .then((result) => {
      return result.playlist
    })
}

// 获取热搜
export const reqHotKeys = () => axios.get('/search/hot/detail')

// 搜索
export const search = ({ keywords, page }) => axios.get('/search', {
  params: { keywords, offset: page * 30 }
}).then((data) => {
  data.result.songs.forEach((item) => {
    item.ar = item.artists
    item.al = item.album
  })
  return data
})
