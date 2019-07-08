<template>
  <div class="control-wrap">
    <el-button class="edit" @click.stop="click1" size="mini">{{status}}</el-button>
    <el-button class="edit" @click.stop="click2" size="mini">补装车</el-button>
    <el-button class="edit" @click.stop="click3" size="mini">合同生成</el-button>
    <el-button class="edit" @click.stop="click4" size="mini">合同上传</el-button>
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
      this.handlers.changeTransport(this.row)
    },
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

