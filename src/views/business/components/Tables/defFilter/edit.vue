<template>
  <!-- 输入框选择器 -->
  <div style="padding:10px">
    <el-input v-model="editdata" :placeholder="placeholderStr" class="input-with-select" clearable>
      <el-button slot="append" icon="el-icon-search" @click="todoSearch" />
    </el-input>
  </div>
</template>

<script>
export default {
  props: {
    sClass: {
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
    }
  },
  data() {
    return {
      editdata: '',
      doanima: false
    }
  },
  mounted() {
    if (this.sClass) {
      setTimeout(() => {
        this.doanima = true
      }, 600)
    }
  },
  methods: {
    todoSearch() {
      if (this.editdata) {
        this.$emit('getFilterBridge', {
          key: this.filterkey,
          label: this.editdata,
          value: this.editdata,
          ftn: this.ftn
        })
        this.editdata = ''
      }
    }
  }
}
</script>

<style scoped>
@import '../css/common.css';
.filterWrap.show {
  opacity: 1;
  height: 100px;
}
.editFilter {
  position: absolute;
  width: 300px;
}
</style>
