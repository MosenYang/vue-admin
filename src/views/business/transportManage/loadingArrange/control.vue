<template>
  <div class="control-wrap">
    <el-button class="edit" @click.stop="click1" size="mini">合同上传</el-button>
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
    click1() {
      this.handlers.changeTransport(this.row, this.status)
    }
  },
  mounted() {
    if (this.row.now_status === '未发车') {
      this.status = '发车'
    }
    if (this.row.now_status === '运输中') {
      this.status = '添加在途'
    }
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

