<template>
  <div class="control-wrap">
    <el-button @click.stop="click1" size="mini">编辑</el-button>
    <el-button @click.stop="click2" size="mini">删除</el-button>
    <el-button @click.stop="click2" size="mini">删除</el-button>
    <el-button @click.stop="click2" size="mini">删除</el-button>
    <el-button @click.stop="click2" size="mini">上传</el-button>
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
<style lang="scss" scoped>
  .control-wrap{
    display: flex;
  }

</style>

