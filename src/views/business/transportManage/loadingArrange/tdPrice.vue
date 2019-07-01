<template>
  <div>
    <el-input v-model="editData"
              :placeholder="tdConfig.placeholder"
              @blur="todoSearch"
              @keyup.enter.native="todoSearch"
              size="medium"
              class="input-with-select">
      <el-button slot="append" @click="todoSearch">确定</el-button>
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
      console.log('', this.row)
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
