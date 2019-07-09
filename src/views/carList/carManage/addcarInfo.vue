<template>
  <div>
    <div class="page-title">车辆管理</div>
    <div>
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="130px"
               style="padding: 30px 40px 20px 0">
        <el-col>
          <div class="column-name">订单信息</div>
          <el-row>
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
              <el-form-item label="绑定司机" prop="driver_name">
                <el-autocomplete
                  style="width: 100%"
                  class="inline-input"
                  v-model="temp.driver_name"
                  :fetch-suggestions="querySearch"
                  placeholder="请输入内容"
                  @select="handleSelect"
                ></el-autocomplete>
              </el-form-item>
            </el-col>
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
              <el-form-item label="司机电话名" prop="mobile">
                <el-input v-model="temp.mobile"/>
              </el-form-item>
            </el-col>
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
              <el-form-item label="车牌号" prop="license_plate_number">
                <el-input v-model="temp.license_plate_number"/>
              </el-form-item>
            </el-col>
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
              <el-form-item label="ETC号" prop="etc_num">
                <el-input v-model="temp.etc_num"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
              <el-form-item label="车架号" prop="car_top_vin">
                <el-input v-model="temp.car_top_vin"/>
              </el-form-item>
            </el-col>
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
              <el-form-item label="发动机号" prop="engine_no">
                <el-input v-model="temp.engine_no"/>
              </el-form-item>
            </el-col>
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
              <el-form-item label="行驶证年检日期" prop="headstock_annual_date">
                <el-date-picker v-model="temp.headstock_annual_date" style="width: 100%"
                                type="date" placeholder="选择行驶证年检日期"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
              <el-form-item label="运营证年检日期" prop="headstock_operation_certificate_date">
                <el-date-picker v-model="temp.headstock_operation_certificate_date" type="date"
                                style="width: 100%" placeholder="选择日期">

                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
              <el-form-item label="保险类型" prop="headstock_insurance_type_one">
                <el-select v-model="temp.headstock_insurance_type_one"
                           class="filter-item"
                           style="width: 100%"
                           placeholder="请选择类型">
                  <el-option v-for="item in typeList"
                             :key="item.key"
                             :label="item.name"
                             :value="item.key"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
              <el-form-item label="保险公司" prop="car_top_insurance_company">
                <el-input v-model="temp.car_top_insurance_company"/>
              </el-form-item>
            </el-col>
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
              <el-form-item label="单号" prop="headstock_odd_numbers_one">
                <el-input v-model="temp.headstock_odd_numbers_one"/>
              </el-form-item>
            </el-col>
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
              <el-form-item label="投保确认码" prop="headstock_insurance_confirmation_code_one">
                <el-input v-model="temp.headstock_insurance_confirmation_code_one"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
              <el-form-item label="保险单号" prop="headstock_policy_number_one">
                <el-input v-model="temp.headstock_policy_number_one"/>
              </el-form-item>
            </el-col>
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
              <el-form-item label="保险到期" prop="headstock_insurance_end_date_one">
                <div class="flex">
                  <el-date-picker v-model="temp.headstock_insurance_end_date_one" style="width: 100%"
                                  type="date" placeholder="选择日期">
                  </el-date-picker>
                </div>
              </el-form-item>
            </el-col>
            <el-col class="column-col" :lg="6" :md="12" :sm="12"></el-col>
            <el-col class="column-col" :lg="6" :md="12" :sm="12"></el-col>
          </el-row>
          <el-row>
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
              <el-form-item label="保险类型" prop="headstock_insurance_type_two">
                <el-select v-model="temp.headstock_insurance_type_two"
                           class="filter-item"
                           style="width: 100%"
                           placeholder="请选择类型">
                  <el-option v-for="item in typeList"
                             :key="item.key"
                             :label="item.name"
                             :value="item.key"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
              <el-form-item label="保险公司" prop="headstock_insurance_company_two">
                <el-input v-model="temp.headstock_insurance_company_two"/>
              </el-form-item>
            </el-col>
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
              <el-form-item label="单号" prop="headstock_odd_numbers_two">
                <el-input v-model="temp.headstock_odd_numbers_two"/>
              </el-form-item>
            </el-col>
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
              <el-form-item label="投保确认码" prop="headstock_insurance_confirmation_code_two">
                <el-input v-model="temp.headstock_insurance_confirmation_code_two"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
              <el-form-item label="保险单号" prop="headstock_policy_number_two">
                <el-input v-model="temp.headstock_policy_number_two"/>
              </el-form-item>
            </el-col>
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
              <el-form-item label="保险到期" prop="headstock_insurance_end_date_two">
                <el-date-picker v-model="temp.headstock_insurance_end_date_two" type="date" style="width: 100%"
                                placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col class="column-col" :lg="6" :md="12" :sm="12"></el-col>
            <el-col class="column-col" :lg="6" :md="12" :sm="12"></el-col>
          </el-row>
        </el-col>
        <el-col>
          <div class="column-name">车挂信息</div>
          <el-row>
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
              <el-form-item label="车挂号" prop="trailer">
                <el-input v-model="temp.trailer"/>
              </el-form-item>
            </el-col>
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
              <el-form-item label="车架号" prop="car_hanging_vin">
                <el-input v-model="temp.car_hanging_vin"/>
              </el-form-item>
            </el-col>
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
              <el-form-item label="总质量" prop="total_mass">
                <el-input v-model="temp.total_mass"/>
              </el-form-item>
            </el-col>
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
              <el-form-item label="车位数" prop="parking_spaces_num">
                <el-input v-model="temp.parking_spaces_num"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
              <el-form-item label="车辆出厂日期" prop="date_of_production">
                <el-date-picker v-model="temp.date_of_production" type="date" placeholder="选择日期" style="width: 100%">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
              <el-form-item label="行驶证年检日期" prop="car_hanging_annual_date" style="width: 100%">
                <el-date-picker v-model="temp.car_hanging_annual_date" type="date" placeholder="选择日期"
                                style="width: 100%">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
              <el-form-item label="运营证年检日期" prop="car_hanging_operation_certificate_date">
                <el-date-picker v-model="temp.car_hanging_operation_certificate_date" type="date" style="width: 100%"
                                placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
              <el-form-item label="驾驶证年检日期" prop="driving_permits_annual_inspection">
                <el-date-picker v-model="temp.driving_permits_annual_inspection" type="date" style="width: 100%"
                                placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
              <el-form-item label="货物险到日期" prop="cargo_insurence_end_date">
                <el-date-picker v-model="temp.cargo_insurence_end_date" type="date" placeholder="选择日期"
                                style="width: 100%">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
              <el-form-item label="资格证年检日期" prop="certification_card">
                <el-date-picker v-model="temp.certification_card" type="date" placeholder="选择日期" style="width: 100%">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
              <el-form-item label="保额" prop="coverage">
                <el-input v-model="temp.coverage"/>
              </el-form-item>
            </el-col>
            <el-col class="column-col" :lg="6" :md="12" :sm="12"></el-col>
          </el-row>
          <el-row>
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
              <el-form-item label="保险类型" prop="car_hanging_insurance_type">
                <el-select v-model="temp.car_hanging_insurance_type"
                           class="filter-item"
                           style="width: 100%"
                           placeholder="请选择类型">
                  <el-option v-for="item in typeList"
                             :key="item.key"
                             :label="item.name"
                             :value="item.key"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
              <el-form-item label="保险公司" prop="car_hanging_insurance_company">
                <el-input v-model="temp.car_hanging_insurance_company"/>
              </el-form-item>
            </el-col>
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
              <el-form-item label="单号" prop="car_hanging_odd_numbers">
                <el-input v-model="temp.car_hanging_odd_numbers"/>
              </el-form-item>
            </el-col>
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
              <el-form-item label="投保确认码" prop="car_hanging_insurance_confirmation_code">
                <el-input v-model="temp.car_hanging_insurance_confirmation_code"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
              <el-form-item label="保险单号" prop="car_hanging_policy_number">
                <el-input v-model="temp.car_hanging_policy_number"/>
              </el-form-item>
            </el-col>
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
              <el-form-item label="保险到期" prop="car_hanging_insurance_end_date">
                <el-date-picker v-model="temp.car_hanging_insurance_end_date" type="date" placeholder="选择日期"
                                style="width: 100%">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
            </el-col>
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
            </el-col>
          </el-row>
          <el-row class="" :lg="24" :md="24" :sm="24">
            <el-form-item label="备注" prop="remarks">
              <el-input v-model="temp.remarks" :autosize="{ minRows: 2, maxRows: 4}" type="textarea"
                        placeholder="请填写"/>
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
        </el-col>
      </el-form>
    </div>
  </div>
</template>
<script>
import { searchType } from '../../../api/baseApi'
import { checkName, addNewCar, editNewCar } from '../../../api/carList/carManage/carManage'

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
      console.log('value', value)
      if (value) {
        callback()
      } else {
        return callback(new Error('请选系统匹配的选项'))
      }
    }
    return {
      typeList:typeList,
      businessType: [],// 业务类型
      statusOptions: [],// 省项
      statusOptions2: [],//市项
      driverList: [],//区项
      temp: {
        driver_name: '',//司机名
        mobile: '',//手机号码
        license_plate_number: '', // 车头
        etc_num: '',
        car_top_vin: '',
        engine_no: '',
        headstock_annual_date: '',
        headstock_operation_certificate_date: '',
        headstock_insurance_type_one: '',
        car_top_insurance_company: '',
        headstock_odd_numbers_one: '',
        headstock_insurance_confirmation_code_one: '',
        headstock_policy_number_one: '',
        headstock_insurance_end_date_one: '',
        headstock_insurance_type_two: '',
        headstock_insurance_company_two: '',
        headstock_odd_numbers_two: '',
        headstock_insurance_confirmation_code_two: '',
        headstock_policy_number_two: '',
        headstock_insurance_end_date_two: '',
        trailer: 0,
        car_hanging_vin: '',
        total_mass: '',
        parking_spaces_num: '',
        date_of_production: '',
        car_hanging_annual_date: '',
        car_hanging_operation_certificate_date: '',
        driving_permits_annual_inspection: '',
        cargo_insurence_end_date: '',
        certification_card: '',
        coverage: '',
        car_hanging_insurance_type: '',
        car_hanging_insurance_company: '',
        car_hanging_odd_numbers: '',
        car_hanging_insurance_confirmation_code: '',
        car_hanging_policy_number: '',
        car_hanging_insurance_end_date: '',
        remarks: ''
      },
      rules: {
        mobile: [{ required: true, validator: checkPhone, trigger: 'blur' }],
        driver_name: [
          { required: true,  validator: checkDown, trigger: 'blur' },
        ],
        license_plate_number: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        etc_num: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        car_top_vin: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        engine_no: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        headstock_annual_date: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        headstock_operation_certificate_date: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        headstock_insurance_type_one: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
        car_top_insurance_company: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        headstock_odd_numbers_one: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        headstock_insurance_confirmation_code_one: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        headstock_policy_number_one: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        headstock_insurance_type_two: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
        headstock_insurance_company_two: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
        headstock_odd_numbers_two: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        headstock_insurance_confirmation_code_two: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        headstock_policy_number_two: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        trailer: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        car_hanging_vin: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        total_mass: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        parking_spaces_num: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        date_of_production: [
          { required: true, message: '请选择日期', trigger: 'blur' }
        ],
        car_hanging_annual_date: [
          { required: true, message: '请选择日期', trigger: 'blur' }
        ],
        car_hanging_operation_certificate_date: [
          { required: true, message: '请选择日期', trigger: 'blur' }
        ],
        driving_permits_annual_inspection: [
          { required: true, message: '请选择日期', trigger: 'blur' }
        ],
        cargo_insurence_end_date: [
          { required: true, message: '请选择日期', trigger: 'blur' }
        ],
        certification_card: [
          { required: true, message: '请选择日期', trigger: 'blur' }
        ],
        coverage: [
          { required: true, message: '请选择保额', trigger: 'blur' }
        ],
        car_hanging_insurance_type: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
        car_hanging_insurance_company: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        car_hanging_odd_numbers: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        car_hanging_insurance_confirmation_code: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        car_hanging_policy_number: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        car_hanging_insurance_end_date: [
          { required: true, message: '请选择日期', trigger: 'blur' }
        ],
        remarks: [
          { required: true, message: '请选择日期', trigger: 'blur' }
        ]
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
  created() {},
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      // searchType({ type: 'customer_business' }).then((res) => {
      //   if (res.code == 200) {
      //     Object.keys(res.data).forEach((item) => {
      //       this.businessType.push({
      //         key: item,
      //         name: res.data[item]
      //       })
      //     })
      //   }
      // })
      // searchType({ type: 'area' }).then((res) => {
      //   if (res.code === 200) {
      //     this.statusOptions = res.data
      //   }
      // })
      checkName().then((res) => {
        console.log('res', res)
        if (res.code == 200) {
          this.driverList = res.data
          this.driverList.map((item)=>{
            item.value = item.driver_name
          })
        }
      })
    },
    handleSelect(item) {
      this.temp.driver_name = item.value
    },
    querySearch(queryString, cb) {
      var restaurants = this.driverList
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      cb(results)
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
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
    createData(formName) {
      console.log('params', this.temp)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          addNewCar(this.temp).then((res) => {
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
var typeList = [
  {
    key: 1,
    name: '商业险'
  },
  {
    key: 2,
    name: '交强险'
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

  .column-name {
    font-size: j(18);
    padding: j(10) j(20);
    background: #48c6d3;
  }

  .el-row {
    margin: j(20) 0;
  }

  .dialog-footer {
    text-align: center;
    height: j(100);
  }

</style>
