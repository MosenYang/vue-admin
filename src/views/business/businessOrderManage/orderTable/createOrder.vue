<template>
  <div class="create-order-page">
    <div class="flex-between page-title">
      <div class="">创建订单</div>
      <el-button ype="primary" @click="">返回</el-button>
    </div>
    <div class="page-content">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" label-position="right">
        <el-row class="column">
          <div class="column-name">订单信息</div>
          <el-col class="column-col" :lg="6" :md="12" :sm="12">
            <el-form-item label="订单号">
              <el-input v-model="ruleForm.order_num" disabled/>
            </el-form-item>
          </el-col>
          <el-col class="column-col" :lg="6" :md="12" :sm="12">
            <el-form-item label="开单日期">
              <el-input v-model="ruleForm.create_time" disabled/>
            </el-form-item>
          </el-col>
          <el-col class="column-col" :lg="6" :md="12" :sm="12">
            <el-form-item label="业务类型">
              <el-input v-model="t_business" disabled/>
            </el-form-item>
          </el-col>
          <el-col class="column-col" :lg="6" :md="12" :sm="12">
            <el-form-item label="经办人">
              <el-input v-model="ruleForm.operator" disabled/>
            </el-form-item>
          </el-col>
        </el-row>
        <!--        货人-->
        <div class="column">
          <el-row>
            <!-- 发货人-->
            <el-col :lg="12" :md="12" :sm="24">
              <div class="column-name">发货方信息</div>
              <el-row>
                <el-col class="column-col" :lg="12" :md="12" :sm="12">
                  <el-form-item label="托运人" prop="consignor_info">
                    <el-select v-model="ruleForm.consignor_info" filterable
                               :filter-method="filterMethod"
                               @change="changeConsignor"
                               value-key="id"
                               placeholder="请选择" style="width: 100%">
                      <el-option
                        v-for="item in consignerOption"
                        :key="item.id"
                        :label="item.username"
                        :value="item">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col class="column-col" :lg="12" :md="12" :sm="12">
                  <el-form-item label="托运人电话" prop="consignor_mobile">
                    <el-input v-model.number="ruleForm.consignor_mobile"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col class="column-col" :lg="12" :md="12" :sm="12">
                  <el-form-item label="发站归属地" prop="start_attribution">
                    <div style="width: 100%;display: flex">
                      <el-select v-model="ruleForm.start_attribution" value-key="id"
                                 placeholder="发站归属地"
                                 style="width: 100%">
                        <el-option
                          v-for="item in dataOption.place"
                          :key="item.id"
                          :label="item.name"
                          :value="item"
                        />
                      </el-select>
                    </div>
                  </el-form-item>
                </el-col>
                <el-col class="column-col" :lg="12" :md="12" :sm="12">
                  <el-form-item label="发站省/市" prop="start_cid_info">
                    <div style="width: 100%;display: flex">
                      <el-select v-model="ruleForm.start_pid_info"
                                 value-key="id"
                                 @change='changeProvince'
                                 placeholder="请选择" style="width:50%">
                        <el-option
                          v-for="(item) in dataOption.province"
                          :key="item.id"
                          :label="item.name"
                          :value="item"
                        />
                      </el-select>
                      <el-select v-model="ruleForm.start_cid_info" value-key="id" placeholder="请选择" style="width: 50%">
                        <el-option
                          v-for="item in cityOption"
                          :key="item.id"
                          :label="item.area_name"
                          :value="item"
                        />
                      </el-select>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col class="column-col" :lg="12" :md="12" :sm="12">
                  <el-form-item label="提车费">
                    <el-input v-model="ruleForm.delivery_money"/>
                  </el-form-item>
                </el-col>
                <el-col class="column-col" :lg="12" :md="12" :sm="12">
                  <el-form-item label="提车司机">
                    <div style="width: 100%;display: flex">
                      <el-select v-model="ruleForm.carry_car_info"
                                 @change="changeCarTeam"
                                 placeholder="请选择"
                                 value-key="value"
                                 style="width:50%">
                        <el-option
                          v-for="item in dataOption.acceptCarTeam"
                          :key="item.value"
                          :label="item.name"
                          :value="item"/>
                      </el-select>
                      <el-select v-model="ruleForm.carry_car_info" value-key="id" placeholder="请选择" style="width: 50%">
                        <el-option
                          v-for="item in driverOption"
                          :key="item.id"
                          :label="item.name"
                          :value="item"
                        />
                      </el-select>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col class="column-col" :lg="24" :md="24">
                  <el-form-item label="详细地址" prop="carry_car_detail_address">
                    <el-input v-model="ruleForm.carry_car_detail_address" type="textarea"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col class="column-col" :lg="24" :md="24">
                  <el-form-item label="提车备注">
                    <el-input v-model="ruleForm.carry_car_remark" type="textarea"/>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
            <!--            收货人-->
            <el-col :lg="12" :md="12" :sm="24">
              <div class="column-name">收货方信息</div>
              <el-row>
                <el-col class="column-col" :lg="12" :md="12" :sm="12">
                  <el-form-item label="收货人" prop="consignee">
                    <el-input v-model="ruleForm.consignee"/>
                  </el-form-item>
                </el-col>
                <el-col class="column-col" :lg="12" :md="12" :sm="12">
                  <el-form-item label="收货人电话" prop="consignee_mobile">
                    <el-input v-model.number="ruleForm.consignee_mobile"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col class="column-col" :lg="12" :md="12" :sm="12">
                  <el-form-item label="到站归属地" prop="end_attribution">
                    <div style="width: 100%;display: flex">
                      <el-select v-model="ruleForm.end_attribution" placeholder="到站归属地" style="width: 100%">
                        <el-option
                          v-for="item in dataOption.place"
                          :key="item.value"
                          :label="item.name"
                          :value="item.value"
                        />
                      </el-select>
                    </div>
                  </el-form-item>
                </el-col>
                <el-col class="column-col" :lg="12" :md="12" :sm="12">
                  <el-form-item label="到站省/市" prop="end_cid_info">
                    <div style="width: 100%;display: flex">
                      <el-select v-model="ruleForm.end_pid_info"
                                 value-key="id"
                                 @change="changeEndProvince" placeholder="请选择省" style="width:50%">
                        <el-option
                          v-for="item in dataOption.province"
                          :key="item.id"
                          :label="item.name"
                          :value="item"
                        />
                      </el-select>
                      <el-select v-model="ruleForm.end_cid_info"
                                 value-key="id"
                                 placeholder="请选择市"
                                 style="width: 50%">
                        <el-option
                          v-for="item in endCityOption"
                          :key="item.id"
                          :label="item.area_name"
                          :value="item"
                        />
                      </el-select>

                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col class="column-col" :lg="12" :md="12" :sm="12">
                  <el-form-item label="送车费">
                    <el-input v-model="ruleForm.send_money"/>
                  </el-form-item>
                </el-col>
                <el-col class="column-col" :lg="12" :md="12" :sm="12">
                  <el-form-item label="送车司机">
                    <div style="width: 100%;display: flex">
                      <el-select v-model="ruleForm.send_car_info" value-key="value" @change="changeSendCarTeam"
                                 placeholder="请选择"
                                 style="width:50%">
                        <el-option
                          v-for="item in dataOption.sendCarTeam"
                          :key="item.value"
                          :label="item.name"
                          :value="item"
                        />
                      </el-select>
                      <el-select v-model="ruleForm.send_car_info" placeholder="请选择" value-key="value"
                                 style="width: 50%">
                        <el-option
                          v-for="item in sendDriverOption"
                          :key="item.value"
                          :label="item.name"
                          :value="item"
                        />
                      </el-select>
                    </div>
                  </el-form-item>

                </el-col>
              </el-row>
              <el-row>
                <el-col class="column-col" :lg="24" :md="24">
                  <el-form-item label="详细地址" prop="send_car_detail_address">
                    <el-input v-model="ruleForm.send_car_detail_address" type="textarea"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col class="column-col" :lg="24" :md="24">
                  <el-form-item label="送车备注">
                    <el-input v-model="ruleForm.deliver_goods_remark" type="textarea"/>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
        <!--        货物-->
        <div class="column">
          <!-- 单个货物-->
          <div v-for="(item,index) in ruleForm.cars_info" :key=index>
            <div class="column-name">
              <div class="flex-between">
                <div>货物信息</div>
                <div class="add-Btn" @click="addDomain" v-if="index===0">
                  <i class="el-icon-plus"></i>添加发货信息
                </div>
              </div>
            </div>
            <el-row class="">
              <el-col class="column-col" :lg="6" :md="12" :sm="12">
                <el-form-item label="车辆名称" prop="car_model_name">
                  <div style="width: 100%;display: flex">
                    <el-select v-model="item.car_brand_name" @change="changeCarBrand" value-key="id"
                               filterable
                               remote
                               :remote-method="remoteMethod"
                               :loading="loading"
                               placeholder="输入车辆品牌">
                      <el-option
                        v-for="item in carBrand"
                        :key="item.id"
                        :label="item.name"
                        :value="item">
                      </el-option>
                    </el-select>
                    <el-select v-model="item.car_model_name" value-key="id" placeholder="输入型号">
                      <el-option
                        v-for="item in carNum"
                        :key="item.id"
                        :label="item.system_name"
                        :value="item">
                      </el-option>
                    </el-select>
                  </div>
                </el-form-item>
              </el-col>
              <el-col class="column-col" :lg="6" :md="12" :sm="12">
                <el-form-item label="识别码" prop="heading_code">
                  <el-input v-model="item.heading_code"/>
                </el-form-item>
              </el-col>
              <el-col class="column-col" :lg="6" :md="12" :sm="12">
                <el-form-item label="运单号">
                  <el-input v-model="item.tran_num"/>
                </el-form-item>
              </el-col>
              <el-col class="column-col" :lg="6" :md="12" :sm="12">
                <el-form-item label="发货方回扣">
                  <el-input v-model="item.discount"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="">
              <el-col class="column-col" :lg="6" :md="12" :sm="12">
                <el-form-item label="系统报价">
                  <el-input v-model="system_price" disabled/>
                </el-form-item>
              </el-col>
              <el-col class="column-col" :lg="6" :md="12" :sm="12">
                <el-form-item label="接单单价" prop="price">
                  <el-input v-model="item.price"/>
                </el-form-item>
              </el-col>
              <el-col class="column-col" :lg="6" :md="12" :sm="12">
                <el-form-item label="保险费">
                  <el-input v-model="item.premium"/>
                </el-form-item>
              </el-col>
              <el-col class="column-col" :lg="6" :md="12" :sm="12">
                <el-form-item label="发票费">
                  <el-input v-model="item.invoice_charges"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="">
              <el-col class="column-col" :lg="6" :md="12" :sm="12">
                <el-form-item label="业务提成">
                  <el-input v-model="item.commission" disabled/>
                </el-form-item>
              </el-col>
              <el-col class="column-col" :lg="6" :md="12" :sm="12">
                <el-form-item label="垫款">
                  <el-input v-model="item.advance"/>
                </el-form-item>
              </el-col>
              <el-col class="column-col" :lg="6" :md="12" :sm="12">
                <el-form-item label="合计">
                  <el-input v-model="item.total_cost" disabled/>
                </el-form-item>
              </el-col>
              <el-col class="column-col" :lg="6" :md="12" :sm="12">
                <el-form-item label="运输方式">
                  <el-select v-model="item.order_type" placeholder="运输方式" style="width: 100%">
                    <el-option
                      v-for="item in orderTypeOptions"
                      :key="item.value"
                      :label="item.name"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
        <!--支付-->
        <div class="column">
          <div class="column-name">支付方式</div>
          <el-row>
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
              <el-form-item label="付款方式">
                <el-select v-model="ruleForm.payment_method" placeholder="付款方式" style="width:100%">
                  <el-option
                    v-for="(item,index) in payOptions"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
              <el-form-item label="现付">
                <el-input v-model="ruleForm.pay_cash"/>
              </el-form-item>
            </el-col>
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
              <el-form-item label="到付">
                <el-input v-model="ruleForm.freight_collect"/>
              </el-form-item>
            </el-col>
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
              <el-form-item label="月结">
                <el-input v-model="ruleForm.monthly_statement"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
              <el-form-item label="合计费用">
                <el-input v-model="totalPrice"/>
              </el-form-item>
            </el-col>
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
              <el-form-item label="总提成">
                <el-input v-model="totalIn"/>
              </el-form-item>
            </el-col>
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
              <el-form-item label="回单">
                <el-select v-model="ruleForm.has_receipt" value-key="value" placeholder="请选择回单" style="width:100%">
                  <el-option
                    v-for="(item,index) in hasReceipt"
                    :key="item.value"
                    :label="item.name"
                    :value="item"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="备注">
              <el-input v-model="ruleForm.remark" type="textarea"/>
            </el-form-item>
          </el-row>
        </div>
        <!--提交-->
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
import { getOrderMsg, createOrder, orderIndex, getOrderInfo } from '../../../../api/businessOrder/order'

export default {
  data() {
    let checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'))
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
        if (reg.test(value)) {
          callback()
        } else {
          return callback(new Error('请输入正确的手机号'))
        }
      }
    }
    return {
      ruleForm: {},
      rules: {
        consignor_info: [
          { required: true, message: '请写托运人信息', trigger: 'change' }
        ],
        start_attribution: [
          { required: true, message: '请选择发站归属地', trigger: 'blur' }
        ],
        start_cid_info: [
          { required: true, message: '请选择发站地区', trigger: 'blur' }
        ],
        send_car_detail_address: [
          { required: true, message: '请输入详细地址', trigger: 'blur' },
          { min: 1, max: 30, message: '长度在 5 到 50个字符', trigger: 'blur' }
        ],
        consignor_mobile: [
          { validator: checkPhone, trigger: 'blur' }
        ],

        car_model_name: [
          { required: true, message: '请选择发车型号', trigger: 'change' }
        ],
        heading_code: [
          { required: true, message: '请输入识别码信息', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10个字符', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入单价', trigger: 'blur' }
        ],
        consignee_mobile: [
          { validator: checkPhone, trigger: 'blur' }
        ],
        carry_car_detail_address: [
          { required: true, message: '请输入详细地址', trigger: 'blur' },
          { min: 1, max: 30, message: '长度在 5 到 50个字符', trigger: 'blur' }
        ],
        end_attribution: [
          { required: true, message: '请选择发站归属地', trigger: 'blur' }
        ],
        end_cid_info: [
          { required: true, message: '请选择到站地区', trigger: 'blur' }
        ],
        consignee:
          [
            { required: true, message: '请输入收货人信息', trigger: 'blur' },
            { min: 1, max: 10, message: '长度在 1 到 10个字符', trigger: 'blur' }
          ]
      },//规则
      totalPrice: null,//总合计
      totalIn: null,//总提成
      loading: false,
      value: '',
      carNum: [],
      carBrand: [],
      t_business: '',
      hasReceipt: [],
      dataOption: {},
      cityOption: [],
      endCityOption: [],
      payOptions: null,
      orderTypeOptions: null,
      consignerOption: null,
      driverOption: null,
      sendDriverOption: null
    }
  },
  computed: {
    system_price() {
      return
      let param = {
        type: 9,
        start: 0,
        end: 0
      }
      getOrderInfo(param).then((res) => {
        if (res.data.hasdata === 1) {
          // this.consignerOption = res.data.info
        }
      })
      // this.ruleForm
      return 4000
    }
  },
  watch: {
    'ruleForm.commission': {
      handler: function() {

      },
      immediate: true,
      deep: true
    }
  },
  created() {
    this.getPageData()
  },
  mounted() {},
  methods: {
    async getPageData() {
      // 获取车牌5 //6 获取归属地 //7省级城市的信息 //8 获取提送车司机的公司
      let params = [
        {
          type: 5
        },
        {
          type: 6
        },
        {
          type: 7
        },
        {
          type: 8
        }
      ]
      let dataOption = {}
      await params.forEach((item, index) => {
        getOrderInfo(item).then((res) => {
          if (res.code === 200) {
            if (index === 0) {
              dataOption.carBrand = res.data
            }
            if (index === 1) {
              dataOption.place = res.data.info
            }
            if (index === 2) {
              dataOption.province = res.data.info
            }
            if (index === 3) {
              dataOption.sendCarTeam = res.data.info
              dataOption.acceptCarTeam = res.data.info
            }
          }
        })
      })
      this.dataOption = dataOption
      await getOrderMsg().then((res) => {
        if (res) {
          let info = res.data.info
          let formParams = {
            type_of_business: '',// 详情
            consignor_info: {},
            consignor_mobile: '',//托运人电话,
            start_attribution: '',//	发站归属地
            delivery_money: '',//提车费
            carry_car_detail_address: '',//提车详细地址
            carry_car_info: {},// 提车司机
            send_car_info: {},// 送车司机
            send_car_detail_address: '',
            deliver_goods_remark: '',
            carry_car_remark: '',
            consignee: '',//收货人
            consignee_mobile: '',
            end_attribution: '',// 到站归属地
            start_pid_info: {},//发站省id
            start_cid_info: {},//发站市id
            end_pid_info: {},//
            end_cid_info: {},//到站市
            cars_info: [
              {
                order_type: null,// 运输类型
                car_brand_id: null, //车辆品牌ID
                car_brand_name: null, //车辆品牌名称
                car_model_id: null, //车辆型号ID
                car_model_name: null, //车辆型号名称
                price: null, //接车单价
                discount: null, //发货方回扣
                premium: null, //保险费
                invoice_charges: null,  //发票费
                heading_code: null,  //识别码
                tran_num: null,  //运单号
                advance: null,  //垫款
                total_cost: '10000元',
                commission: '',// 提成,
                system_price: ''//系统报价
              }
            ],
            payment_method: null,
            has_receipt: 0,//是否回单
            consignor_company: '',//托运人公司名称
            is_short_order: null,//是否是临时订单
            remark: null,//
            send_money: null,
            pay_cash: null,//现付
            freight_collect: null,//到付
            monthly_statement: '',//月结
            carry_car_company: {},
            send_car_company: {}
          }
          this.ruleForm = { ...info, ...formParams }
          this.hasReceipt = info.has_receipt
          this.payOptions = info.pay_method
          this.orderTypeOptions = info.order_type
        }
      })
    },
    filterMethod(val) {
      this.consignerOption = []
      if (val) {
        let param = {
          type: 1, usrename: val
        }
        getOrderInfo(param).then((res) => {
          if (res.data.hasdata === 1) {
            this.consignerOption = res.data.info
          }
        })
      }
    },
    changeConsignor(val) {
      //货运人修改业务类型
      this.t_business = val.t_business
      this.ruleForm.type_of_business = val.t_of_business_id
    },
    changeProvince(val) {
      this.cityOption = []
      this.ruleForm.start_cid_info = null
      let param = {
        id: val.id,
        type: 4
      }
      getOrderInfo(param).then((res) => {
        if (res.data.hasdata === 1) {
          this.cityOption = res.data.info
        }
      })
    },
    changeEndProvince(val) {
      this.endCityOption = []
      this.ruleForm.end_cid_info = null
      let param = {
        id: val.id,
        type: 4
      }
      getOrderInfo(param).then((res) => {
        if (res.data.hasdata === 1) {
          this.endCityOption = res.data.info
        }
      })
    },
    changeCarTeam(val) {
      this.driverOption = []
      this.ruleForm.carry_car_info = null
      let param = {
        vehicle_type: val.name,
        type: 2
      }
      getOrderInfo(param).then((res) => {
        if (res.data.hasdata === 1) {
          this.driverOption = res.data.info
        }
      })
    },
    changeSendCarTeam(val) {
      this.sendDriverOption = []
      let param = {
        vehicle_type: val.name,
        type: 2
      }
      getOrderInfo(param).then((res) => {
        if (res.data.hasdata === 1) {
          this.sendDriverOption = res.data.info
        }
      })
    },
    changeCarBrand(val) {
      let param = {
        car_pid: val.id,
        type: 3
      }
      getOrderInfo(param).then((res) => {
        if (res) {
          this.carNum = res.data.info
        }
      })
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.carBrand = this.dataOption.carBrand.filter(item => {
            return item.name.toLowerCase().indexOf(query.toLowerCase()) > -1
          })
        }, 200)
      } else {
        this.carBrand = []
      }
    },
    addDomain() {
      let newDomain = {
        order_type: null,// 运输类型
        car_brand_id: null, //车辆品牌ID
        car_brand_name: null, //车辆品牌名称
        car_model_id: null, //车辆型号ID
        car_model_name: null, //车辆型号名称
        price: null, //接车单价
        discount: null, //发货方回扣
        premium: null, //保险费
        invoice_charges: null,  //发票费
        heading_code: null,  //识别码
        tran_num: null,  //运单号
        advance: null,  //垫款
        total_cost: '10000元',
        commission: '',// 提成,
        system_price: ''//系统报价
      }
      this.ruleForm.cars_info.push(newDomain)
    },

    submitForm(el) {
      let params = this.ruleForm
      this.$refs[el].validate((valid) => {
        if (valid) {
          alert('提交')
          createOrder().then((res) => {

          })
        } else {
          console.log('错误提交!!')
          return false
        }
      })

      console.log(params, 'params')
    },
    resetForm() {},
    handleChange() {
      return new Date().toLocaleDateString()
    }
  },
  components: {},
  props: {},
  destroyed() {
  }
}
</script>
<style scoped lang="scss">
  @import "src/styles/mixin.scss";

  .page-title {
    font-size: j(30);
    padding: j(10) j(20);
    margin: j(5) 0;
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
      padding: 0 0 0 j(10);
      box-shadow: 0 2px 10px #f2f2f2;
    }
  }

  .add-Btn {
    background: #ffc978;
    padding: 0 j(20);
    cursor: pointer;
  }

  .btns-commit {
    padding: j(30) j(90);
    /*box-shadow: 2px 2px 10px #f2f2f2;*/
  }

</style>
