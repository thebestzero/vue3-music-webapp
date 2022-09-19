import { ref, watch, nextTick, computed } from "vue";
export default function useFixed(props) {
  const TITLE_HEIGHT = 30;
  // 歌手列表容器
  const groupRef = ref(null);
  // 列表区间的高度
  const listHeights = ref([]);
  // 纵向滚动值
  const scrollY = ref(0);
  // 区间值
  const currentIndex = ref(0);
  const distance = ref(0);
  // 文本
  const fixedTitle = computed(() => {
    if (scrollY.value < 0) {
      return "";
    }
    const currentGroup = props.singers[currentIndex.value];
    return currentGroup ? currentGroup.title : "";
  });
  // 固定标题向上过渡
  const fixedStyle = computed(() => {
    const distanceVal = distance.value;
    const diff =
      distanceVal > 0 && distanceVal < TITLE_HEIGHT
        ? distanceVal - TITLE_HEIGHT
        : 0;
    return {
      transform: `translate3d(0,${diff}px,0)`,
    };
  });
  // 当props数据变化计算
  watch(
    () => props.singers,
    async () => {
      await nextTick();
      calculate();
    }
  );
  // 监听scrollY的变化，判断落在那个区间内
  watch(scrollY, (newVal) => {
    const listHeightsVal = listHeights.value;
    for (let i = 0; i < listHeightsVal.length - 1; i++) {
      const heightTop = listHeightsVal[i];
      const heightBottom = listHeightsVal[i + 1];
      if (newVal >= heightTop && newVal <= heightBottom) {
        currentIndex.value = i;
        distance.value = heightBottom - newVal;
      }
    }
  });
  // 计算每个列表区间的高度
  function calculate() {
    const list = groupRef.value.children;
    const listHeightsVal = listHeights.value;
    let height = 0;
    // 重置数组
    listHeightsVal.length = 0;
    listHeightsVal.push(height);
    for (let i = 0; i < list.length; i++) {
      height += list[i].clientHeight;
      listHeightsVal.push(height);
    }
  }

  // scroll自定义事件回调
  function onScroll(pos) {
    scrollY.value = -pos.y;
  }
  return {
    groupRef,
    onScroll,
    fixedTitle,
    fixedStyle,
    currentIndex,
  };
}
