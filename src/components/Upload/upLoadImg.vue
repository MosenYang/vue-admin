<template>
  <div class="avatar">
    <!-- 内容 -->
    <div class="file-btn-wrap flex-center">
      <div class="btn-wrap flex-center">
        <!--        <div class="a-btn flex-center" style="width: 100%;height: 100%">添加文件</div>-->
        <input type="file" class="input-file"
               style="width: 100%;height: 100%"
               name="avatar"
               ref="avatarInput"
               @change="changeImage($event)"
               accept="image/gif,image/jpeg,image/jpg,image/png">
      </div>
    </div>
    <!-- 缩略图-->
    <div class="image-wrap flex">
      <div class="image-preview" v-for="(item,index) in fileList">
        <div v-show="fileList.length>=1" class="image-preview-wrapper">
          <img :src="item.url?item.url:avatar"
               :style="`width:${imgWidth};height: ${imgHeight};`"
               name="avatar">
          <div class="image-preview-action flex-center">
            <i class="el-icon-delete" @click="rmImage"/>
          </div>
        </div>
      </div>
      <div class="image-preview">
        <div class="image-preview-wrapper">
          <div class=" action flex-center">
            <el-button type="primary" @click="upload" size="mini">确定上传</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { uploadPic } from '../../api/baseApi'

export default {
  name: 'upload',
  data() {
    return {
      avatar: '',
      type: '',
      file: '',
      url: 'https://api.thisyang.online',
      fileList: [{
        name: 'food.jpeg',
        url: 'https://ss0.baidu.com/73F1bjeh1BF3odCf/it/u=2108445255,2329478258&fm=85&s=7D74068F524736E6B8A51F3C03001058'
      }]
    }
  },
  props: {
    uploadType: {
      type: Number,
      default: 1
    },
    imgUrl: {
      type: String,
      default: ''
    },
    imgWidth: {
      type: String,
      default: '100px'
    },
    imgHeight: {
      type: String,
      default: '100px'
    }
  },
  created() {
    this.avatar = this.imgUrl
    this.type = this.uploadType
  },
  methods: {
    changeImage: function(e) {
      let file = e.target.files[0]
      if (file) {
        this.file = file
        console.log(this.file)
        let reader = new FileReader()
        let that = this
        reader.readAsDataURL(file)
        reader.onload = function(e) {
          // 这里的this 指向reader
          that.avatar = this.result
        }
      }
    },
    upload: function() {
      let files = this.$refs.avatarInput.files
      let fileData = {}
      if (files instanceof Array) {
        fileData = files[0]
      } else {
        fileData = this.file
      }
      let data = new FormData()
      data.append('file', fileData)
      data.append('type', this.type)
      uploadPic(data).then((res) => {
        if (res.code == 200) {
          this.fileList.push({
            name: '',
            url: this.url + res.data.file_path
          })
        }
      })
    },
    rmImage() {}
  }
}
</script>
<style lang="scss" scope>
  @import "src/styles/mixin.scss";

  .avatar {
    cursor: pointer;
    position: relative;
    /*border: 1px solid red;*/
    width: 100%;
    height: j(300);
    background: #f4f4f4;
    box-shadow: 3px 5px 15px #f9f9f9;
    border-radius: 10px;

    .file-btn-wrap {
      padding: j(20);

      .btn-wrap {
        border: 1px dashed rgba(138, 138, 138, 0.71);
        position: relative;
        border-radius: 10px;
        width: 200px;
        height: 100px;

        .input-file {
          width: 100%;
          margin-top: 40%;
          margin-left: j(10);
          text-align: center;
        }

        .a-btn {
          position: absolute;
        }
      }
    }

    .image-wrap {
      padding: 0 j(10);

      .image-preview {
        width: 100px;
        height: 100px;
        position: relative;
        margin-right: j(10);

        .image-preview-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          margin-right: 10px;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .action {
          opacity: 1;
          position: absolute;
          width: 100%;
          height: 100%;
          left: 0;
          top: 0;
          color: #fff;
          font-size: 20px;
          background-color: rgba(0, 0, 0, .5);
          transition: opacity .3s;
          cursor: pointer;
        }

        .image-preview-action {
          position: absolute;
          width: 100%;
          height: 100%;
          left: 0;
          top: 0;
          color: #fff;
          opacity: 0;
          font-size: 20px;
          background-color: rgba(0, 0, 0, .5);
          transition: opacity .3s;
          cursor: pointer;

          .el-icon-delete {
            font-size: 36px;
          }
        }

        &:hover {
          .image-preview-action {
            opacity: 1;
          }
        }
      }
    }
  }
</style>
