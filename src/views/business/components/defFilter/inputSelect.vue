<template>
  <el-input
    v-model="inputValue"
    placeholder="请输入内容"
    maxlength="20"
    show-word-limit
  >
    <i slot="prefix" class="el-input__icon el-icon-search" />
  </el-input>
</template>
<script>
export default {
  name: 'SelectCom',
  components: {},
  props: {},
  data() {
    return {
      inputValue: ''
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {}
}
</script>
<style lang="scss" scoped>
  /*@import "../base/reset.css";*/

</style>
