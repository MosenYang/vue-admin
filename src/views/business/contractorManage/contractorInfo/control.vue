<template>
  <div class="control-wrap">
    <el-button class="edit" @click.stop="edit" size="mini">编辑</el-button>
    <el-button class="delete-btn" @click.stop="deletes" size="mini">删除</el-button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isShort: true,
    }
  },
  props: ['row', 'handlers'],
  computed: {},
  mounted() {
  // @commonHandlerBridge="commonHandlerBridge"
  // @doactive="doactive"/>
  },
  methods: {
    edit() {
      this.handlers.editOrder(this.row)
    },
    deletes() {
      this.handlers.deleteOrder(this.row)
    },
    upLoad() {
      this.handlers.upLoadOrder(this.row)
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "src/styles/mixin.scss";

  .hidden {
    opacity: 0;
    z-index: -99;
  }

  .control-wrap {
    display: flex;
    justify-content: flex-end;

    .el-button {
      @extend %blue-btn
    }

    .delete-btn {
      background: #ff0000;
      color: #ffffff;
      border: none;
    }
  }

</style>

