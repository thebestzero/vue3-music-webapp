import { PLAY_MODE, FAVORITE_KEY } from '@/assets/js/constant'

export default {
  // 顺序播放列表
  sequenceList: [],
  // 播放列表
  playlist: [],
  // 是否播放
  playing: false,
  // 播放模式
  playMode: PLAY_MODE.sequence,
  currentIndex: 0,
  fullScreen: false,
  favoriteList: JSON.parse(localStorage.getItem(FAVORITE_KEY)) || []
}
