<template>
  <div class="create-order-page">
    <div class="flex-between page-title">
      <div class="">创建订单</div>
      <el-button ype="primary" @click="">返回</el-button>
    </div>
    <div class="page-content">
      <el-form ref="form" :model="ruleForm" :rules="rules" label-width="100px" label-position="right">
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
              <el-select v-model="ruleForm.type_of_business" placeholder="请选择业务类型" style="width:100%">
                <el-option v-for="(item,index) in option"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"
                />
              </el-select>
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
            <!--            发货人-->
            <el-col :lg="12" :md="12" :sm="24">
              <div class="column-name">发货方信息</div>
              <el-row>
                <el-col class="column-col" :lg="12" :md="12" :sm="12">
                  <el-form-item label="托运人"
                                prop="consignor_info.id"
                                :rules="[
                                {required: true, message: '请输入邮箱地址', trigger: 'blur'}
                                ]"
                  >
                    <el-autocomplete
                      style="width: 100%"
                      class="inline-input"
                      v-model="ruleForm.consignor_info.id"
                      :fetch-suggestions="()=>{}"
                      placeholder="请输入内容"
                      :trigger-on-focus="false"
                      @select="handleSelect"
                    ></el-autocomplete>
                  </el-form-item>
                </el-col>
                <el-col class="column-col" :lg="12" :md="12" :sm="12">
                  <el-form-item label="托运人电话" prop="consignee_mobile">
                    <el-input v-model="ruleForm.consignee_mobile"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col class="column-col" :lg="12" :md="12" :sm="12">
                  <el-form-item label="发站归属地" prop="start_attribution">
                    <div style="width: 100%;display: flex">
                      <el-select v-model="ruleForm.start_attribution" placeholder="发站归属地" style="width: 100%">
                        <el-option
                          v-for="item in option"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </div>
                  </el-form-item>
                </el-col>
                <el-col class="column-col" :lg="12" :md="12" :sm="12">
                  <el-form-item label="发站省/市" prop="value">
                    <div style="width: 100%;display: flex">
                      <el-select v-model="ruleForm.start_pid_info.value" placeholder="请选择" style="width:50%">
                        <el-option
                          v-for="(item,index) in option"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                      <el-select v-model="ruleForm.start_cid_info.value" placeholder="请选择" style="width: 50%">
                        <el-option
                          v-for="item in option"
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
                  <el-form-item label="提车费">
                    <el-input v-model="ruleForm.delivery_money"/>
                  </el-form-item>
                </el-col>
                <el-col class="column-col" :lg="12" :md="12" :sm="12">
                  <el-form-item label="提车司机" prop="value">
                    <div style="width: 100%;display: flex">
                      <el-select v-model="ruleForm.carry_car_info.value" placeholder="请选择" style="width:50%">
                        <el-option
                          v-for="item in option"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                      <el-select v-model="ruleForm.carry_car_info.name" placeholder="请选择" style="width: 50%">
                        <el-option
                          v-for="item in option"
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
                      <el-select v-model="ruleForm.end_attribution" placeholder="到站归属地" style="width: 100%">
                        <el-option
                          v-for="item in option"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </div>
                  </el-form-item>
                </el-col>
                <el-col class="column-col" :lg="12" :md="12" :sm="12">
                  <el-form-item label="到站省/市" prop="value">
                    <div style="width: 100%;display: flex">
                      <el-select v-model="ruleForm.end_pid_info.value" placeholder="请选择省" style="width:50%">
                        <el-option
                          v-for="item in option"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                      <el-select v-model="ruleForm.end_cid_info.value" placeholder="请选择市" style="width: 50%">
                        <el-option
                          v-for="item in option"
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
                  <el-form-item label="送车费">
                    <el-input v-model="ruleForm.send_money"/>
                  </el-form-item>
                </el-col>
                <el-col class="column-col" :lg="12" :md="12" :sm="12">
                  <el-form-item label="送车司机">
                    <div style="width: 100%;display: flex">
                      <el-select v-model="ruleForm.send_car_info.value" placeholder="请选择" style="width:50%" size="mini">
                        <el-option
                          v-for="item in option"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                      <el-select v-model="ruleForm.send_car_info.value" placeholder="请选择" style="width: 50%"
                                 size="mini">
                        <el-option
                          v-for="item in option"
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
                <el-form-item label="车辆名称" prop="name">
                  <div style="width: 100%;display: flex">
                    <el-select v-model="listQuery.limit+'条/每页'" placeholder="10条/页" size="mini">
                      <el-option
                        v-for="item in option"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                    <el-select v-model="listQuery.limit+'条/每页'" placeholder="10条/页" size="mini">
                      <el-option
                        v-for="item in option"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
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
                  <el-input v-model="item.system_price" disabled/>
                </el-form-item>
              </el-col>
              <el-col class="column-col" :lg="6" :md="12" :sm="12">
                <el-form-item label="接单单价" prop="name">
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
                  <el-input v-model="item.order_type"/>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
        <!--        支付-->
        <div class="column">
          <div class="column-name">支付方式</div>
          <el-row>
            <el-col class="column-col" :lg="6" :md="12" :sm="12">
              <el-form-item label="付款方式">
                <el-input v-model="ruleForm.payment_method"/>
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
                <el-select v-model="ruleForm.has_receipt.value" placeholder="请选择回单" style="width:100%">
                  <el-option
                    v-for="(item,index) in option"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
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
import { OrderMsg, order, orderIndex, getOrderInfo } from '../../../../api/businessOrder/order'

const option = [{
  value: '10',
  label: '10条/页'
}, {
  value: '20',
  label: '30条/页'
}, {
  value: '50',
  label: '50条/页'
}, {
  value: '100',
  label: '100条/页'
}]
export default {
  data() {
    return {
      ruleForm: {},
      rules: {
        // name: [
        //   { required: true, message: '请输入活动名称', trigger: 'blur' },
        //   { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        // ],
        id: [
          { type: 'date', required: true, message: '收货人', trigger: 'change' }
        ],
        consignee_mobile: [
          { required: true, message: '请填入发货人电话', trigger: 'change' }
        ],
        start_attribution: [
          { type: 'date', required: true, message: '发展归属地', trigger: 'change' }
        ]
        // type: [
        //   { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
        // ],
        // resource: [
        //   { required: true, message: '请选择活动资源', trigger: 'change' }
        // ],
        // desc: [
        //   { required: true, message: '请填写活动形式', trigger: 'blur' }
        // ]
      },//规则
      totalPrice: null,//总合计
      totalIn: null,//总提成
      dynamicValidateForm: { domains: [] },
      listQuery: { limit: '' },
      value: '',
      option: option
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      let headerParams = {
        operator: 'thisyang', //经办人姓名
        operator_id: 1,  //经办人ID
        order_num: 'DH201906100042343',  //订单号
        create_time: '2019-06-10 22:58',  //创建时间
        pay_method: {
          name: '月结',
          value: '3'
        },
        has_receipt: {
          name: '无回单',
          value: '2'
        }
      }
      let formParams = {
        name: 'asd',
        type_of_business: '',// 详情
        consignor_info: { // 托运人
          id: '',
          name: ''
        },
        consignor_mobile: '',//托运人电话,
        start_attribution: '',//	发站归属地
        delivery_money: '',//提车费
        carry_car_detail_address: '',//提车详细地址
        carry_car_info: { id: 1267, name: '', company: '' },// 提车司机
        send_car_info: {},// 送车司机
        send_car_detail_address: '',
        deliver_goods_remark: '',
        carry_car_remark: '',
        consignee: '',//收货人
        consignee_mobile: '',
        end_attribution: '',// 到站归属地
        start_pid_info: {},//发站省id
        start_cid_info: {},//发站省id
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
        payment_method: 0,
        has_receipt: 0,//是否回单
        consignor_company: '',//托运人公司名称
        is_short_order: null,//是否是临时订单
        remark: null,//
        send_money: null,
        pay_cash: null,//现付
        freight_collect: null,//到付
        monthly_statement: '',//月结
        ...headerParams
      }
      let data = Object.assign({}, headerParams, formParams)
      this.ruleForm = data
    },
    loadAll() {
      return [
        { 'value': '三全鲜食（北新泾店）', 'address': '长宁区新渔路144号' },
        { 'value': 'Hot honey 首尔炸鸡（仙霞路）', 'address': '上海市长宁区淞虹路661号' },
        { 'value': '新旺角茶餐厅', 'address': '上海市普陀区真北路988号创邑金沙谷6号楼113' },
        { 'value': '泷千家(天山西路店)', 'address': '天山西路438号' }
      ]
    },
    getFormMsg() {
      OrderMsg().then(() => {})
    },
    handleSelect() {},
    submitForm() {
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
    resetForm() {},
    handleChange() {
      return new Date().toLocaleDateString()
    }
  },
  components: {},
  props: {}
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
