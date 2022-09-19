import { reqHotArtists, reqArtistsList } from "@/api/index";
import pinyin from "pinyin";
export default async function getSingerData() {
  const result = await Promise.all([reqHotArtists(), reqArtistsList()]);
  const [{ artists: HotArtists }, { artists: ArtistsList }] = result;
  // 构造歌手 Map 数据结构
  const HOT_NAME = "热";
  const singerMap = {
    hot: {
      title: HOT_NAME,
      list: map(HotArtists),
    },
  };
  ArtistsList.forEach((element) => {
    // 把歌手名转换为拼音
    const p = pinyin(element.name);
    if (!p || !p.length) {
      return;
    }
    const key = p[0][0].slice(0, 1).toUpperCase();
    if (key) {
      if (!singerMap[key]) {
        singerMap[key] = {
          title: key,
          list: [],
        };
      }
      // 每个字母下面会有多名歌手
      singerMap[key].list.push(map([element])[0]);
    }
  });
  const hot = [];
  const letter = [];
  // 遍历处理 singerMap，让结果有序
  for (const key in singerMap) {
    const item = singerMap[key];
    if (item.title.match(/[a-zA-z]/)) {
      letter.push(item);
    } else if (item.title === HOT_NAME) {
      hot.push(item);
    }
  }
  // 按字母顺序排序
  letter.sort((a, b) => {
    return a.title.charCodeAt(0) - b.title.charCodeAt(0);
  });
  const singers = hot.concat(letter);
  return singers;
}

// 做一层数据映射，构造单个 singer 数据结构
function map(singerList) {
  return singerList.map((item) => {
    return {
      id: item.id,
      name: item.name,
      pic: item.img1v1Url,
    };
  });
}
