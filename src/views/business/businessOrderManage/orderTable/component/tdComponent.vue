<template>
  <div>
    <el-input v-model="editData"
              :placeholder="tdConfig.placeholder"
              @blur="todoSearch"
              @keyup.enter.native="todoSearch"
              size="small"
              class="input-with-select">
      <el-button slot="append" icon="el-icon-search" @click="todoSearch"/>
    </el-input>
  </div>
</template>
<script>
export default {
  data() {
    return {
      editData:''
    }
  },
  props: ['row', 'tdConfig'],
  computed: {},
  watch: {},
  methods: {
    todoSearch(){
      console.log('this.tdConfig.t', this.tdConfig.t)
    }
  },
  created() {},
  mounted() {},
  components: {}
}
</script>
<style lang='scss' scoped>
  /*@import "src/styles/mixin.scss"*/
  /*@import "../../../../styles/index.scss";*/

</style>
