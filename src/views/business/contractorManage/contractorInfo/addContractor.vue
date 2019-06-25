<template>
  <div>
    <div class="page-title">{{pageType === 0?'新增':'编辑'}}承运商</div>
    <div>
      <el-form ref="dataForm"
               :rules="rules"
               :model="temp"
               label-position="right"
               label-width="100px"
               style="padding: 30px 40px 20px 0">
        <el-row>
          <el-col class="column-col" :lg="6" :md="12" :sm="12">
            <el-form-item label="公司名称" prop="company">
              <el-input v-model="temp.company"/>
            </el-form-item>
          </el-col>
          <el-col class="column-col" :lg="6" :md="12" :sm="12">
            <el-form-item label="承运商类型" prop="type">
              <el-select v-model="temp.type" class="filter-item"
                         style="width: 100%"
                         placeholder="请选择类型">
                <el-option v-for="item in contractorType"
                           :key="item.key"
                           :label="item.name"
                           :value="item.key"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col class="column-col" :lg="6" :md="12" :sm="12">
            <el-form-item label="职务">
              <el-input v-model="temp.position"/>
            </el-form-item>
          </el-col>
          <el-col class="column-col" :lg="6" :md="12" :sm="12">
            <el-form-item label="固定电话">
              <el-input v-model="temp.telephone"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="column-col" :lg="6" :md="12" :sm="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="temp.name"/>
            </el-form-item>
          </el-col>
          <el-col class="column-col" :lg="6" :md="12" :sm="12">
            <el-form-item label="性别" prop="sex">
              <el-radio-group v-model="temp.sex">
                <el-radio label="1">男</el-radio>
                <el-radio label="2">女</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col class="column-col" :lg="6" :md="12" :sm="12">
            <el-form-item label="手机号" prop="mobile">
              <el-input v-model="temp.mobile"/>
            </el-form-item>
          </el-col>
          <el-col class="column-col" :lg="6" :md="12" :sm="12">
            <el-form-item label="QQ号">
              <el-input v-model="temp.qq"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col class="column-col" :lg="6" :md="12" :sm="12">
            <el-form-item label="运营发站地">
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
          <el-col class="column-col" :lg="6" :md="12" :sm="12">
            <el-form-item label="运营到站地">
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
          <el-col class="column-col" :lg="12" :md="12" :sm="12">
            <el-form-item label="公司地址">
              <el-input v-model="temp.company_address"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="" :lg="24" :md="24" :sm="24">
          <el-form-item label="备注">
            <el-input v-model="temp.remarks"
                      :autosize="{ minRows: 2, maxRows: 4}" type="textarea"
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
      if (value && value.id || value && value.value) {
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
      rules: {
        company: [
          { required: true, message: '公司名不能为空', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
        mobile: [{ required: true, validator: checkPhone, trigger: 'blur' }],
        name: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        type: [{ required: true, message: '请选择商业类型', trigger: 'change' }]
      },
      temp: {
        company: '',
        type: '',
        mobile: '',
        position: '',
        telephone: '',
        sex: null,//
        company_address: '',
        remarks: '',
        start_province: '',
        start_city: '',
        end_province: '',
        end_city: '',
        qq: ''
      },
      contractorType
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
    getAreaData() {
      searchType({ type: 'area' }).then((res) => {
        if (res.code === 200) {
          this.statusOptions = res.data
        }
      })
    },
    getStartProvince(val) {
      this.statusOptions1 = []
      searchType({ type: 'area', pid: val }).then((res) => {
        if (res.code === 200) {
          this.statusOptions1 = res.data
        }
      })
    },
    getEndProvince(val) {
      this.statusOptions2 = []
      console.log(val)
      searchType({ type: 'area', pid: val }).then((res) => {
        if (res.code === 200) {
          this.statusOptions2 = res.data
        }
      })
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
