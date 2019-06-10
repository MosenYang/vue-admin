<template>
  <div style="padding:10px">
    <div>
      <el-autocomplete
        v-model="chooseData"
        popper-class="my-autocomplete"
        :fetch-suggestions="querySearchAsync"
        :placeholder="placeholder"
        clearable="true"
        @select="handleSelect">
        <template slot-scope="{ item }">
          <div class="name">678678678{{ item[showkey] }}</div>
        </template>
      </el-autocomplete>
    </div>
  </div>
</template>
<!--暂时不改,根据业务-->
<script>
export default {
  name:'search',
  props: {
    filterKey: {
      type: String,
      default: ''
    },
    listInfo: {
      type: Object,
      default: function() {
        return {
          handler: null,
          showkey: '',
          searchkey: ''
        }
      }
    },
    placeholder: {
      type: String,
      default: '请选择内容'
    },
    ftn: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      chooseData: '',
      showkey: 'name'
    }
  },
  mounted() {
    this.showkey = this.listInfo.showkey ? this.listInfo.showkey : 'name'
  },
  methods: {
    querySearchAsync(queryString, cb) {
      if (queryString) {
        if (typeof this.listInfo.handler === 'function') {
          var _searchkey = {}
          if (!this.listInfo.searchkey) return
          _searchkey[this.listInfo.searchkey] = queryString
          this.listInfo.handler(_searchkey).then(res => {
            var showlist = res
            if (Array.isArray(showlist)) {
              if (showlist.length === 0) showlist = [{ [this.showkey]: '暂无数据' }]
              cb(showlist)
            }
          })
        }
      } else {
        var t = []
        cb(t)
      }
    },
    handleSelect(item) {
      this.$emit('getFilterBridge', {
        key: this.filterkey,
        label: item[this.showkey],
        value: item[this.filterkey],
        ftn: this.ftn
      })
    }
  }
}
</script>

<style scoped>
  @import './css/common.css';

  .my-autocomplete .li {
    line-height: normal;
    padding: 7px;
  }

  .editFilter {
    position: absolute;
    width: 300px;
  }

  .my-autocomplete .li .name {
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .my-autocomplete .li .addr {
    font-size: 12px;
    color: #b4b4b4;
  }

  .my-autocomplete .li .highlighted .addr {
    color: #ddd;
  }
</style>
