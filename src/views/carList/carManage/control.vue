<template>
  <div class="control-wrap">
    <el-button class="edit" @click.stop="click2" size="mini">编辑</el-button>
    <el-button class="edit" @click.stop="click3" size="mini">删除</el-button>
    <el-button class="edit" @click.stop="click4" size="mini">查看照片</el-button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      status: ''
    }
  },
  props: ['row', 'handlers'],
  methods: {
    click2() {
      this.handlers.addTransportAar(this.row)
    },
    click3() {
      this.handlers.createFile(this.row)
    },
    click4() {
      this.handlers.uploadFile(this.row)
    }
  },
  mounted() {
  }
}
</script>
<style lang="scss" scoped>
  @import "src/styles/mixin.scss";

  .control-wrap {
    display: flex;
    justify-content: flex-end;

    .el-button {
      @extend %blue-btn
    }

    .has_receipt {
      background: #f1f1f1;
    }

    .delete-btn {
      background: #ff0000;
      color: #ffffff;
      border: none;
    }
  }

</style>

