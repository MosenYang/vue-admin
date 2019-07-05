<template>
  <div>
    <div v-if="!comType||comType==='edit'">
      <!-- background: #36c6d3;-->
      <el-input v-model="editData"
                placeholder="请填写"
                size="small"
                @keyup.enter.native="todoSearch"
                class="input-with-select">
        <el-button slot="append" size="mini" style="border: none;" @click="todoSearch">确定</el-button>
      </el-input>
    </div>
    <div v-if="comType==='select'">
      <el-select v-model="inputValue"
                 value-key="id"
                 size="small"
                 @change="handleCallback"
                 placeholder="请选择">
        <el-option v-for="item in options"
                   :key="item.id"
                   :label="item.name"
                   :value="item">
        </el-option>
      </el-select>
    </div>
  </div>
</template>
<script>
import { checkAction } from '../../../../api/business/businessOrder/freightCheck'

export default {
  data() {
    return {
      editData: null,
      inputValue: null,
      options: [],
      comType: null
    }
  },
  // tdParam 接口Key
  // tdValue 表格值
  props: ['row', 'tdConfig', 'tdParam', 'tdValue'],
  computed: {},
  watch: {},
  mounted() {
    this.getOption()
  },
  methods: {
    getOption() {
      // 赋值默认
      if (this.tdValue) this.editData = this.inputValue = this.tdValue
      // 区分类型
      if (this.tdConfig.comType) this.comType = this.tdConfig.comType
      // 遍历项
      if (!this.tdConfig.comData) return
      this.tdConfig.comData.forEach((item) => {
        let obj = {
          id: item.value || item.id || item.key,
          name: item.name || item.label || item.area_name
        }
        this.options.push(obj)
      })
    },
    setData(data) {
      console.log('修改参数', data)
      if (data.value == '') {
        return this.$message({
          type: 'warning',
          message: '值不能为空'
        })
      }
      checkAction(data).then((res) => {
        if (res.code == 200) {
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
        }
      })
    },
    handleCallback() {
      let param = {
        id: this.row.id,
        type: this.tdParam,
        value: this.inputValue.id
      }
      this.setData(param)
    },
    todoSearch() {
      let param = {
        id: this.row.id,
        type: this.tdParam,
        value: this.editData
      }

      this.setData(param)
    }
  }
}
</script>
<style lang='scss' scoped>
  /*@import "src/styles/mixin.scss";*/
  /*@import "../../../../styles/index.scss";*/

</style>
