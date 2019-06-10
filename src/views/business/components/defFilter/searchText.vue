<template>
  <div style="padding: 10px">
    <el-input :ref="refName"
              v-model="inputValue"
              :placeholder='placeholder'
              maxlength="20"
              show-word-limit
              @blur="handleBlur"
              @keyup.enter.native="$event.target.blur">
      <i slot="prefix" class="el-input__icon el-icon-search"></i>
    </el-input>
  </div>
</template>
<script>
export default {
  name: 'searchText',
  props: {
    placeholder: {
      type: String,
      default: '未定义'
    },
    filterKey: {
      type: String,
      default: ''
    },
    refName: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      inputValue: ''
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    handleBlur() {
      if (!this.inputValue) return
      this.$emit('getFilterBridge', {
        type: 'text',
        key: this.filterkey,
        label: this.label,
        value: this.inputValue
      })
      this.inputValue = null
    }
  }
}
</script>
<style scoped>
  /*@import "../base/reset.css";*/

</style>
