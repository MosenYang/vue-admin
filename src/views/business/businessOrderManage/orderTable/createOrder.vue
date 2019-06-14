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
              <el-input v-model="ruleForm.t_business" disabled/>
            </el-form-item>
          </el-col>
          <el-col class="column-col" :lg="6" :md="12" :sm="12">
            <el-form-item label="经办人">
              <el-input v-model="ruleForm.operator" disabled/>
            </el-form-item>
          </el-col>
        </el-row>
        <!--货人-->
        <div class="column">
          <el-row>
            <!-- 发货人-->
            <el-col :lg="12" :md="12" :sm="24">
              <div class="column-name">发货方信息</div>
              <el-row>
                <el-col class="column-col" :lg="12" :md="12" :sm="12">
                  <el-form-item label="托运人" prop="consignor_info">
                    <el-select v-model="ruleForm.consignor_info"
                               value-key="id"
                               filterable
                               remote
                               clearable
                               @change="changeConsignor"
                               :remote-method="filterMethod"
                               :loading="loading"
                               style="width: 100%"
                               placeholder="输入名字">
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
                      <el-select v-model="ruleForm.start_cid_info"
                                 value-key="id" placeholder="请选择"
                                 @change="computeQuote"
                                 style="width: 50%">
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
                      <el-select v-model="ruleForm.carry_car_company"
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
                      <el-select v-model="ruleForm.end_attribution" value-key="id" placeholder="到站归属地"
                                 style="width: 100%">
                        <el-option
                          v-for="item in dataOption.endPlace"
                          :key="item.id"
                          :label="item.name"
                          :value="item"
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
                                 @change="changeEndProvince"
                                 placeholder="请选择省" style="width:50%">
                        <el-option
                          v-for="item in dataOption.endProvince"
                          :key="item.id"
                          :label="item.name"
                          :value="item"
                        />
                      </el-select>
                      <el-select v-model="ruleForm.end_cid_info"
                                 value-key="id"
                                 placeholder="请选择市"
                                 @change="computeQuote"
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
                      <el-select v-model="ruleForm.send_car_company" value-key="value" @change="changeSendCarTeam"
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
        <!--货物-->
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
                  <el-input v-model="ruleForm.system_price" disabled/>
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
                  <el-input v-model="item.commission" disabled value="1000"/>
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
                    :disabled="item.disabled"
                    :label="item.name"
                    :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
              <el-form-item label="现付" prop="pay_cash">
                <el-input v-model="ruleForm.pay_cash"/>
              </el-form-item>
            </el-col>
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
              <el-form-item label="到付" prop="freight_collect">
                <el-input v-model="ruleForm.freight_collect"/>
              </el-form-item>
            </el-col>
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
              <el-form-item label="月结" prop="monthly_statement">
                <el-input v-model="ruleForm.monthly_statement"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
              <el-form-item label="合计费用">
                <el-input v-model="totalPrice" disabled/>
              </el-form-item>
            </el-col>
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
              <el-form-item label="总提成">
                <el-input v-model="totalIn" disabled/>
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
import { getOrderMsg, createOrder, orderIndex, getOrderInfo } from '../../../../api/businessOrder/order'
// import {}
export default {
  data() {
    let checkPhone = (rule, value, callback) => {
      var reg = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/
      // const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
      if (!value) {
        return callback(new Error('手机号不能为空'))
      }
      if (value.length !== 11) {
        return callback(new Error('请输入11位手机号'))
      }
      if (reg.test(value)) {
        return callback()
      }
      return callback(new Error('请输入正确的手机号'))
    }
    let checkPrice = (rule, value, callback) => {
      let t = Number(this.ruleForm.pay_cash) + Number(this.freight_collect) + Number(this.monthly_statement)
      console.log('检查总额度', t)
      if (this.totalPrice !== t) {
        callback('您分期的额度不等于总合计费用')
      } else {
        callback()
      }
    }
    let checkPeople = (rule, value, callback) => {
      console.log('444444444444444', value)
      if (value.id || value.value) {
        callback()
      } else {
        return callback(new Error('必须选择系统匹配的选项'))
      }
    }
    let checkCar = (rule, value, callback) => {
      console.log('00', value)
      if (value.id || value.value) {
        callback()
      } else {
        return callback(new Error('必须选择系统匹配的选项'))
      }
    }
    let checkStr = (rule, value, callback) => {}
    return {
      ruleForm: {},
      rules: {
        consignor_info: [
          { required: true, validator: checkPeople, trigger: 'blur' }
        ],
        start_attribution: [
          { required: true, validator: checkPeople, trigger: 'blur' }
        ],
        start_cid_info: [
          { required: true, validator: checkPeople, trigger: 'blur' }
        ],
        send_car_detail_address: [
          { required: true, message: '请输入详细地址', trigger: 'blur' },
          { min: 1, max: 30, message: '长度在 5 到 50个字符', trigger: 'blur' }
        ],
        consignor_mobile: [
          { required: true, validator: checkPhone, trigger: 'blur' }
        ],

        car_model_name: [
          { required: true, message: '请选择发车型号', trigger: 'change' }
          // { required: true, validator: checkCar, trigger: 'blur,change' }
        ],
        heading_code: [
          { required: true, message: '请输入识别码信息', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10个字符', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入单价', trigger: 'blur' }
        ],
        consignee_mobile: [
          { required: true, validator: checkPhone, trigger: 'change,blur' }
        ],
        carry_car_detail_address: [
          { required: true, message: '请输入详细地址', trigger: 'blur' },
          { min: 1, max: 30, message: '长度在 5 到 50个字符', trigger: 'blur' }
        ],
        end_attribution: [
          { required: true, message: '请选择发站归属地', trigger: 'blur' }
          // { required: true, validator: checkPeople, trigger: 'blur' }
        ],
        end_cid_info: [
          { required: true, message: '请选择到站地区', trigger: 'blur' }
        ],
        consignee: [
          { required: true, message: '请输入收货人信息', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10个字符', trigger: 'blur' }
        ],
        pay_cash: [
          { validator: checkPrice, trigger: 'blur' }
        ],
        freight_collect: [
          { validator: checkPrice, trigger: 'blur' }
        ],
        monthly_statement: [
          { validator: checkPrice, trigger: 'blur' }
        ]
      },//规则
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
      sendDriverOption: null,
      isDisabled: true
    }
  },
  computed: {
    'totalPrice'() {//总合计
      let array = this.ruleForm.cars_info instanceof Array
      if (array) {
        let totalPrice = 0
        for (let i = 0; i < this.ruleForm.cars_info.length; i++) {
          totalPrice += this.ruleForm.cars_info[i].total_cost
        }
        this.ruleForm.totalPrice = parseInt(totalPrice)
        return parseInt(totalPrice)
      }
    },
    'totalIn'() {// 总提成
      let array = this.ruleForm.cars_info instanceof Array
      if (array) {
        let totalIn = 0
        for (let i = 0; i < this.ruleForm.cars_info.length; i++) {
          totalIn += this.ruleForm.cars_info[i].commission
        }
        this.ruleForm.totalIn = parseInt(totalIn)
        return parseInt(totalIn)
      }
    }
  },
  watch: {
    'ruleForm': {
      handler: function(nVal, oVal) {
        let array = nVal.cars_info instanceof Array
        let time
        if (time) clearTimeout(time)
        time = setTimeout(() => {
          if (nVal && array) {
            nVal.cars_info.map((item) => {
              //商品提成
              if (nVal.system_price && item.price && nVal.system_price && item.price > nVal.system_price) {
                console.log(nVal.system_price, item.price, '报价 和 单价')
                let p = 0
                if (nVal.t_business_id === 3) { // 汽贸客户
                  p = (item.price - nVal.system_price) * 0.01// 提成
                  console.log(p, '提成')
                  item.commission = parseInt(p)
                } else if (nVal.t_business_id === 5) { // 商品车
                  item.commission = 0
                } else {
                  item.commission = 10 //其他等于10
                }
              }
              if (item.price < nVal.system_price) {
                item.commission = ''
              }
              // 子合计
              item.total_cost = Number(item.discount) + Number(item.price) + Number(item.premium) + Number(item.invoice_charges) + Number(nVal.delivery_money) + Number(nVal.send_money)
              console.log(nVal.totalPrice, '总合计 总提成', nVal.totalIn)
            })
          }
        }, 200)
      },
      immediate: true,
      deep: true
    },
    'ruleForm.cars_info': {
      handler: function(nVal, oVal) {
        let array = nVal instanceof Array
        if (array && nVal.length > 1) {
          this.payOptions.forEach((item) => {
            if (item.value === 4) {
              item.disabled = true
            } else {
              item.disabled = false
            }
          })
        }
      },
      immediate: true,
      deep: true
    },
    'payment_method0'(nVal) {
      if (nVal.value === 4) {
        // if (Number(this.ruleForm.pay_cash) && Number(this.freight_collect)) {
        // this.monthly_statement = this.totalPrice - (Number(this.ruleForm.pay_cash) + Number(this.freight_collect))
        // }
      }
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
              dataOption.endPlace = dataOption.place = res.data.info
            }
            if (index === 2) {
              dataOption.province = res.data.info
              dataOption.endProvince = res.data.info
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
            totalPrice: '',//总合计
            totalIn: '',//总提成
            consignor_info: {},
            consignor_mobile: '',//托运人电话,
            start_attribution: '',//	发站归属地
            delivery_money: '',//提车费
            carry_car_detail_address: '',//提车详细地址
            carry_car_info: null,// 提车司机
            send_car_info: null,// 送车司机
            send_car_detail_address: '',
            deliver_goods_remark: '',
            carry_car_remark: '',
            consignee: '',//收货人
            consignee_mobile: '',
            end_attribution: '',// 到站归属地
            start_pid_info: {},//发站省id
            start_cid_info: {},//发站市id
            end_pid_info: {},//
            end_cid_info: {},//到站市id
            cars_info: [
              {
                order_type: '',// 运输类型
                car_brand_id: '', //车辆品牌ID
                car_brand_name: '', //车辆品牌名称
                car_model_id: '', //车辆型号ID
                car_model_name: '', //车辆型号名称
                price: '', //接车单价
                discount: '', //发货方回扣
                premium: '', //保险费
                invoice_charges: '',  //发票费
                heading_code: '',  //识别码
                tran_num: '',  //运单号
                advance: '',  //垫款
                total_cost: '',
                commission: '',// 提成,
                system_price: ''//系统报价
              }
            ],
            payment_method: null,
            has_receipt: '',//是否回单
            consignor_company: '',//托运人公司名称
            is_short_order: null,//是否是临时订单
            remark: null,//
            send_money: '',
            pay_cash: null,//现付
            freight_collect: null,//到付
            monthly_statement: '',//月结
            carry_car_company: null,
            send_car_company: null,
            system_price: null,
            t_business: '',
            t_business_id: ''// 业务类型
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
      if (val && val !== ' ') {
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
      console.log('业务类型', val)
      this.ruleForm.t_business = val.t_business
      this.ruleForm.t_business_id = val.t_business_id
    },
    changeProvince(val) {
      this.cityOption = []
      this.ruleForm.start_cid_info = null
      this.ruleForm.system_price = null
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
      this.ruleForm.system_price = null
      console.log('到达省', val)
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
    computeQuote(val) {// 报价
      console.log('计算提成', val)
      if (this.ruleForm.end_cid_info.id && this.ruleForm.start_cid_info.id) {
        let param = {
          type: 9,
          start: this.ruleForm.start_cid_info.id,
          end: this.ruleForm.end_cid_info.id
        }
        getOrderInfo(param).then((res) => {
          if (res.code === 200) {
            this.ruleForm.system_price = res.data
          }
        })
      }
    },

    changeCarTeam(val) {
      this.driverOption = []
      this.ruleForm.carry_car_info = null
      console.log('val', val)
      let param = {
        company_id: val.value,
        type: 2
      }
      getOrderInfo(param).then((res) => {
        if (res.data.hasdata === 1) {
          this.driverOption = res.data.info
        }
      })
    },
    changeSendCarTeam(val) {
      console.log('发车团队', val)
      this.sendDriverOption = []
      let param = {
        vehicle_type: val.value,
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
        order_type: '',// 运输类型
        car_brand_id: '', //车辆品牌ID
        car_brand_name: '', //车辆品牌名称
        car_model_id: '', //车辆型号ID
        car_model_name: '', //车辆型号名称
        price: '', //接车单价
        discount: '', //发货方回扣
        premium: '', //保险费
        invoice_charges: '',  //发票费
        heading_code: '',  //识别码
        tran_num: '',  //运单号
        advance: '',  //垫款
        total_cost: '',
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
    testTotalPrice() {

      // if (!this.ruleForm.payment_method.value) return
      // let t = Number(this.ruleForm.pay_cash) + Number(this.freight_collect) + Number(this.monthly_statement)
      // console.log('检查总额度', t)
      // if (value === 4) {
      //   if (this.totalPrice !== t) {
      //     // this.$message({
      //     //   message: '由于您的多笔付款额度有误，已经自动帮你调整!',
      //     //   type: 'warning'
      //     // })
      //     // this.monthly_statement = this.totalPrice - (Number(this.ruleForm.pay_cash) + Number(this.freight_collect))
      //
      //   }
      // }
    }
  },
  components: {},
  props: {},
  destroyed() {}
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
