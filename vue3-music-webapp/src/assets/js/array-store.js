function inertArray (arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  if (index > -1) { // 存在歌曲
    return
  }
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}
function deleteArray (arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}
export function save (item, key, compare, maxLen) {
  const storage = getItem(key) || []
  inertArray(storage, item, compare, maxLen)
  setItem(key, storage)
  return storage
}

export function remove (key, compare) {
  const storage = getItem(key) || []
  deleteArray(storage, compare)
  setItem(key, storage)
  return storage
}

function getItem (key) {
  return JSON.parse(localStorage.getItem(key))
}
function setItem (key, storage) {
  localStorage.setItem(key, JSON.stringify(storage))
}
