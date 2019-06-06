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
      :page-config="{ pagenum:pagenum, curpage: curpage }"
      :filter-init="[]"
      :action-config="actionConfig"
      :column-config="config"
      @filter-change="getFilter"
      @select-change="getselect"
      @page-change="getpage"
    />
  </div>
</template>
<script>
import TableComponents from '../../../../utils/lib/dg-table'
import cc from '../../../../utils/lib/columcomponent.vue' // 判断男女
import CF from '../../../../utils/lib/customizefilter.vue'// 自定义删选
import CM from '../../../../utils/lib/customizemenu.vue'// 自定义按钮组
import { searchdata, dofilter, cities, createTableDataByRandom } from './mock.js' // 用于模拟表数据的js
export default {
  components: {
    TableComponents
  },
  props: {},
  data() {
    return {
      columnData: [],
      tableData: [],
      filters: 3,
      pagenum: 1,
      curpage: 1,
      select: true,
      pagination: true,
      onClickHandle(row) {
        alert('点击行')
      },
      // 按钮点击 操作栏数据
      actionConfig: {
        type: 'customize', // 分单个 :button  文字 textbtn  自定义customize
        label: '操作',
        width: '180',
        component: CM, // 自定义customize传改值也要传 自定义的需要传的组件
        handlers: {
          firsth: (row) => { console.log('first', row) },
          second: (row) => { console.log('second', row) }
        }
      },
      config: [{
        prop: 'name',
        label: '姓名',
        width: '80',
        filterConfig: {// 各自的筛选器的选项
          ftn: '姓名',
          type: 'text',
          filterKey: 'uid',
          placeholder: '输入姓名',
          listInfo: {
            handler: searchdata, // 这是筛选函数
            searchkey: 'name', // 用于搜索api对应的key
            showkey: 'name' // 在列表中要显示的字段
          }
        }
      }, {
        prop: 'gender',
        label: '性别',
        component: cc, // 传的组件
        width: '80',
        filterConfig: {// 过滤组件的配置
          ftn: '性别',
          type: 'radio',
          filterKey: 'gender',
          listInfo: {
            labelkey: 'label',
            valuekey: 'value'
          },
          dataItems: [
            { label: '男', value: 1 },
            { label: '女', value: 2 }
          ]
        }
      }, {
        // component 和  processdata 和 style 应该都在同级
        prop: 'birthPlace',
        label: '出生地',
        // processdata 传值 time time2 或者Fn
        processCallback: (row, prop) => {
          // row返回整行数据 便于 处理一些依赖其他列的数据
          var space = ''
          if (!row.birthPlace) return '-'
          var curobj = row.birthPlace
          if (curobj) {
            space += curobj.name
            curobj = curobj.child
          }
          // while (1) {
          //   if (curobj) {
          //     space += curobj.name
          //     curobj = curobj.child
          //   } else {
          //     break
          //   }
          // }
          return space
        }, // 数据的处理 默认提供一些 也可以自定义处理数据的函数
        filterConfig: {
          ftn: '出生地',
          filterKey: 'birthPlace',
          type: 'cascader',
          hideBg: true,
          cProps: {
            value: 'code',
            label: 'name',
            children: 'children'
          },
          dataItems: cities()
        }
      }, {
        prop: 'birthDay',
        label: '出生日期',
        processdata: 'time', // 应该是格式化了
        filterConfig: {
          ftn: '生日',
          hideBg: true,
          type: 'date',
          filterKey: 'birthDay'
        }

      }, {
        prop: 'phone',
        label: '手机号',
        filterConfig: {
          ftn: '手机',
          type: 'edit',
          filterKey: 'phone'
        }
      }, {
        prop: 'age',
        label: '年龄',
        filterConfig: {
          ftn: '年龄',
          type: 'range',
          filterKey: 'age',
          unit: '岁'
        }
      }, {
        prop: 'age3',
        label: '自定义筛选',
        filterConfig: {
          ftn: '自定义筛选',
          type: 'customize',
          component: CF,
          filterKey: 'age',
          userSetData: { label: '我是用户自定义的数据', value: 'balabalabala' }
        }
      }
      ]
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    const res = createTableDataByRandom(587)
    console.log('', res)
    this.tableData = res.data
    this.pagenum = res.pagenum
  },
  methods: {
    mapHeader() {
      const names = ['日期', '名字', '省市', '区', '地址', '邮编'] // 栏目名称
      Object.keys(this.tableData[0]).forEach((item, i) => {
        // 栏目配置
        const defConfig = {
          prop: '', // 参数字段
          label: '', // 名字
          type: '', // 类型
          fixed: false, // 是否固定
          width: '120', // 宽度
          'min-width': '80', // 最小宽度
          resizable: true, // 拖动改变列宽度(需要在 el-table 上设置 border 属性为真)
          'show-overflow-tooltip': false, // 内容过长隐藏
          align: 'center', // left/center/right内容对齐方式
          'header-align': 'center', // left/center/right 头对齐方式
          'label-class-name': '', // 当前列自定义class
          sortable: false, // 是否排序
          formatter: 'fun', // 排序用字段 v-bind绑定
          filters: '[array]', // 绑定需要条件列表 数组
          'filter-method': 'fun', // 过滤方法 v-bind绑定
          'render-header': 'fun', // Label区域渲染  v-bind绑定
          filterConfig: {// 接
            ftn: '姓名',
            type: 'search',
            filterKey: 'uid',
            placeholder: '输入姓名',
            component: 'search',
            listinfo: {
              handler: searchdata,
              searchkey: 'name', // 用于搜索api对应的key
              showkey: 'name' // 在列表中要显示的字段
            }
          }
        }
        const comConfig = {}
        console.log(comConfig)
        // component 配置
        defConfig.prop = item
        defConfig.label = names[i]
        this.columnData.push(defConfig)
      })
    },
    // 删选项事件
    getFilter(val) {
      console.log(val, '筛选')
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
