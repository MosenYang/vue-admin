<template>
  <div>
    <router-view/>
  </div>
</template>
<script>
// import ChildComponents from './ChildComponents.vue'
export default {
  components: {},
  props: {},
  data() {
    return {
      title: '组件标题',
      firstName: '',
      lastName: ''
    }
  },
  computed: {
    fullName() {
      return this.firstName + this.lastName
    }
  },
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {
    getCurrentDate() {
      return new Date().toLocaleDateString()
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "../../../../styles/mixin.scss";
  @import "../../../../styles/index.scss";

</style>
