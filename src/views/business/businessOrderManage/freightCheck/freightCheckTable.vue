<template>
  <div>
    运费校验
  </div>
</template>
<script>
// import ChildComponents from './ChildComponents.vue'
export default {
  data() {
    return {
      title: '组件标题',
      firstName: '',
      lastName: ''
    }
  },
  props: {},
  computed: {
    fullName() {
      return this.firstName + this.lastName
    }
  },
  watch: {},
  methods: {
    getCurrentDate() {
      return new Date().toLocaleDateString()
    }
  },
  created() {
  },
  mounted() {
  },
  components: {}
}
</script>
<style lang='scss' scoped>
  /*@import "src/styles/mixin.scss"*/
  /*@import "../../../../styles/index.scss";*/

</style>
