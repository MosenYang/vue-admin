<template>
  <div />
</template>
<script>
export default {
  components: {},
  props: {},
  // 组件私有数据（必须是function，而且要return对象类型）
  data() {
    return {}
  },
  computed: {
    fullName() {
      return this.firstName + this.lastName
    }
  },
  watch: {
    title(preVal, newVal) {
      console.log(`改变之前的值：；改变之后的值：`)
    }
  },
  // 生命周期钩子：组件实例完成创建之后调用
  created() {
    console.log('组件实例完成创建component created')
  },
  // 生命周期钩子：组件实例渲染完成时调用
  mounted() {
    console.log('组件实例渲染完成component mounted')
  },
  methods: {
    getCurrentDate() {
      return new Date().toLocaleDateString()
    }
  },
  // 生命周期钩子：实例初始化之后，数据观测(data observer) 和 event/watcher 事件配置之前被调用
  beforeCreated() {
    console.log('component before created')
  }
}
</script>
<style scoped>

</style>
