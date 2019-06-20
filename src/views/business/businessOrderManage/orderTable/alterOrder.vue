<template>
  <div class="create-order-page">
    <div class="flex-between page-title">
      <div class="">修改订单</div>
      <el-button ype="primary" @click="">返回</el-button>
    </div>
    <div class="page-content">
      <el-form ref="ruleForm" :model="ruleForm"
               :rules="rules" label-width="100px"
               label-position="right">
        <el-row class="column">
          <div class="column-name">订单信息</div>
          <el-col class="column-col" :lg="6" :md="12" :sm="12">
            <el-form-item label="订单号">
              <el-input v-model="ruleForm.order_num" disabled/>
            </el-form-item>
          </el-col>
          <el-col class="column-col" :lg="6" :md="12" :sm="12">
            <el-form-item label="开单日期">
              <el-input v-model="ruleForm.create_order_time" disabled/>
            </el-form-item>
          </el-col>
          <el-col class="column-col" :lg="6" :md="12" :sm="12">
            <el-form-item label="业务类型">
              <el-input v-model="businessName" disabled/>
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
                    <!-- ruleForm.consignor_info    consignor_company-->
                    <el-select v-model="consignorInfo"
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
                        <span style="float: left; color: #8492a6;">{{item.username}}</span>
                        <span style="float: right; color: #8492a6">{{item.company}}</span>
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col class="column-col" :lg="12" :md="12" :sm="12">
                  <el-form-item label="托运人电话" prop="consignor_mobile">
                    <el-input v-model="ruleForm.consignor_mobile"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col class="column-col" :lg="12" :md="12" :sm="12">
                  <el-form-item label="发站归属地" prop="start_attribution">
                    <div style="width: 100%;display: flex">
                      <el-select v-model="ruleForm.start_attribution"
                                 placeholder="发站归属地"
                                 style="width: 100%">
                        <el-option
                          v-for="item in dataOption.place"
                          :key="item.id"
                          :label="item.name"
                          :value="item.name"/>
                      </el-select>
                    </div>
                  </el-form-item>
                </el-col>
                <el-col class="column-col" :lg="12" :md="12" :sm="12">
                  <el-form-item label="发站省/市">
                    <div style="width: 100%;display: flex">
                      <el-form-item prop="start_pid_info">
                        <el-select v-model="start_pid_info"
                                   value-key="id"
                                   @change='changeProvince'
                                   placeholder="请选择省">
                          <el-option
                            v-for="(item) in dataOption.province"
                            :key="item.id"
                            :label="item.name"
                            :value="item"
                          />
                        </el-select>
                      </el-form-item>
                      <el-form-item prop="start_cid_info">
                        <el-select v-model="start_cid_info"
                                   value-key="id" placeholder="请选择市"
                                   @change="computeQuote">
                          <el-option
                            v-for="item in cityOption"
                            :key="item.id"
                            :label="item.area_name"
                            :value="item"
                          />
                        </el-select>
                      </el-form-item>
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
                      <el-select v-model="carry_car_company"
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
                      <el-select v-model="carry_car_info"
                                 value-key="id" placeholder="请选择"
                                 style="width: 50%">
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
                    <el-input v-model="ruleForm.consignee_mobile"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col class="column-col" :lg="12" :md="12" :sm="12">
                  <el-form-item label="到站归属地" prop="end_attribution">
                    <div style="width: 100%;display: flex">
                      <el-select v-model="ruleForm.end_attribution" placeholder="到站归属地"
                                 style="width: 100%">
                        <el-option
                          v-for="item in dataOption.endPlace"
                          :key="item.id"
                          :label="item.name"
                          :value="item.name"
                        />
                      </el-select>
                    </div>
                  </el-form-item>
                </el-col>

                <el-col class="column-col" :lg="12" :md="12" :sm="12">
                  <el-form-item label="到站省/市">
                    <div style="width: 100%;display: flex">
                      <el-form-item prop="end_pid_info">
                        <el-select v-model="end_pid_info"
                                   value-key="id"
                                   @change="changeEndProvince"
                                   placeholder="请选择省">
                          <el-option
                            v-for="item in dataOption.endProvince"
                            :key="item.id"
                            :label="item.name"
                            :value="item"
                          />
                        </el-select>
                      </el-form-item>
                      <el-form-item prop="end_cid_info">
                        <el-select v-model="end_cid_info"
                                   value-key="id"
                                   placeholder="请选择市"
                                   @change="computeQuote"
                        >
                          <el-option
                            v-for="item in endCityOption"
                            :key="item.id"
                            :label="item.area_name"
                            :value="item"
                          />
                        </el-select>
                      </el-form-item>
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
                      <el-select v-model="send_car_company" value-key="value"
                                 @change="changeSendCarTeam"
                                 placeholder="请选择"
                                 style="width:50%">
                        <el-option
                          v-for="item in dataOption.sendCarTeam"
                          :key="item.value"
                          :label="item.name"
                          :value="item"
                        />
                      </el-select>
                      <el-select v-model="send_car_info" placeholder="请选择" value-key="value"
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
                  <!--  send_car_detail_address  -->
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
          <div>
            <div class="column-name">
              <div class="flex-between">
                货物信息
              </div>
            </div>
            <el-row class="">
              <el-col class="column-col" :lg="6" :md="12" :sm="12">
                <el-form-item label="车辆名称">
                  <div style="width: 100%;display: flex">
                    <el-form-item :rules="rulesCar">
                      <!--                      car_brand_name-->
                      <el-select v-model="car_brand_name" @change="changeCarBrand" value-key="id"
                                 filterable
                                 remote
                                 :remote-method="remoteMethod"
                                 :loading="loading"
                                 placeholder="搜车辆品牌">
                        <el-option
                          v-for="item in carBrand"
                          :key="item.id"
                          :label="item.name"
                          :value="item">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <!-- car_model_name-->
                    <el-form-item :rules="rulesCarModel">
                      <el-select v-model="car_model_name" value-key="id" placeholder="选车型">
                        <el-option v-for="item in carNum"
                                   :key="item.id"
                                   :label="item.system_name"
                                   :value="item">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </el-form-item>
              </el-col>
              <!-- prop="heading_code"-->
              <el-col class="column-col" :lg="6" :md="12" :sm="12">
                <el-form-item label="识别码"
                              :rules="[
                              {required: true, message: '识别码不能为空', trigger: 'blur'},
                              { min: 4, max: 20, message: '长度在 4 到 20个字符', trigger: 'blur' }
                              ]"
                >
                  <el-input v-model="ruleForm.heading_code"/>
                </el-form-item>
              </el-col>
              <el-col class="column-col" :lg="6" :md="12" :sm="12">
                <el-form-item label="运单号">
                  <el-input v-model="ruleForm.tran_num"/>
                </el-form-item>
              </el-col>
              <el-col class="column-col" :lg="6" :md="12" :sm="12">
                <el-form-item label="发货方回扣">
                  <el-input v-model="ruleForm.discount"/>
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
                <el-form-item label="接单单价"
                              :rules="{required: true, message: '接单单价不能为空', trigger: 'blur'}"
                >
                  <el-input v-model.number="ruleForm.price"/>
                </el-form-item>
              </el-col>
              <el-col class="column-col" :lg="6" :md="12" :sm="12">
                <el-form-item label="保险费">
                  <el-input v-model="ruleForm.premium"/>
                </el-form-item>
              </el-col>
              <el-col class="column-col" :lg="6" :md="12" :sm="12">
                <el-form-item label="发票费">
                  <el-input v-model="ruleForm.invoice_charges"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col class="column-col" :lg="6" :md="12" :sm="12">
                <el-form-item label="业务提成">
                  <el-input v-model="ruleForm.commission" disabled value="1000"/>
                </el-form-item>
              </el-col>
              <el-col class="column-col" :lg="6" :md="12" :sm="12">
                <el-form-item label="垫款">
                  <el-input v-model="ruleForm.advance"/>
                </el-form-item>
              </el-col>
              <el-col class="column-col" :lg="6" :md="12" :sm="12">
                <el-form-item label="合计">
                  <el-input v-model="ruleForm.total_cost" disabled/>
                </el-form-item>
              </el-col>
              <el-col class="column-col" :lg="6" :md="12" :sm="12">
                <el-form-item label="运输方式">
                  <el-select v-model="ruleForm.order_type" placeholder="运输方式" style="width: 100%">
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
                <el-input v-model="ruleForm.total_cost" disabled/>
              </el-form-item>
            </el-col>
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
              <el-form-item label="总提成">
                <el-input v-model="ruleForm.commission" disabled/>
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
        <!--一次运输-->
        <!--<div class="column">
          <div class="column-name">一次运输</div>
          <el-row>
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
              <el-form-item label="运输批次">
                <el-select v-model="ruleForm.payment_method" placeholder="运输批次"
                           style="width:100%">
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
              <el-form-item label="运输司机" prop="pay_cash">
                <el-input/>
              </el-form-item>
            </el-col>
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
              <el-form-item label="应收质损" prop="freight_collect">
                <el-input/>
              </el-form-item>
            </el-col>
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
              <el-form-item label="应收质损人" prop="monthly_statement">
                <el-input/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
              <el-form-item label="运输路线">
                <el-input disabled/>
              </el-form-item>
            </el-col>
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
              <el-form-item label="司机电话" prop="pay_cash">
                <el-input/>
              </el-form-item>
            </el-col>
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
              <el-form-item label="应收质损" prop="freight_collect">
                <el-input/>
              </el-form-item>
            </el-col>
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
              <el-form-item label="应收质损人" prop="monthly_statement">
                <el-input/>
              </el-form-item>
            </el-col>
          </el-row>
        </div>-->
        <!--提交-->
        <div style="width: 100%" class="btns-commit">
          <el-row class="flex-center">
            <el-col :md="8" :xs="8" :sm="8" class="flex-around">
              <el-button type="primary" @click="submitForm('ruleForm')">立即修改</el-button>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import { editOrder, alterOrder, getOrderInfo } from '../../../../api/businessOrder/order'

let car = {
  car_brand_id: '117', //车辆品牌ID
  car_brand_name: '宝马', //车辆品牌名称
  car_model_id: '1', //车辆型号ID
  car_model_name: 'AC Schnitzer X5', //车辆型号名称
  price: 1000, //接车单价
  discount: 100, //发货方回扣
  premium: 100, //保险费
  invoice_charges: 100,  //发票费
  heading_code: 'fewfe123',  //识别码
  tran_num: 'ab123',  //运单号
  advance: 123,  //垫款
  system_price: 123,// "系统报价",
  commission: 123,// "业务提成",
  total_cost: 1000,//"合计",
  order_type: 1// "订单类型"
}
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
      if (value) {
        return callback()
      } else {
        let a = Number(this.ruleForm.pay_cash)
        let b = Number(this.ruleForm.freight_collect)
        let c = Number(this.ruleForm.monthly_statement)
        let t = a + b + c
        if (this.totalPrice === t) {
          return callback()
        }
        return callback('分期额度不等于总合计费用!')
      }
    }
    let checkDown = (rule, value, callback) => {
      if (value && value.id || value && value.value) {
        callback()
      } else {
        return callback(new Error('请选系统匹配的选项'))
      }
    }
    // 自定义验证车
    let checkCar = (rule, value, callback) => {
      console.log('自定义验证车value', value)
      if (value && value.name || value && value.id) {
        callback()
      } else {
        callback('请选择匹配车牌')
      }
    }
    let checkStr = (rule, value, callback) => {
      let reg = new RegExp('[`~!@#$^&*()=|{}\':\',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“\'。，、？]')
      let rs = reg.test(value)
      if (rs) {
        callback(new Error('内容存在特殊字符!'))
      } else {
        callback()
      }
    }
    return {
      consignorName: '',// 监控的托运人
      ruleForm: {},
      rules: {
        consignor_info: [//人
          { required: true, validator: checkDown, trigger: ['change'] }
        ],
        start_pid_info: [//发车省 {}
          { required: true, validator: checkDown, trigger: ['change'] }
        ],
        start_cid_info: [//发车市 {}
          { required: true, validator: checkDown, trigger: ['change'] }
        ],
        end_pid_info: [//到站省 {}
          { required: true, validator: checkDown, trigger: ['change'] }
        ],
        end_cid_info: [// 到站市 {}
          { required: true, validator: checkDown, trigger: ['change'] }
        ],
        start_attribution: [//发站归属 str
          { required: true, message: '请选发站地', trigger: 'change' }
        ],
        end_attribution: [//到站归属 str
          { required: true, message: '请选到站地', trigger: 'change' }
        ],
        consignor_mobile: [//托运人电话
          { required: true, validator: checkPhone, trigger: ['blur'] }
        ],
        consignee_mobile: [// 收货人电话
          { required: true, validator: checkPhone, trigger: ['blur'] }
        ],
        send_car_detail_address: [
          { required: true, message: '请输入详细地址', trigger: 'blur' },
          { min: 1, max: 30, message: '长度在 5 到 50个字符', trigger: 'blur' }
        ],
        carry_car_detail_address: [
          { required: true, message: '请输入详细地址', trigger: 'blur' },
          { min: 1, max: 30, message: '长度在 5 到 50个字符', trigger: 'blur' }
        ],
        consignee: [// 收货人
          { required: true, message: '请输入收货人信息', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10个字符', trigger: 'blur' }
        ],
        pay_cash: [
          { validator: checkPrice, trigger: ['change', 'blur'] }
        ],
        freight_collect: [
          { validator: checkPrice, trigger: ['change', 'blur'] }
        ],
        monthly_statement: [
          { validator: checkPrice, trigger: ['change', 'blur'] }
        ],
        remark: [
          { validator: checkStr, trigger: ['change', 'blur'] }
        ]
      },//规则
      loading: false,
      value: '',
      carNum: [],
      carBrand: [],
      t_business: '',
      dataOption: {},// 获取车牌5 //6 获取归属地 //7省级城市的信息 //8 获取提送车司机的公司==综合对象
      cityOption: [],//市区
      endCityOption: [],//到站市
      payOptions: null,
      hasReceipt: [],// 回单选项
      orderTypeOptions: null,
      consignerOption: [],
      driverOption: null,// 司机选项
      sendDriverOption: null,
      isDisabled: true,
      businessOptions: [],//业务类型,不做选择
      rulesCar: { required: true, validator: checkCar, trigger: ['change'] },
      rulesCarModel: { required: true, validator: checkCar, trigger: 'change' }
    }
  },
  computed: {
    'consignorInfo': {
      get() {
        if (this.ruleForm.consignor_info) {
          let obj = this.ruleForm.consignor_info
          return obj.name || obj.username
        }
      },
      set(val) {
        this.ruleForm.consignor_info = val
      }
    },
    'businessName': {
      get() {
        if (this.ruleForm.type_of_business) {
          let obj = this.ruleForm.type_of_business
          if (obj.name || obj.t_business) return obj.name || obj.t_business
        }
      },
      set(val) {
        this.ruleForm.type_of_business = val
      }
    },
    'start_pid_info': {
      get() {
        if (this.ruleForm.start_pid_info) {
          return this.ruleForm.start_pid_info.name
        }
      },
      set(val) {
        this.ruleForm.start_cid_info = []// 清空城
        this.ruleForm.start_pid_info = val
      }
    },
    'start_cid_info': {
      get() {
        if (this.ruleForm.start_cid_info) {
          return this.ruleForm.start_cid_info.name || '无'
        }
      },
      set(val) {
        this.ruleForm.start_pid_info = val
      }
    },
    'end_pid_info': {
      get() {
        if (this.ruleForm.end_pid_info) {
          return this.ruleForm.end_pid_info.name
        }
      },
      set(val) {
        this.ruleForm.end_cid_info = []// 清空 城
        this.ruleForm.end_pid_info = val
      }
    },
    'end_cid_info': {
      get() {
        if (this.ruleForm.end_cid_info) return this.ruleForm.end_cid_info.name || '无'
      },
      set(val) {
        this.ruleForm.end_cid_info = val
      }
    },
    //提车公司
    'carry_car_company': {
      get() {
        if (this.ruleForm.carry_car_company) return this.ruleForm.carry_car_company.name || '无'
      },
      set(val) {
        this.ruleForm.carry_car_info = []//
        this.ruleForm.carry_car_company = val
      }
    },
    'carry_car_info': {
      get() {
        if (this.ruleForm.carry_car_info) return this.ruleForm.carry_car_info.name || '无'
      },
      set(val) {
        this.ruleForm.carry_car_info = val
      }
    },
    'send_car_company': {
      get() {
        if (this.ruleForm.send_car_company) return this.ruleForm.send_car_company.name || '无'
      },
      set(val) {
        this.ruleForm.send_car_info = []//清空
        this.ruleForm.send_car_company = val
      }
    },
    'send_car_info': {
      get() {
        if (this.ruleForm.send_car_info) return this.ruleForm.send_car_info.name || '无'
      },
      set(val) {
        this.ruleForm.send_car_info = val
      }
    },
    'car_brand_name': {
      get() {
        if (this.ruleForm.car_brand_name) return this.ruleForm.car_brand_name.name || '无'
      },
      set(val) {
        this.ruleForm.car_model_name = []
        this.ruleForm.car_brand_name = val
      }
    },
    'car_model_name': {
      get() {
        if (this.ruleForm.car_model_name) return this.ruleForm.car_model_name.name || '无'
      },
      set(val) {
        this.ruleForm.car_model_name = val
      }
    }
  },
  watch: {},
  created() {this.getPageData()},
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
      //调页面数据
      let param = { id: 7 }
      await editOrder(param).then((res) => {
        if (res.code === 200) {
          let { has_receipt_s, order_type_s, pay_method_s, type_of_business_s } = res.data.info
          delete res.data.info.has_receipt_s
          delete res.data.info.order_type_s
          delete res.data.info.pay_method_s
          delete res.data.info.type_of_business_s
          this.ruleForm = res.data.info
          console.log('修改订单的数据info', res.data.info)
          this.consignorName = this.ruleForm.consignor_info
          this.hasReceipt = has_receipt_s
          this.payOptions = pay_method_s
          this.orderTypeOptions = order_type_s
          this.businessOptions = type_of_business_s//并不会用

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
    //货运人修改业务类型
    changeConsignor(val) {
      console.log('托运人选择', val)
      this.ruleForm.t_business = val.t_business
      this.ruleForm.t_business_id = val.t_business_id
      this.businessName = val
    },
    changeProvince(val) {
      console.log('点击省', val)
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
      let car = { ...carInfo }
      this.ruleForm.cars_info.push(car)
    },
    deleteDomain(val) {
      this.ruleForm.cars_info.splice(val, 1)
    },
    submitForm(el) {
      let params = this.ruleForm
      let cars_info = {}
      Object.keys(car).forEach((item) => {
        cars_info[item] = this.ruleForm[item]
      })
      cars_info.car_brand_id = this.ruleForm.car_brand_name.id
      cars_info.car_brand_name = this.ruleForm.car_brand_name.name
      cars_info.car_model_name = this.ruleForm.car_model_name.name
      cars_info.car_model_id = this.ruleForm.car_model_name.id
      cars_info.order_type = this.ruleForm.order_type.id
      params.cars_info = cars_info
      this.$refs[el].validate((valid) => {
        if (valid) {
          alterOrder(params).then((res) => {
            console.log('提交', res)
          })
        } else {
          console.log('错误提交!!')
          return false
        }
      })
      console.log(params, 'params')
    }
  },
  components: {},
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
