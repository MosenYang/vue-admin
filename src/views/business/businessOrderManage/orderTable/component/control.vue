<template>
  <div class="control-wrap">
    <el-button class="send" @click.stop="click1" size="mini">自提</el-button>
    <el-button class="state" @click.stop="click2" size="mini">送车</el-button>
    <el-button class="edit" @click.stop="click2" size="mini">编辑</el-button>
    <el-button class="delete-btn" @click.stop="click2" size="mini">删除</el-button>
    <el-button class="upLoad" @click.stop="click2" size="mini">上传凭证</el-button>
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
  @import "src/styles/mixin.scss";
  .control-wrap{
    display: flex;
    .el-button {
      @extend %blue-btn
    }
    .delete-btn{
      background: #ff0000;
      color: #ffffff;
      border: none;
    }
  }

</style>

