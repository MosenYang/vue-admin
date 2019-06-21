<template>
  <div>
    <div class="page-title">创建客户信息</div>
    <div>
      <el-form ref="dataForm"
               :rules="rules"
               :model="temp"
               label-position="right"
               label-width="100px"
               style="padding: 30px 40px 20px 0">
        <el-row>
          <el-col class="column-col" :lg="8" :md="12" :sm="12">
            <el-form-item label="类型" prop="business">
              <el-select v-model="temp.business"
                         class="filter-item"
                         style="width: 100%"
                         placeholder="请选择类型">
                <el-option v-for="item in businessType"
                           :key="item.key"
                           :label="item.name"
                           :value="item.key"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col class="column-col" :lg="8" :md="12" :sm="12">
            <el-form-item label="姓名" prop="username">
              <el-input v-model="temp.username"/>
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
            <el-form-item label="性别" prop="sex">
              <el-radio-group v-model="temp.sex">
                <el-radio label="男" value="1"></el-radio>
                <el-radio label="女" value="0"></el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col class="column-col" :lg="8" :md="12" :sm="12">
            <el-form-item label="身份证号">
              <el-input v-model="temp.id_card"/>
            </el-form-item>
          </el-col>
          <el-col class="column-col" :lg="8" :md="12" :sm="12">
            <el-form-item label="家庭住址" prop="home_address">
              <el-input v-model="temp.home_address"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="column-col" :lg="8" :md="12" :sm="12">
            <el-form-item label="职务">
              <el-input v-model="temp.position"/>
            </el-form-item>
          </el-col>
          <el-col class="column-col" :lg="8" :md="12" :sm="12">
            <el-form-item label="固定电话">
              <el-input v-model="temp.telphone"/>
            </el-form-item>
          </el-col>
          <el-col class="column-col" :lg="8" :md="12" :sm="12">
            <el-form-item label="传真">
              <el-input v-model="temp.fax_number"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="column-col" :lg="8" :md="12" :sm="12">
            <el-form-item label="公司名称">
              <el-input v-model="temp.company"/>
            </el-form-item>
          </el-col>
          <el-col class="column-col" :lg="8" :md="12" :sm="12">
            <el-form-item label="公司地址">
              <div class="flex">
                <el-select v-model="province" value-key="id" @change="getProvince" placeholder="请选择省">
                  <el-option v-for="item in statusOptions"
                             :key="item.id" :label="item.area_name" :value="item"/>
                </el-select>
                <el-select v-model="city" value-key="id" @change="getCity" placeholder="请选择市">
                  <el-option v-for="item in statusOptions2"
                             :key="item.id" :label="item.area_name" :value="item"/>
                </el-select>
                <el-select v-model="county" value-key="id" @change="getArea" placeholder="请选择区">
                  <el-option v-for="item in statusOptions3"
                             :key="item.id" :label="item.area_name" :value="item"/>
                </el-select>
              </div>
            </el-form-item>
          </el-col>
          <el-col class="column-col" :lg="8" :md="12" :sm="12">
            <el-form-item label="经营范围">
              <el-input v-model="temp.business_scope"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="column-col" :lg="8" :md="12" :sm="12">
            <el-form-item label="微信号">
              <el-input v-model="temp.wechat"/>
            </el-form-item>
          </el-col>
          <el-col class="column-col" :lg="8" :md="12" :sm="12">
            <el-form-item label="QQ号">
              <el-input v-model="temp.qq"/>
            </el-form-item>
          </el-col>
          <el-col class="column-col" :lg="8" :md="12" :sm="12">
            <el-form-item label="客户类型" prop="type">
              <el-select v-model="temp.type"
                         class="filter-item"
                         style="width: 100%"
                         placeholder="请选择类型">
                <el-option v-for="item in clientType"
                           :key="item.key"
                           :label="item.name"
                           :value="item.key"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="" :lg="24" :md="24" :sm="24">
          <el-form-item label="备注">
            <el-input v-model="temp.remarks" :autosize="{ minRows: 2, maxRows: 4}" type="textarea"
                      placeholder="请填写"/>
          </el-form-item>
        </el-row>
        <el-row class="" :lg="24" :md="24" :sm="24">
          <el-form-item label="业务员信息">
            <el-radio-group v-model="temp.radio">
              <el-radio :label="item.id" v-for="(item,i) in mockPeople">{{item.name}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>
        <el-form-item class="dialog-footer">
          <el-button type="primary" @click="createData('dataForm')">
            保存
          </el-button>
          <el-button @click="dialogFormVisible = false">
            返回
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { searchType } from '../../../api/baseApi'
import { clientAdd } from '../../../api/clientManage/client'

export default {
  components: {},
  props: {},
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
      if (value && value.id || value && value.value) {
        callback()
      } else {
        return callback(new Error('请选系统匹配的选项'))
      }
    }
    return {
      clientType: clientType,
      businessType: [],// 业务类型
      statusOptions: [],// 省项
      statusOptions2: [],//市项
      statusOptions3: [],//区项
      temp: {
        business: '',
        username: '',
        mobile: '',
        province: '',// 省份id
        province_name: '',
        city: '',
        city_name: '',//
        county: '',
        county_name: '',
        sex: '',
        type: '',//客户类型
        id_card: '',//省份证号
        home_address: '',//家庭住址
        company: '',//公司名称
        business_scope: '',//
        position: '',//职务
        telphone: '',//电话
        fax_number: '',//传真
        wechat: '',//wx
        qq: '',//qq
        remarks: '',// 备注
        radio:0,
      },
      rules: {
        sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
        mobile: [{ required: true, validator: checkPhone, trigger: 'blur' }],
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        business: [{ required: true, message: '商业类型', trigger: 'change' }],
        type: [{ required: true, message: '客户类型', trigger: 'change' }]
      },
      mockPeople: mockPeople
    }

  },
  computed: {
    province: {
      get() {
        if (this.temp.province_name) {
          return this.temp.province_name
        }
      },
      set(val) {
        this.temp.province = val.id
        this.temp.province_name = val.area_name
      }
    },
    city: {
      get() {
        if (this.temp.city_name) {
          return this.temp.city_name
        }
      },
      set(val) {
        this.temp.city = val.id
        this.temp.city_name = val.area_name
      }
    },
    county: {
      get() {
        if (this.temp.county_name) {
          return this.temp.county_name
        }
      },
      set(val) {
        this.temp.county = val.id
        this.temp.county_name = val.area_name
      }
    }
  },
  watch: {},
  created() {
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      searchType({ type: 'customer_business' }).then((res) => {
        if (res.code == 200) {
          Object.keys(res.data).forEach((item) => {
            this.businessType.push({
              key: item,
              name: res.data[item]
            })
          })
        }
      })
      searchType({ type: 'area' }).then((res) => {
        if (res.code === 200) {
          this.statusOptions = res.data
        }
      })
    },
    getProvince(val) {
      this.statusOptions2 = []
      let id = this.temp.province
      searchType({ type: 'area', pid: id }).then((res) => {
        if (res.code === 200) {
          this.statusOptions2 = res.data
        }
      })
    },
    getCity() {
      let id = this.temp.city
      this.statusOptions3 = []
      searchType({ type: 'area', pid: id }).then((res) => {
        if (res.code === 200) {
          this.statusOptions3 = res.data
        }
      })
    },
    getArea(val) {},
    createData(formName) {
      console.log('params', this.temp)
      this.temp.business = Number(this.temp.business)
      this.temp.sex = this.temp.sex == '男' ? 1 : 0
      this.$refs[formName].validate((valid) => {
        if (valid) {
          clientAdd(this.temp).then((res) => {
            if (res.code === 200) {
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
    }
  }
}
var clientType = [
  {
    key: 1,
    name: '潜在用户'
  },
  {
    key: 2,
    name: '正常用户'
  }
]
var mockPeople = [
  {
    'id': 1,  //业务员id
    'name': '李磊'  //业务员姓名
  },
  {
    'id': 2,  //业务员id
    'name': '韩梅梅'  //业务员姓名
  },
  {
    'id': 3,  //业务员id
    'name': '韩梅'  //业务员姓名
  }
]
</script>
<style lang="scss" scoped>
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
