<!--装车排版-->
<template>
  <div class="page">
    <div class="page-title flex-between">
      <mallki class-name="mallki-text" text="装车排版"/>
      <div class="">
        <el-button v-waves type="primary">
          选择路线
        </el-button>
        <el-button v-waves type="primary">
          添加路线
        </el-button>
        <el-button v-waves type="primary">
          保存路线
        </el-button>
      </div>
    </div>
    <div class="page-addressLine">
      <div>

      </div>
    </div>
  </div>
</template>
<script>
// import ChildComponents from './ChildComponents.vue'
import waves from '@/directive/waves/index.js' // 水波纹指令
export default {
  components: {},
  props: {},
  data() {
    return {
      title: '组件标题'
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    getCurrentDate() {
      return new Date().toLocaleDateString()
    }
  },
  directives: { waves }
}
</script>
<style lang="scss" scoped>
  @import "src/styles/mixin.scss";

  .page-title {
    font-size: j(30);
    padding: j(10) j(20);
    margin: j(5) 0;
    box-shadow: 0 2px 10px #f2f2f2;
    font-weight: 400;

    .el-button {
      @extend %cyan-btn
    }
  }

</style>
