<template>
  <div>
    <div class="page-title">{{pageType === 0?'新增':'编辑'}}提送车辆信息</div>
    <div>
      <el-form ref="dataForm"
               :rules="rules"
               :model="temp"
               label-position="right"
               label-width="100px"
               style="padding: 30px 40px 20px 0">
        <el-row>
          <el-col class="column-col" :lg="8" :md="12" :sm="12">
            <el-form-item label="公司名称" prop="company">
              <el-autocomplete
                v-model="company"
                style="width: 100%"
                :fetch-suggestions="querySearch"
                placeholder="请输入板车公司名"
                @select="handleSelectCompany"
                :trigger-on-focus="false"
              ></el-autocomplete>
            </el-form-item>

          </el-col>
          <el-col class="column-col" :lg="8" :md="12" :sm="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="temp.name"/>
            </el-form-item>
          </el-col>
          <el-col class="column-col" :lg="8" :md="12" :sm="12">
            <el-form-item label="手机号" prop="mobile">
              <el-input v-model="temp.mobile"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="column-col" :lg="8" :md="12" :sm="12">
            <el-form-item label="车牌号" prop="name">
              <el-input v-model="temp.car_num"/>
            </el-form-item>
          </el-col>
          <el-col class="column-col" :lg="8" :md="12" :sm="12">
            <el-form-item label="身份证号" prop="id_card">
              <el-input v-model="temp.id_card"/>
            </el-form-item>
          </el-col>
          <el-col class="column-col" :lg="8" :md="12" :sm="12">
            <el-form-item label="经营范围" prop="business_scope">
              <el-input v-model="temp.business_scope"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="column-col" :lg="8" :md="12" :sm="12">
            <el-form-item label="验车权限" prop="validate">
              <div class="flex">
                <el-select v-model="temp.validate" placeholder="验车权限" style="width: 100%">
                  <el-option v-for="item in typeOption"
                             :key="item.key" :label="item.name" :value="item.key"/>
                </el-select>
              </div>
            </el-form-item>
          </el-col>
          <el-col class="column-col" :lg="8" :md="12" :sm="12">
            <el-form-item label="入库权限" prop="warehousing">
              <div class="flex">
                <el-select v-model="temp.warehousing" placeholder="入库权限" style="width: 100%">
                  <el-option v-for="item in typeOption"
                             :key="item.key" :label="item.name" :value="item.key"/>
                </el-select>
              </div>
            </el-form-item>
          </el-col>
          <el-col class="column-col" :lg="8" :md="12" :sm="12"></el-col>
        </el-row>
        <el-row class="" :lg="24" :md="24" :sm="24">
          <el-form-item label="备注">
            <el-input v-model="temp.comment"
                      :autosize="{ minRows: 4, maxRows: 6}" type="textarea"
                      placeholder="请填写"/>
          </el-form-item>
        </el-row>
        <el-form-item class="dialog-footer">
          <el-button type="primary" @click="addContractor('dataForm')">
            {{pageType === 0?'创建':'编辑'}}
          </el-button>
          <el-button>
            返回
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { searchType } from '../../../../api/baseApi'
import { contractorUpdate, contractorAdd } from '../../../../api/contractorManage/contractor'

let defParam = {
  // id: null,
  vehicles: 0,// 1.自有车辆 2.外协车辆
  company: '',
  name: '',
  mobile: '',
  business_scope: '',
  car_num: null,//
  validate: '',
  id_card: '',
  warehousing: '',
  comment: ''
}
export default {
  data() {
    let checkStr = (rule, value, callback) => {
      let reg = new RegExp('[`~!@#$^&*()=|{}\':\',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“\'。，、？]')
      let rs = reg.test(value)
      if (rs) {
        callback(new Error('内容存在特殊字符!'))
      } else {
        callback()
      }
    }
    let checkPhone = (rule, value, callback) => {
      const reg = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/
      if (!value) {
        return callback(new Error('手机号不能为空'))
      }
      if (value.length !== 11) {
        console.log('vvvv', value.length)
        return callback(new Error('请输入11位手机号'))
      }
      if (reg.test(value)) {
        return callback()
      }
      return callback(new Error('请输入正确的手机号'))
    }
    //验证(值是对象)
    let checkDownObj = (rule, value, callback) => {
      if (value && value.key ||value && value.id || value && value.value) {
        callback()
      } else {
        return callback(new Error('请选系统匹配的选项'))
      }
    }
    // 验证(值是id)
    let checkDownId = (rule, value, callback) => {
      if (value||value===0) {
        callback()
      } else {
        return callback(new Error('请选系统匹配的选项'))
      }
    }
    // 模糊查询验证
    let checkDownMisIn = (rule, value, callback) => {
      let companyName = this.company
      if (!companyName || companyName == '') {
        this.temp.company = null
        return callback(new Error('请填入公司名称'))
      }
      if (this.temp.company) {
        callback()
      } else {
        return callback(new Error('请选系统匹配的选项'))
      }
    }
    return {
      pageType: 0,//0 新增 1 编辑
      statusOptions: [],
      company: '',
      rules: {
        company: [{ required: true, validator: checkDownMisIn, trigger: ['blur', 'select', 'change'] }],
        name: [
          { required: true, message: '姓名不能为空', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 6 个字符', trigger: 'blur' }
        ],
        car_num: [
          { required: true, message: '车牌号不能为空', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 10个字符', trigger: 'blur' }
        ],
        business_scope: [
          { required: true, message: '经营范围不能为空', trigger: 'blur' }
        ],
        mobile: [{ required: true, validator: checkPhone, trigger: 'blur' }],
        id_card: [
          { required: true, message: '车挂号不能为空', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        validate: [
          { required: true, validator: checkDownId, trigger: 'change' }
        ],
        warehousing: [{ required: true, validator: checkDownId, trigger: 'change' }]
      },
      temp: defParam,
      typeOption,
      companyOption: mockData
    }
  },
  props: {},
  computed: {},
  watch: {},
  created() {
  },
  async mounted() {
    let id = this.$route.query.id
    console.log('this.$route.query', this.$route.query)
    if (id) {
      this.pageType = 1
      this.temp = Object.assign({}, this.$route.query)
    }
  },
  methods: {
    // 匹配
    querySearch(queryString, cb) {
      let companyOption = this.companyOption
      let createFilter = (query) => {
        return (item) => {
          return (item.value.toLowerCase().indexOf(query.toLowerCase()) === 0)
        }
      }
      let results = queryString ? companyOption.filter(createFilter(queryString)) : companyOption
      cb(results)
    },
    // 选公司
    handleSelectCompany(item) {
      console.log(item)
      this.temp.company = item.value
      this.company = item.value
    },
    //添加或者编辑
    addContractor(formName) {
      console.log('params参数', this.temp)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.pageType === 1) {
            contractorUpdate(this.temp).then((res) => {
              if (res.code == 200) {
                this.$message({
                  type: 'success',
                  message: '编辑成功'
                })
              }
            })
          }
          if (this.pageType === 0) {
            contractorAdd(this.temp).then((res) => {
              if (res.code == 200) {
                this.$message({
                  type: 'success',
                  message: '添加成功'
                })
              }
            })
          }
        } else {
          console.log('提交有误!!')
          return false
        }
      })
    }
  },
  components: {}
}
var typeOption = [
  {
    key: 1,
    name: '是'
  },
  {
    key: 0,
    name: '否'
  }
]
var mockData = [
  { 'value': '三全鲜食（北新泾店）', 'address': '长宁区新渔路144号', id: 89 },
  { 'value': 'Hot honey 首尔炸鸡（仙霞路）', 'address': '上海市长宁区淞虹路661号', id: 88 },
  { 'value': '新旺角茶餐厅', 'address': '上海市普陀区真北路988号创邑金沙谷6号楼113', id: 15 },
  { 'value': '泷千家(天山西路店)', 'address': '天山西路438号', id: 23 }
]
</script>
<style lang='scss' scoped>
  @import "src/styles/mixin.scss";

  .page-title {
    font-size: j(30);
    padding: j(10) j(20);
    margin: j(5) 0;
    box-shadow: 0 2px 10px #f2f2f2;
  }

  .el-row {
    margin: j(20) 0;
  }

  .dialog-footer {
    text-align: center;
    height: j(100);
  }

</style>
