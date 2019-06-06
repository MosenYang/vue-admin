<template>
  <div style="border:1px solid red;display: flex;">
    <el-button size="mini" @click.stop="click1">编辑</el-button>
    <el-button size="mini" style="" @click.stop="click2">删除</el-button>
  </div>
</template>
<script>
export default {
  props: ['row', 'handlers'],
  methods: {
    click1 () {
      this.handlers.firsth(this.row)
    },
    click2 () {
      this.handlers.second(this.row)
    }
  }
}
</script>

