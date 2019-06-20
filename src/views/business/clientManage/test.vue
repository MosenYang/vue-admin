<template>
<!--  这是一个基础版本的表单/-->
  <div>
    <div>
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px"
               style="width: 400px; margin-left:50px;">
        <!--        -->
        <el-row>
          <el-col class="column-col" :lg="6" :md="12" :sm="12">
            <el-form-item label="类型" prop="type">
              <el-select v-model="temp.type"
                         class="filter-item"
                         placeholder="请选择类型">
                <el-option v-for="item in calendarTypeOptions"
                           :key="item.key"
                           :label="item.display_name"
                           :value="item.key"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col class="column-col" :lg="6" :md="12" :sm="12">
            <el-form-item label="日期" prop="timestamp">
              <el-date-picker v-model="temp.timestamp"
                              type="datetime"
                              placeholder="请选择日期"/>
            </el-form-item>
          </el-col>
          <el-col class="column-col" :lg="6" :md="12" :sm="12">
            <el-form-item label="标题" prop="title">
              <el-input v-model="temp.title"/>
            </el-form-item>
          </el-col>
        </el-row>
        <!--        -->
        <el-row>
          <el-col class="column-col" :lg="6" :md="12" :sm="12">
            <el-form-item label="状态">
              <el-select v-model="temp.status" class="filter-item" placeholder="请选择">
                <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col class="column-col" :lg="6" :md="12" :sm="12">
            <el-form-item label="点评">
              <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea"
                        placeholder="请填写"/>
            </el-form-item>
          </el-col>
        </el-row>
        <!--        wan-->


        <el-form-item label="类型" prop="type">
          <el-select v-model="temp.type" class="filter-item" placeholder="请选择类型">
            <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name"
                       :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item label="日期" prop="timestamp">
          <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="请选择日期"/>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="temp.title"/>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="temp.status" class="filter-item" placeholder="请选择">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item"/>
          </el-select>
        </el-form-item>

        <el-form-item label="点评">
          <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea"
                    placeholder="请填写"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="createData">
          确定
        </el-button>
      </div>
    </div>
  </div>
</template>
<script>
////用户名正则，4到16位（字母，数字，下划线，减号）
//var uPattern = /^[a-zA-Z0-9_-]{4,16}$/;
// var cP = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
//QQ号正则，5至11位
// var qqPattern = /^[1-9][0-9]{4,10}$/;
// import ChildComponents from './ChildComponents.vue'
const calendarTypeOptions = [
  { key: 'CN', display_name: '中国' },
  { key: 'US', display_name: '美国' },
  { key: 'JP', display_name: '日本' },
  { key: 'EU', display_name: '韩国' }
]
// arr to obj, such as { CN : "China", US : "USA" } // 过滤给表格用
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})
export default {
  components: {},
  props: {},
  data() {
    return {
      list: null,
      calendarTypeOptions,
      statusOptions: ['添加', '对比', '删除'],
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      }
    }
  },
  computed: {
    fullName() {
      return 1
    }
  },
  watch: {},
  created() {
  },
  mounted() {

  },
  methods: {
    handleCreate() {
      this.resetTemp()
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    }
  }
}
</script>
<style scoped>
  /*@import "../base/reset.css";*/

</style>
