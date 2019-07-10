<template>
  <div>
    <!--详情 https://blog.csdn.net/xr510002594/article/details/84108882-->
    <baidu-map class="bm-view" ak="Um8BbQX25uFFn8kqYukNmUP5a0y9jU0y"
               zoom="12.8" @ready="handler" :scroll-wheel-zoom="true"
               center="上海">
      <bm-navigation anchor="BMAP_ANCHOR_TOP_LEFT"></bm-navigation>
    </baidu-map>
  </div>
</template>
<script>
import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
import { BmNavigation } from 'vue-baidu-map'

export default {
  components: {
    BaiduMap, BmNavigation
  },
  props: {},
  data() {
    return {
      center: { lng: 0, lat: 0 },
      zoom: 0
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    handler({ BMap, map }) {
      console.log(BMap, map)
      this.center.lng = 116.404
      this.center.lat = 39.915
      this.zoom = 10
    }
  }
}
</script>
<style lang="scss" scoped>
  .bm-view {
    width: 100%;
    height: 500px;
  }
</style>
