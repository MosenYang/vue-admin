<template>
  <div class="page">
    <div class="page-title flex-between">
      <span>客户信息</span>
      <el-button v-waves type="primary">
        添加客户
      </el-button>
    </div>
    <div class="totalTable-container">
      <div class="flex-between control">
        <div class="limit">
          当前显示:
          <el-select v-model="defParams.pagesize"
                     @change="changePage" placeholder="请选择">
            <el-option v-for="item in option"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value"
            />
          </el-select>
        </div>
        <div class="filters-btns">
          <div class="inquire-wrap">
            <span>查询:</span>
            <el-input
              v-model="defParams.query"
              placeholder="请写查询内容"
              style="width: 200px;"
              class="filter-item"
              @keyup.enter.native="handleSearch"
            />
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-search"
            >
              查询
            </el-button>
          </div>
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search"
          >
            重置
          </el-button>
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search"
          >
            导出
          </el-button>
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search"
          >
            导入
          </el-button>
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search"
          >
            修改维护人
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ChildComponents from '../components/Tables/dg-table'
export default {
  components: {},
  props: {},
  data() {
    return {
      defParams: defParams,
      option: option
    }
  },
  computed: {
    fullName() {

    }
  },
  watch: {},
  created() {
  },
  mounted() {

  },
  methods: {
    handleSearch() {

    },
    changePage() {}
  }
}
let initThData = [
  {
    name: '业务类型',
    key: 'business'
  },
  {
    name: '经营范围',
    key: 'business_scope'
  },
  {
    name: '公司名称',
    key: 'company'
  },
  {
    name: '省份',
    key: 'province_name'
  },
  {
    name: '公司地址',
    key: 'address'
  },
  {
    name: '职务',
    key: 'position'
  },
  {
    name: '姓名',
    key: 'username'
  },
  {
    name: '性别',
    key: 'sex'
  },
  {
    name: '手机号',
    key: 'mobile'
  },
  {
    name: '订单数量',
    key: 'order_num'
  },
  {
    name: '客户类型',
    key: 'type'
  },
  {
    name: '是否审核',
    key: 'audit_status'
  },
  {
    name: '审核人',
    key: 'audit_username'
  },
  {
    name: '创建人',
    key: 'create_username'
  },
  {
    name: '维护人',
    key: 'accendant'
  },
  {
    name: '最后操作时间',
    key: 'updated_at'
  }
]
var defParams = {
  business: '',// 业务类型
  business_scope: '',// 经营范围
  audit_username: '',//昵称
  audit_status: '',//0未审核，1已审核
  company: '',//公司名称
  address: '',//公司地址
  position: '',//职位
  sex: '',//性别
  province: '',//省Id
  mobile: '',//客户手机
  wechat: '',//w微信
  qq: '',// qq
  id_card: '',// 身份证
  telephone: '',//客户固定电话
  fax_number: '',// 传真号
  type: '',//客户类型
  create_user: '',// 创建人姓名
  accendant: '',//业务
  updated_at_from: '',//开始时间
  updated_at_to: '',//结束时间
  order_num: '',//关联数量
  query: '',// 搜索字段
  start: 1,
  length: 10// 条数
}
var option = [
  {
    value: '10',
    label: '10条/页'
  }, {
    value: '30',
    label: '30条/页'
  }, {
    value: '50',
    label: '50条/页'
  }, {
    value: '100',
    label: '100条/页'
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
    font-weight: 400;
  }

  .totalTable-container {
    padding: 0 j(20);

    .el-button {
      @extend %cyan-btn
    }

    .control {
      font-size: j(20);

      .limit {
        font-size: j(12);
        padding-left: j(15);
      }

      .filters-btns {
        @extend %end;
        color: #262626;
        padding: j(15) 0;
        font-size: j(16);

        .inquire-wrap {
          margin-right: j(10);
        }
      }
    }


  }
</style>
