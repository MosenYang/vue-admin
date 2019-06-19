<template>
  <div class="control-wrap">
    <!--    <el-button :class="{send, 'hidden': isShort}" @click.stop="get" size="mini">自提</el-button>-->
    <el-button class="state" v-if="btns.length>=1"
               v-for="(item,index) in btns"
               :key="index"
               @click.stop="btnHandle(item)"
               size="mini">
      {{item}}
    </el-button>
    <el-button class="edit" @click.stop="edit" size="mini">编辑</el-button>
    <el-button class="delete-btn" @click.stop="deletes" size="mini">删除</el-button>
    <el-button class="upLoad" @click.stop="upLoad" size="mini">上传凭证</el-button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isShort: true,
      btns: []
    }
  },
  props: ['row', 'handlers'],
  computed: {},
  mounted() {
    this.btns = this.row.flow_button
  },
  methods: {
    edit() {
      this.handlers.editOrder(this.row)
    },
    btnHandle(item) {
      this.handlers.btnHandle(this.row, item)
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

