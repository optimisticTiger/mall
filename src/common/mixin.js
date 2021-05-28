import {debounce} from './utils'
import BackTop from 'components/content/backTop/BackTop'
//混入
export const itemListenerMixin = {
  data() {
    return {
      itemImgListener: null
    }
  },
  mounted() {
    const refresh = debounce(this.$refs.scroll && this.$refs.scroll.refresh,50)
    this.itemImgListener = () => {
      refresh()
    }
    this.$bus.$on('itemImageLoad',this.itemImgListener)
  }
}

export const backTopMixin = {
  components: {
    BackTop
  },
  data() {
    return {
      isShowBackTop: false
    }
  },
  methods: {
    backClick() {
      this.$refs.scroll.scrollTo(0,0,500);
    },
    listenShowBackTop(position) {
      this.isShowBackTop = (-position.y) > 1000
     }
  }
}