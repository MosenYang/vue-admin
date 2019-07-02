<template>
  <div class="upload-container">
    <el-upload
      :data="dataObj"
      :multiple="false"
      :show-file-list="false"
      :on-change="change"
      :on-success="handleImageSuccess"
      :on-progress="handleProgress"
      class="image-uploader"
      drag
      action="https://api.thisyang.online/api/utils/upload_file">
      <i class="el-icon-upload"/>
      <div class="el-upload__text">
        将文件拖到此处，或<em>点击上传</em>
      </div>
    </el-upload>
    <div class="image-preview" v-for="(item,index) in fileList">
      <div v-show="fileList.length>=1" class="image-preview-wrapper">
        <img :src="item.url">
        <div class="image-preview-action flex-center">
          <i class="el-icon-delete" @click="rmImage"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { uploadPic } from '@/api/baseApi'

export default {
  name: 'SingleImageUpload',
  props: {
    value: {
      type: String,
      default: 'https://api.thisyang.online'
    }
  },
  data() {
    return {
      tempUrl: '',
      fileList: [{
        name: 'food.jpeg',
        url: 'https://ss0.baidu.com/73F1bjeh1BF3odCf/it/u=2108445255,2329478258&fm=85&s=7D74068F524736E6B8A51F3C03001058'
      }, {
        name: 'food2.jpeg',
        url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
      }],
      dataObj: { token: '', type: 1 }// 额外的参数
    }
  },
  computed: {
    imageUrl() {
      return this.value
    }
  },
  methods: {
    rmImage() {
      console.log('00', '查看')
      this.emitInput('')
    },
    change(file) {
      let param = {
        file: file,
        type: 1
      }
      uploadPic(param).then((res) => {
        if (res.code == 200) {
          alert('1')
        }
      })
      console.log('file1', file)
    },
    beforeUpload(file) {
      console.log('file2', file)
      // uploadPic().then((res)=>{})
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    handleImageSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      this.emitInput(this.tempUrl)
    },
    emitInput(val) {
      this.$emit('input', val)
    },
    handleProgress() {
      //上传中
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";

  .upload-container {
    width: 100%;
    position: relative;
    padding: 5px;
    @include clearfix;

    .image-uploader {
      width: 100%;
      float: left;
    }

    .image-preview {
      width: 100px;
      height: 100px;
      position: relative;
      border: 1px dashed #d9d9d9;
      float: left;
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

</style>
