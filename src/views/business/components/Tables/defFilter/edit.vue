<template>
  <!-- 输入框选择器 -->
  <div style="padding:10px">
    <el-input v-model="editData"
              :placeholder="placeholderStr"
              @blur="todoSearch"
              @keyup.enter.native="todoSearch"
              size="small"
              class="input-with-select">
      <!--<el-button slot="append" icon="el-icon-search" @click="todoSearch" />-->
    </el-input>
  </div>
</template>
<script>
export default {
  props: {
    label: {
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
      doanima: false
    }
  },
  mounted() {
  },
  destroyed() {},
  methods: {
    todoSearch() {
      if (this.editData) {
        this.$emit('getFilterBridge', {
          filterKey: this.filterKey,
          label: this.label,
          value: this.editData,
          ftn: this.ftn
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
