<template>
  <div>
    <div class="page-title">{{pageType === 0?'新增':'编辑'}}运输报价</div>
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
                placeholder="请输入公司名"
                @select="handleSelectCompany"
                :trigger-on-focus="false"
              ></el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col class="column-col" :lg="8" :md="12" :sm="12">
            <el-form-item label="报价人" prop="quotation_user">
              <el-input v-model="temp.quotation_user"/>
            </el-form-item>
          </el-col>
          <el-col class="column-col" :lg="8" :md="12" :sm="12">
            <el-form-item label="电话" prop="mobile">
              <el-input v-model="temp.mobile"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="column-col" :lg="8" :md="12" :sm="12">
            <el-form-item label="发站地" prop="start_city">
              <div class="flex">
                <el-select v-model="temp.start_province" @change="getStartProvince" placeholder="请选择省">
                  <el-option v-for="item in statusOptions"
                             :key="item.id" :label="item.area_name" :value="item.id"/>
                </el-select>
                <el-select v-model="temp.start_city" placeholder="请选择市">
                  <el-option v-for="item in statusOptions1"
                             :key="item.id" :label="item.area_name" :value="item.id"/>
                </el-select>
              </div>
            </el-form-item>
          </el-col>
          <el-col class="column-col" :lg="8" :md="12" :sm="12">
            <el-form-item label="到站地" prop="end_city">
              <div class="flex">
                <el-select v-model="temp.end_province" @change="getEndProvince" placeholder="请选择省">
                  <el-option v-for="item in statusOptions"
                             :key="item.id" :label="item.area_name" :value="item.id"/>
                </el-select>
                <el-select v-model="temp.end_city" placeholder="请选择市">
                  <el-option v-for="item in statusOptions2"
                             :key="item.id" :label="item.area_name" :value="item.id"/>
                </el-select>
              </div>
            </el-form-item>
          </el-col>
          <el-col class="column-col" :lg="8" :md="12" :sm="12"></el-col>
        </el-row>

        <el-row>
          <el-col class="column-col" :lg="8" :md="12" :sm="12">
            <el-form-item label="同行价" prop="peer_price">
              <el-input v-model.number="temp.peer_price"/>
            </el-form-item>
          </el-col>
          <el-col class="column-col" :lg="8" :md="12" :sm="12">
            <el-form-item label="汽贸价" prop="clients_price">
              <el-input v-model.number="temp.clients_price"/>
            </el-form-item>
          </el-col>
          <el-col class="column-col" :lg="8" :md="12" :sm="12">
            <el-form-item label="网络价" prop="network_price">
              <el-input v-model.number="temp.network_price"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :lg="24" :md="24" :sm="24">
          <el-form-item label="备注">
            <el-input v-model="temp.remarks" :autosize="{ minRows: 2, maxRows: 4}" type="textarea"
                      placeholder="请填写备注"/>
          </el-form-item>
        </el-row>
        <el-form-item class="dialog-footer">
          <el-button type="primary" @click="addContractor('dataForm')">
            {{pageType === 0?'创建':'编辑'}}
          </el-button>
          <el-button @click="goToBack">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { searchType } from '../../../../api/baseApi'
import { addTransportPrice, updateTransportPrice } from '../../../../api/contractorManage/transportPrice'

let defParams = {
  company: '',
  start_province: '',
  start_city: '',
  end_province: '',
  end_city: '',
  clients_price: null,//
  peer_price: '',// 同行价
  network_price: '',
  quotation_user: '',
  mobile: '',
  remarks:''
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
      if (value && value.key || value && value.id || value && value.value) {
        callback()
      } else {
        return callback(new Error('请选系统匹配的选项'))
      }
    }
    // 验证(值是id)
    let checkDownId = (rule, value, callback) => {
      if (value || value === 0) {
        callback()
      } else {
        return callback(new Error('请选系统匹配的选项'))
      }
    }
    // 模糊查询验证
    let checkDownMisIn = (rule, value, callback) => {
      let companyName = this.companyName
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
      statusOptions1: [],
      statusOptions2: [],
      temp: defParams,
      contractorType,
      companyOption: mockData,
      companyName: null,
      rules: {
        company: [
          { required: true, validator: checkDownMisIn, trigger: ['blur', 'select', 'change'] }
        ],
        start_city: [
          { required: true, message: '请选择城市', trigger: 'change' }
        ],
        end_city: [
          { required: true, message: '请选择城市', trigger: 'change' }
        ],
        quotation_user: [
          { required: true, message: '请填写报价人', trigger: 'blur' },
          { min: 2, max: 6, message: '长度在 2 到 6个字符', trigger: 'blur' }
        ],
        clients_price: [
          { required: true, message: '报价不能为空' },
          { type: 'number', message: '报价必须为数字值' }
        ],
        peer_price: [
          { required: true, message: '报价不能为空' },
          { type: 'number', message: '报价必须为数字值' }
        ],
        network_price: [
          { required: true, message: '报价不能为空' },
          { type: 'number', message: '报价必须为数字值' }
        ],
        mobile: [{ required: true, validator: checkPhone, trigger: 'blur' }]
      }
    }
  },
  props: {},
  computed: {},
  watch: {},
  created() {
    this.getAreaData()
  },
  async mounted() {
    let id = this.$route.query.id
    console.log(this.$route.query,'this.$route.query')
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
      let createFilter = (query) => {
        return (item) => {
          return (item.value.toLowerCase().indexOf(query.toLowerCase()) === 0)
        }
      }
      if (queryString) {
        searchType({ type: 'trans_company', query: queryString }).then((res) => {
          if (res.code === 200) {
            let option = this.companyOption = res.data
            if (option.length >= 1) {
              option.forEach((item) => {item.value = item.company})
              let results = option.filter(createFilter(queryString))
              cb(results)
            } else {
              cb(option)
            }
          }
        })
        return
      }
      cb(this.companyOption)
    },
    // 选公司
    handleSelectCompany(item) {
      console.log(item, 'item')
      this.temp.company = item.value
      this.companyName = item.value
    },
    getAreaData() {
      searchType({ type: 'area' }).then((res) => {
        if (res.code === 200) {
          this.statusOptions = res.data
        }
      })
    },
    getStartProvince(val) {
      this.statusOptions1 = []
      this.temp.start_city = null
      searchType({ type: 'area', pid: val }).then((res) => {
        if (res.code === 200) {
          this.statusOptions1 = res.data
        }
      })
    },
    getEndProvince(val) {
      this.statusOptions2 = []
      this.temp.end_city = null
      console.log(val)
      searchType({ type: 'area', pid: val }).then((res) => {
        if (res.code === 200) {
          this.statusOptions2 = res.data
        }
      })
    },
    goToBack(){
      this.$router.go(-1)
    },
    //添加或者编辑
    addContractor(formName) {
      console.log('params参数', this.temp)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.pageType === 1) {
            updateTransportPrice(this.temp).then((res) => {
              if (res.code == 200) {
                this.$message({
                  type: 'success',
                  message: '修改成功'
                })
                this.$router.go(-1)
              }
            })
          }
          if (this.pageType === 0) {
            addTransportPrice(this.temp).then((res) => {
              if (res.code == 200) {
                this.$message({
                  type: 'success',
                  message: '添加成功'
                })
                this.$router.go(-1)
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
