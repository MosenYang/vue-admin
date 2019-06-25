<template>
  <div>
    <div class="page-title">创建板车信息</div>
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
                v-model="companyName"
                style="width: 100%"
                :fetch-suggestions="querySearch"
                placeholder="请输入板车公司名"
                @select="handleSelectCompany"
                :trigger-on-focus="false"
              ></el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col class="column-col" :lg="8" :md="12" :sm="12">
            <el-form-item label="姓名" prop="driver_name">
              <el-input v-model="temp.driver_name"/>
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
            <el-form-item label="车牌号" prop="license_plate_number">
              <el-input v-model="temp.license_plate_number"/>
            </el-form-item>
          </el-col>
          <el-col class="column-col" :lg="8" :md="12" :sm="12">
            <el-form-item label="车挂号" prop="trailer">
              <el-input v-model="temp.trailer"/>
            </el-form-item>
          </el-col>
          <el-col class="column-col" :lg="8" :md="12" :sm="12">
            <el-form-item label="身份证号">
              <el-input v-model="temp.id_card"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="column-col" :lg="8" :md="12" :sm="12">
            <el-form-item label="紧急联系人">
              <el-input v-model="temp.linkman"/>
            </el-form-item>
          </el-col>
          <el-col class="column-col" :lg="8" :md="12" :sm="12">
            <el-form-item label="联系人电话">
              <el-input v-model="temp.contact_number"/>
            </el-form-item>
          </el-col>
          <el-col class="column-col" :lg="8" :md="12" :sm="12">
            <el-form-item label="保额">
              <el-input v-model="temp.coverage"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="column-col" :lg="8" :md="12" :sm="12">
            <el-form-item label="车位数">
              <el-input v-model="temp.parking_spaces_num"/>
            </el-form-item>
          </el-col>
          <el-col class="column-col" :lg="8" :md="12" :sm="12">
            <el-form-item label="主线路">
              <el-input v-model="temp.main_circuit"/>
            </el-form-item>
          </el-col>
          <el-col class="column-col" :lg="8" :md="12" :sm="12"></el-col>
        </el-row>
        <el-row class="" :lg="24" :md="24" :sm="24">
          <el-form-item label="备注">
            <el-input v-model="temp.remarks"
                      :autosize="{ minRows: 4, maxRows: 6}" type="textarea"
                      placeholder="请填写备注"/>
          </el-form-item>
        </el-row>
        <el-form-item class="dialog-footer">
          <el-button type="primary" @click="addContractor('dataForm')">保存</el-button>
          <el-button>返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { searchType } from '../../../../api/baseApi'
import { transportAdd } from '../../../../api/contractorManage/transportCarInfo'

var defData = {
  vehicle_belong: '外协车辆',//车辆所属
  company_id: '',// 承运商公司id
  driver_name: '',// 司机名字
  mobile: '',
  parking_spaces_num: '',//车位数
  license_plate_number: null,// 车牌号
  main_circuit: '',// 主路线
  coverage: '',// 保额
  id_card: '',// 身份证
  trailer: '',// 车挂号
  linkman: '',//经济联系人
  contact_number: '',// 联系电话
  remarks: ''// 备注
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
    let checkDown = (rule, value, callback) => {
      let companyName = this.companyName
      if (!companyName || companyName == '') {
        this.temp.company_id = null
        return callback(new Error('请填入公司名称'))
      }
      if (this.temp.company_id) {
        callback()
      } else {
        return callback(new Error('请选系统匹配的选项'))
      }
    }
    return {
      pageType: 0,//0 新增 1 编辑
      statusOptions: [],
      statusOptions1: [],
      statusOptions2: [],
      companyOption: mockData,
      companyName: null,
      rules: {
        company: [{ required: true, validator: checkDown, trigger: ['blur', 'select', 'change'] }],
        driver_name: [
          { required: true, message: '姓名不能为空', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 6 个字符', trigger: 'blur' }
        ],
        license_plate_number: [
          { required: true, message: '车牌号不能为空', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 10个字符', trigger: 'blur' }
        ],
        trailer: [
          { required: true, message: '车挂号不能为空', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        mobile: [{ required: true, validator: checkPhone, trigger: 'blur' }],
        type: [{ required: true, message: '请选择商业类型', trigger: 'change' }]
      },
      temp: defData,
      contractorType
    }
  },
  props: {},
  computed: {},
  watch: {},
  created() {
    this.getOptionData()
  },
  async mounted() {
    let id = this.$route.query.id
    console.log('this.$route.query', this.$route.query)
    if (id) {
      this.pageType = 1
      this.temp = Object.assign({}, this.$route.query)
      if (this.temp.start_city) {
        await this.getStartProvince(this.temp.start_city)
      }
      if (this.temp.end_city) {
        await this.getEndProvince(this.temp.end_city)
      }
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
      this.temp.company_id = item.id
      this.companyName = item.value
    },
    //添加或者编辑
    addContractor(formName) {
      console.log('params参数', this.temp)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          transportAdd(this.temp).then((res) => {
            if (res.code == 200) {
              this.$message({
                type: 'success',
                message: '添加成功'
              })
            }
          })
        } else {
          console.log('提交有误!!')
          return false
        }
      })

    },
    getOptionData() {}
  },
  components: {}
}
var contractorType = [
  {
    key: 'transport',
    name: '运输承运商'
  },
  {
    key: 'tisong',
    name: '提送承运商'
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
