import { useStore } from 'vuex'
import { computed } from 'vue'
import { FAVORITE_KEY } from '@/assets/js/constant'
import { save, remove } from '@/assets/js/array-store'

export default function useFavorite () {
  const store = useStore()
  const favoriteList = computed(() => store.state.favoriteList)
  const maxLen = 100
  function getFavoriteIcon (currentSong) {
    return isFavorite(currentSong) ? 'icon-favorite' : 'icon-not-favorite'
  }

  function toggleFavorite (currentSong) {
    let list
    if (isFavorite(currentSong)) {
      // remove
      list = remove(FAVORITE_KEY, compare)
    } else {
      //  save
      list = save(currentSong, FAVORITE_KEY, compare, maxLen)
    }
    store.commit('setFavoriteList', list)

    function compare (item) {
      return item.id === currentSong.id
    }
  }

  function isFavorite (currentSong) {
    return favoriteList.value.findIndex(item => item.id === currentSong.id) > -1
  }

  return {
    getFavoriteIcon,
    isFavorite,
    toggleFavorite
  }
}
