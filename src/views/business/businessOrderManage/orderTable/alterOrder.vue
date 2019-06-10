<template>
  <div>
    <!-- selection="true" 出现多选-->
    <!-- row-click 行点击四事件-->
    <!-- @filter-change="getFilter" 搜索事件-->
    <!-- select-change 单/多选事件-->
    <table-components
      :table-data="tableData"
      :selection="true"
      :pagination="false"
      :row-click="onClickHandle"
      :page-config="pageData"
      :action-config="actionConfig"
      :column-config="columnData"
      @filter-change="getFilter"
      @select-change="getselect"
      @page-change="getpage"
    />
  </div>
</template>
<script>
import TableComponents from '../../components/dg-table'
import control from '../../../../utils/lib/customizemenu.vue'// 自定义按钮组
import searchText from '../../components/defFilter/searchText.vue'//传组件

import { searchdata, dofilter, cities, createTableDataByRandom } from './mock.js' // 用于模拟表数据的js
export default {
  name: 'tables',
  components: {
    TableComponents
  },
  props: {},
  data() {
    return {
      columnData: [],
      tableData: [],
      filters: 3,
      pageData: {
        pageNum: '',
        curPage: 1
      },
      propsCom: {
        text: searchText
      },
      select: true,
      pagination: true,
      onClickHandle(row) {
        alert('点击行')
      },
      actionConfig: {
        type: 'customize', // 分单个 :button  文字 textbtn  自定义customize
        label: '操作',
        width: 350,
        component: control,
        handlers: {
          firsth: (row) => { console.log('first', row) },
          second: (row) => { console.log('second', row) }
        }
      }
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    const res = createTableDataByRandom(587)
    this.tableData = res.data
    this.pagenum = res.pagenum
    this.pageData.pageNum = res.pagenum
    this.mapTableTh()
  },
  methods: {
    mapTableTh() {
      //初始化表格表头名称数据.根据业务来的,顺序必须一致
      let initTHData = [
        {
          name: '编号',//表头label
          isNeed: true,//是否需要搜索
          type: 'text',// 搜索类型
          width: '100'
        },
        {
          name: '年龄',
          isNeed: true,
          type: 'text',
          width: '100'
        },
        {
          name: '手机',
          isNeed: true,
          type: 'text',
          width: '100'
        },
        {
          name: '内容',
          isNeed: false,
          type: 'text',
          width: '200'
        },
        {
          name: '名字',
          isNeed: true,
          type: 'text',
          width: '100'
        },
        {
          name: '编号',
          isNeed: true,
          type: 'text'
        },
        {
          name: '日期',
          isNeed: true,
          type: 'text'
        }
      ]
      Object.keys(this.tableData[0]).forEach((item, i) => {
        // 栏目配置
        let defTableConfig = {
          prop: '', // 参数字段
          label: '', // 名字
          type: '', // 类型当前表头交互类型
          isNeed: true,// 是否需要搜索项
          thIndex: null,
          component: null,// 表格Td 内部组件可以传
          fixed: null, // 是否固定
          width: null, // 宽度
          'min-width': '80', // 最小宽度
          resizable: true, // 拖动改变列宽度(需要在 el-table 上设置 border 属性为真)
          'show-overflow-tooltip': false, // 内容过长隐藏
          align: 'center', // left/center/right内容对齐方式
          'header-align': 'center', // left/center/right 头对齐方式
          'label-class-name': '', // 当前列自定义class
          sortable: false, // 是否排序
          formatter: () => {}, // 排序用字段 v-bind绑定
          filters: [], // 绑定需要条件列表 数组
          'filter-method': () => {}, // 过滤方法 v-bind绑定
          'render-header': () => {}, // Label区域渲染  v-bind绑定
          filterConfig: {// 过滤组件
            label: null,// filter 组件的table,同表头一致
            type: null,//filter 组件的类型,同表头一致
            component: null,// 传入的组件,
            filterKey: 'uid',//字段对应表头字段
            placeholder: '输入姓名',
            comData: [],
            comProps: '',
            listInfo: {
              fetchData() {},
              callback: () => {}// 回调
            }
          }
        }
        defTableConfig.prop = item // 数据字段
        defTableConfig.thIndex = i
        defTableConfig.isNeed = initTHData[i].isNeed
        defTableConfig.label = defTableConfig.filterConfig.label = initTHData[i].name
        defTableConfig.type = defTableConfig.filterConfig.type = initTHData[i].type
        if (defTableConfig.type === 'text') {// 自定义 可传参
          defTableConfig.filterConfig.component = searchText
        }
        this.columnData.push(defTableConfig)
      })
      console.log(this.columnData, '表头数据')
    },
    // 删选项事件
    getFilter(val) {
      // console.log(val, '筛选')
      const allfilter = {
        filters: val,
        page: 1
      }
      this.filters = val
      const res = dofilter(allfilter)
      this.data = res.data
      this.pagenum = res.pagenum
    },
    //
    getselect(val) {
      console.log(val, '单选广播事件')
    },
    // 分页事件
    getpage(page) {
      this.curpage = page
      const allfilter = {
        filters: this.filters,
        page
      }
      const res = dofilter(allfilter)
      this.data = res.data
    }
  }
}
</script>
<style lang="scss" scoped>
  /*@import "../base/reset.css";*/

</style>
