<template>
  <!-- 输入框选择器 -->
  <div>
    <el-input v-model="editData"
              :placeholder="placeholderStr"
              @blur="todoSearch"
              @keyup.enter.native="todoSearch"
              size="small"
              class="input-with-select">
      <i slot="prefix" class="el-input__icon el-icon-search"></i>
      <!--<el-button slot="append" icon="el-icon-search" @click="todoSearch" />-->
    </el-input>
  </div>
</template>
<script>
export default {
  name:'editFilter',
  props: {
    label: {
      type: String,
      default: ''
    },
    paramKey:{
      type: String,
      default: ''
    },
    filterKey: {
      type: String,
      default: ''
    },
    ftn: {
      type: String,
      default: ''
    },
    placeholderStr: {
      type: String,
      default: '请输入内容'
    },
    sClass: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      editData: null,
    }
  },
  mounted() {},
  destroyed() {},
  methods: {
    todoSearch() {
      if (this.editData) {
        this.$emit('getFilterBridge', {
          filterKey: this.filterKey,
          label: this.label,
          value: this.editData,
          paramKey: this.paramKey
        })
        this.editData = ''
      }
    }
  }
}
</script>

<style scoped>
  @import '../css/common.css';
</style>
