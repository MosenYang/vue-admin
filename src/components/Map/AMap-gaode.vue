<template>
  <div class="page">
    <div id="container" class="container"></div>
  </div>
</template>
<script>
  export default {
    components: {  },
    data() {
      return {
        map: null,
      }
    },
    props: {},
    computed: {},
    watch: {},
    created() {
      this.mapInit()
      //MosenKey	224c2c3197dfe223efbc17e15b32c92f
    },
    mounted() {},
    methods: {
      mapInit() {
        this.map = new window.AMap.Map('container', {
          zoom: 11,//级别
          center: [116.397428, 39.90923],//中心点坐标
          viewMode: '3D'//使用3D视图
        })
        console.log('map', this.map)
      },
      getMap() {
      }
    }
  }
</script>
<style scoped>
  /*@import "../base/reset.css";*/
.container{
  width: 100%;
  height: 600px;
}

</style>
