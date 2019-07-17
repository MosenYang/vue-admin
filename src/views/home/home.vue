<template>
  <div class="page">
    <!--    <div class="title">百度版</div>-->
    <!--    <BaiDuMap></BaiDuMap>-->
    <div class="title">高德版地图</div>
    <a-map></a-map>
  </div>
</template>
<script>

  import BaiDuMap from '@/components/Map/BaiDuMap'
  import AMap from '../../components/Map/AMap-gaode'

  export default {
    components: {
      BaiDuMap, AMap
    },
    props: {},
    data() {
      return {}
    },
    computed: {},
    watch: {},
    created() {},
    mounted() {},
    methods: {}
  }
</script>
<style lang="scss" scoped>
  @import "src/styles/mixin.scss";

  .page {
    font-size: j(20);
  }
</style>
