<template>
  <div class="create-order-page">
    <div class="flex-between page-title">
      <div class="">创建订单</div>
      <el-button ype="primary" @click="">返回</el-button>
    </div>

    <div class="page-content">
      <el-form ref="form" :model="ruleForm" label-width="100px" :label-position="left">
        <el-row class="column">
          <div class="column-name">订单信息</div>
          <el-col class="column-col" :lg="6" :md="12" :sm="12">
            <el-form-item label="订单号" prop="name">
              <el-input v-model="ruleForm.name"/>
            </el-form-item>
          </el-col>
          <el-col class="column-col" :lg="6" :md="12" :sm="12">
            <el-form-item label="开单日期" prop="name">
              <el-input v-model="ruleForm.name"/>
            </el-form-item>
          </el-col>
          <el-col class="column-col" :lg="6" :md="12" :sm="12">
            <el-form-item label="业务类型" prop="name">
              <el-input v-model="ruleForm.name"/>
            </el-form-item>
          </el-col>
          <el-col class="column-col" :lg="6" :md="12" :sm="12">
            <el-form-item label="经办人" prop="name">
              <el-input v-model="ruleForm.name"/>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="column">
          <el-row>
            <el-col :lg="12" :md="12" :sm="24">
              <div class="column-name">发货方信息</div>
              <el-row>
                <el-col class="column-col" :lg="12" :md="12" :sm="12">
                  <el-form-item label="托运人" prop="name">
                    <el-input v-model="ruleForm.name"/>
                  </el-form-item>
                </el-col>
                <el-col class="column-col" :lg="12" :md="12" :sm="12">
                  <el-form-item label="托运人电话" prop="name">
                    <el-input v-model="ruleForm.name"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col class="column-col" :lg="12" :md="12" :sm="12">
                  <el-form-item label="发站归属地" prop="name">
                    <div style="width: 100%;display: flex">
                      <el-select v-model="value" placeholder="请选择发站归属地" style="width: 100%">
                        <el-option
                          v-for="item in options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </div>
                  </el-form-item>
                </el-col>
                <el-col class="column-col" :lg="12" :md="12" :sm="12">
                  <el-form-item label="发站省/市" prop="name">
                    <div style="width: 100%;display: flex">
                      <el-select v-model="value" placeholder="请选择" style="width:50%">
                        <el-option
                          v-for="item in options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                      <el-select v-model="value" placeholder="请选择" style="width: 50%">
                        <el-option
                          v-for="item in options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>

                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col class="column-col" :lg="12" :md="12" :sm="12">
                  <el-form-item label="提车费" prop="name">
                    <el-input v-model="ruleForm.name"/>
                  </el-form-item>
                </el-col>
                <el-col class="column-col" :lg="12" :md="12" :sm="12">
                  <el-form-item label="提车司机" prop="name">
                    <div style="width: 100%;display: flex">
                      <el-select v-model="value" placeholder="请选择" style="width:50%">
                        <el-option
                          v-for="item in options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                      <el-select v-model="value" placeholder="请选择" style="width: 50%">
                        <el-option
                          v-for="item in options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col class="column-col" :lg="24" :md="24">
                  <el-form-item label="详细地址" prop="name">
                    <el-input v-model="ruleForm.name" type="textarea"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col class="column-col" :lg="24" :md="24">
                  <el-form-item label="提车备注" prop="name">
                    <el-input v-model="ruleForm.name" type="textarea"/>
                  </el-form-item>
                </el-col>
              </el-row>

            </el-col>
            <el-col :lg="12" :md="12" :sm="24">
              <div class="column-name">收货方信息</div>
              <el-row>
                <el-col class="column-col" :lg="12" :md="12" :sm="12">
                  <el-form-item label="收货人" prop="name">
                    <el-input v-model="ruleForm.name"/>
                  </el-form-item>
                </el-col>
                <el-col class="column-col" :lg="12" :md="12" :sm="12">
                  <el-form-item label="收货人电话" prop="name">
                    <el-input v-model="ruleForm.name"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col class="column-col" :lg="12" :md="12" :sm="12">
                  <el-form-item label="到站归属地" prop="name">
                    <div style="width: 100%;display: flex">
                      <el-select v-model="value" placeholder="请选择到站归属地" style="width: 100%">
                        <el-option
                          v-for="item in options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </div>
                  </el-form-item>
                </el-col>
                <el-col class="column-col" :lg="12" :md="12" :sm="12">
                  <el-form-item label="到站省/市" prop="name">
                    <div style="width: 100%;display: flex">
                      <el-select v-model="value" placeholder="请选择" style="width:50%">
                        <el-option
                          v-for="item in options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                      <el-select v-model="value" placeholder="请选择" style="width: 50%">
                        <el-option
                          v-for="item in options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>

                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col class="column-col" :lg="12" :md="12" :sm="12">
                  <el-form-item label="送车费" prop="name">
                    <el-input v-model="ruleForm.name"/>
                  </el-form-item>
                </el-col>
                <el-col class="column-col" :lg="12" :md="12" :sm="12">
                  <el-form-item label="送车司机" prop="name">
                    <div style="width: 100%;display: flex">
                      <el-select v-model="value" placeholder="请选择" style="width:50%">
                        <el-option
                          v-for="item in options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                      <el-select v-model="value" placeholder="请选择" style="width: 50%">
                        <el-option
                          v-for="item in options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </div>
                  </el-form-item>

                </el-col>
              </el-row>
              <el-row>
                <el-col class="column-col" :lg="24" :md="24">
                  <el-form-item label="详细地址" prop="name">
                    <el-input v-model="ruleForm.name" type="textarea"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col class="column-col" :lg="24" :md="24">
                  <el-form-item label="送车备注" prop="name">
                    <el-input v-model="ruleForm.name" type="textarea"/>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
        <div class="column">
          <div class="column-name">
            <div class="flex-between">
              <div>货物信息</div>
              <div class="add-Btn" @click="addDomain">添加发货信息</div>
            </div>
          </div>
          <el-row class="">
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
              <el-form-item label="车辆名称" prop="name">
                <el-select v-model="ruleForm.region" placeholder="活动区域">
                  <el-option label="区域一" value="首钢"/>
                  <el-option label="区域二" value="北京"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
              <el-form-item label="识别码" prop="name">
                <el-input v-model="ruleForm.name"/>
              </el-form-item>
            </el-col>
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
              <el-form-item label="接车单价" prop="name">
                <el-input v-model="ruleForm.name"/>
              </el-form-item>
            </el-col>
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
              <el-form-item label="发货方回扣" prop="name">
                <el-input v-model="ruleForm.name"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="">
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
              <el-form-item label="保险费" prop="name">
                <el-input v-model="ruleForm.name"/>
              </el-form-item>
            </el-col>
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
              <el-form-item label="发票费" prop="name">
                <el-input v-model="ruleForm.name"/>
              </el-form-item>
            </el-col>
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
              <el-form-item label="垫款" prop="name">
                <el-input v-model="ruleForm.name"/>
              </el-form-item>
            </el-col>
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
              <el-form-item label="合计" prop="name">
                <el-input v-model="ruleForm.name"/>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="column">
          <div class="column-name">支付方式</div>
          <el-row>
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
              <el-form-item label="付款方式" prop="name">
                <el-input v-model="ruleForm.name"/>
              </el-form-item>
            </el-col>
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
              <el-form-item label="现付" prop="name">
                <el-input v-model="ruleForm.name"/>
              </el-form-item>
            </el-col>
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
              <el-form-item label="到付" prop="name">
                <el-input v-model="ruleForm.name"/>
              </el-form-item>
            </el-col>
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
              <el-form-item label="月结" prop="name">
                <el-input v-model="ruleForm.name"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
              <el-form-item label="合计费用" prop="name">
                <el-input v-model="ruleForm.name"/>
              </el-form-item>
            </el-col>
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
              <el-form-item label="业务提成" prop="name">
                <el-input v-model="ruleForm.name"/>
              </el-form-item>
            </el-col>
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
              <el-form-item label="回单" prop="delivery">
                <el-switch v-model="ruleForm.name"/>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div style="width: 100%" class="btns-commit">
          <el-row>
            <el-col class="flex-around" :md="8" :xs="8" :sm="8">
              <el-button type="primary" @click="submitForm('ruleForm')">临时订单</el-button>
            </el-col>
            <el-col :md="8" :xs="8" :sm="8" class="flex-around">
              <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
            </el-col>
            <el-col :md="8" :xs="8" :sm="8" class="flex-around">
              <el-button @click="resetForm('ruleForm')">重置订单</el-button>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
// import ChildComponents from './ChildComponents.vue'
import { OrderMsg, order,orderIndex,getOrderInfo} from '../../../../api/businessOrder/order'

export default {
  components: {},
  props: {},
  data() {
    return {
      labelPosition: 'left',
      title: '组件标题',
      firstName: '',
      lastName: '',
      ruleForm: {
        name: '隔壁老王'
      },
      dynamicValidateForm: {
        domains: []
      },
      options: [{
        value: 'zhinan',
        label: '指南',
        children: [{
          value: 'shejiyuanze',
          label: '设计原则',
          children: [{
            value: 'yizhi',
            label: '一致'
          }, {
            value: 'fankui',
            label: '反馈'
          }, {
            value: 'kekong',
            label: '可控'
          }]
        }, {
          value: 'daohang',
          label: '导航'
        }]
      }, {
        value: 'zujian',
        label: '组件',
        children: [{
          value: 'basic',
          label: 'Basic',
          children: [{
            value: 'icon',
            label: 'Icon 图标'
          }, {
            value: 'button',
            label: 'Button 按钮'
          }]
        }, {
          value: 'form',
          label: 'Form',
          children: [{
            value: 'radio',
            label: 'Radio 单选框'
          }, {
            value: 'inputSelect.vue',
            label: 'Select 选择器'
          }, {
            value: 'upload',
            label: 'Upload 上传'
          }]
        }, {
          value: 'data',
          label: 'Data',
          children: [{
            value: 'table',
            label: 'Table 表格'
          }, {
            value: 'pagination',
            label: 'Pagination 分页'
          }, {
            value: 'badge',
            label: 'Badge 标记'
          }]
        }, {
          value: 'notice',
          label: 'Notice',
          children: [{
            value: 'message-box',
            label: 'MessageBox 弹框'
          }, {
            value: 'notification',
            label: 'Notification 通知'
          }]
        }, {
          value: 'others',
          label: 'Others',
          children: [{
            value: 'dialog',
            label: 'Dialog 对话框'
          }, {
            value: 'carousel',
            label: 'Carousel 走马灯'
          }]
        }]
      }, {
        value: 'ziyuan',
        label: '资源',
        children: [{
          value: 'axure',
          label: 'Axure Components'
        }, {
          value: 'jiaohu',
          label: '组件交互文档'
        }]
      }
      ]
    }
  },
  computed: {
    fullName() {
      return this.firstName + this.lastName
    }
  },
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {
    getFormMsg(){
      OrderMsg().then(()=>{})
    },
    submitForm() {
    },
    addDomain() {
      this.dynamicValidateForm.domains.push({
        value: '',
        key: Date.now()
      })
    },
    handleChange() {
      return new Date().toLocaleDateString()
    }
  }
}
</script>
<style scoped lang="scss">
  @import "src/styles/mixin.scss";

  .page-title {
    font-size: j(30);
    padding:j(10) j(20);
    margin: j(5) 0;
    /*border: 1px solid #f2f2f2;*/
    box-shadow: 0 2px 10px #f2f2f2;
  }
  .page-content {
    padding: 0 j(20);
    .column {
      .column-col {
        padding: 0 j(30) 0 0;
      }
    }
    .column-name {
      @extend %bgColor;
      width: 100%;
      color: #fff;
      font-size: j(15);
      height: j(35);
      margin-bottom: j(20);
      line-height: j(35);
      padding: 0 j(10);
      box-shadow: 0 2px 10px #f2f2f2;
    }
  }
  .btns-commit {
    padding: j(30) j(90);
    /*box-shadow: 2px 2px 10px #f2f2f2;*/
  }

</style>
