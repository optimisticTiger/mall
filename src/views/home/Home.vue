<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control :titles="['流行','新款','精选']" @tabClick="tabClick" ref="tabControl1" class="tab-control" v-show="isTabFixed"/>
     <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll" :pull-up-load="true" @pullingUp="loadMore">
       <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
       <recommend-view :recommends="recommends"/>
       <FeatureView/>
       <tab-control :titles="['流行','新款','精选']" @tabClick="tabClick" ref="tabControl2"/>
       <goods-list :goods="showGoods"/>
     </scroll>

     <back-top @click.native="backClick" v-show="isShowBackTop"/>
  </div>
</template>

<script>

import HomeSwiper from './childComps/HomeSwiper';
import recommendView from './childComps/RecommendView';
import FeatureView from './childComps/FeatureView';

import NavBar from 'components/common/navbar/NavBar';
import TabControl from 'components/content/tabControl/TabControl';
import GoodsList from 'components/content/goods/GoodsList';
import Scroll from 'components/common/scroll/Scroll';
// import BackTop from 'components/content/backTop/BackTop'

import {getHomeMultidata,getHomeGoods} from "network/home";
// import Swiper from 'components/common/swiper/Swiper'
// import SwiperItem from 'components/common/swiper/SwiperItem'
import {debounce} from "common/utils"
import {itemListenerMixin, backTopMixin} from 'common/mixin'


export default {
  name: "Home",
  components: {
    HomeSwiper,
    recommendView,
    FeatureView,
    NavBar,
    TabControl,
    GoodsList,
    Scroll,
    // BackTop
  },
  mixins: [itemListenerMixin, backTopMixin],
  data() {
    return {
      banners: [],
      recommends: [],
      goods: {
        'pop': {page: 0,list: []},
        'new': {page: 0,list: []},
        'sell': {page: 0,list: []}
      },
      currentType: 'pop',
      // isShowBackTop: false,
      tabOffsetTop: 0,
      isTabFixed: false,
      saveY: 0,
    }
  },
  computed: {
    showGoods() {
      return this.goods[this.currentType].list
    },
    activated() {
      this.$refs.scroll.scrollTo(0,this.saveY,0)
      this.$refs.scroll.refresh()
    },
    deactivated() {
      this.saveY = this.$refs.scroll.getScrollY()
      //取消全局事件的监听
      this.$bus.$off('itemImgLoad',this.itemImgListener)
    }
  },
  created() {
    // 1.请求多个数据
    this.getHomeMultidata()
    // getHomeMultidata().then(res => {
    //   this.result = res;
      // console.log(res);
      
    //   this.banners = res.data.banner.list;
    //   this.recommends = res.data.recommend.list;
    // }),
    //2.请求商品数据
    this.getHomeGoods('pop')
    this.getHomeGoods('new')
    this.getHomeGoods('sell')
  //   getHomeGoods('pop',1).then(res => {
  //     console.log(res);     
  //   })
  },
  mounted() {
    // //1.监听item中图片加载完成
    // const refresh = debounce(this.$refs.scroll && this.$refs.scroll.refresh,50)
    // this.itemImgListener = () => {
    //   refresh()
    // }
    // this.$bus.$on('itemImageLoad', this.itemImgListener)
  },
  methods: {
    /**
     * 事件监听相关的方法
     */
    tabClick(index) {
      switch(index) {
        case 0:
          this.currentType = 'pop'
          break
        case 1:
          this.currentType = 'new'
          break
        case 2:
          this.currentType = 'sell'
          break
      }
      this.$refs.tabControl1.currentIndex = index
      this.$refs.tabControl2.currentIndex = index
    },
    // backClick() {
    //   this.$refs.scroll.scrollTo(0,0,500);
    // },
    contentScroll(position) {
      //1.判断backtop是否显示
      // this.isShowBackTop = (-position.y) > 1000
      this.listenShowBackTop(position)
      //2.决定tabcontrol是否吸顶
      this.isTabFixed = (-position.y) > this.tabOffsetTop
    },
    loadMore() {
      // console.log('jiazai');
      this.getHomeGoods(this.currentType)
    },
    swiperImageLoad() {
      //2.获取tabControl的offsetTop
      //所有组件都有一个属性$el用于获取组件内的元素
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
    },
    /**
     * 网络请求相关的方法
     */
    getHomeMultidata() {
      getHomeMultidata().then(res => {
      // this.result = res;
      // console.log(res);
      
      this.banners = res.data.banner.list;
      this.recommends = res.data.recommend.list;
    })
    },
    getHomeGoods(type) {
      const page = this.goods[type].page + 1
      getHomeGoods(type,page).then(res => {
      console.log(res);
      this.goods[type].list.push(...res.data.list)
      this.goods[type].page += 1

      this.$refs.scroll.finishPullUp()
    })
    }
  }
}
</script>

<style scoped>

  #home {
    /* padding-top: 44px; */
    height: 100vh;
    position: relative;
  }

  .home-nav {
    background-color: var(--color-tint);
    color: #fff;

  /*在使用浏览器原生滚动时，为了让导航不随着一起滚动*/
    /* position: fixed;
    left: 0;
    right: 0;
    top: 0;

    z-index: 9; */
  }
  /* .tab-control {
    position: sticky;
    top: 44px;
    z-index: 9;
  } */
  
  .tab-control {
    position: relative;
    z-index: 9;
  }

  .content {
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }
</style>