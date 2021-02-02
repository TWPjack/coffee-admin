<template>
  <div id="album">
    <b-container>
      <b-row>
        <b-col cols="12">
          <h1 class="text-center">最新消息上傳</h1>
          <b-form @submit.prevent="onSubmit">
            <!--  -->
            <b-form-group label="最新消息說明"
                          label-for="input-1"
                          :state="newsDecriptionState"
                          description="最多200個字"
                          invalid-feedback="格式不符">
              <b-form-textarea id="input-1"
                               v-model="description"
                               type="text"
                               placeholder="請輸入最新消息內容..."
                               :state="newsDecriptionState">
              </b-form-textarea>
            </b-form-group>
            <img-inputer class="mx-auto"
                         v-model="image"
                         placeholder="請選擇圖片"
                         bottom-text="點擊或拖曳更換圖片"
                         :max-size="1024"
                         exceedSizeText="檔案大小不能超過"
                         accept="image/*">
            </img-inputer>
            <br />
            <br />
            <b-btn type="submit"
                   variant="success">送出</b-btn>
          </b-form>
        </b-col>
      </b-row>
      <hr />
      <b-row>
        <b-col cols="12"
               md="60"
               lg="3"
               v-for="(newsImage, idx) in news"
               :key="newsImage._id">
          <b-card>
            <b-card-img :src="newsImage.src"></b-card-img>
            <b-card-body>
              <b-btn v-if="news.edit"
                     variant="danger"
                     @click="cancel(newsImage)">取消</b-btn>
              <b-btn v-if="news.edit"
                     variant="success"
                     @click="save(newsImage)">保存</b-btn>
              <b-btn v-if="!news.edit"
                     variant="success"
                     @click="edit(newsImage)">編輯</b-btn>
              <b-btn v-if="!news.edit"
                     variant="danger"
                     @click="del(newsImage, idx)">刪除</b-btn>
              <hr />
              <b-form-textarea v-if="news.edit"
                               v-model="newsImage.model"></b-form-textarea>
              <b-card-text v-else
                           style="white-space: pre-wrap">{{ newsImage.title }}</b-card-text>
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'Album',
  data () {
    return {
      image: null,
      description: '',
      news: []
    }
  },
  computed: {
    newsDecriptionState () {
      if (this.description.length === 0) {
        return null
      } else if (this.description.length > 200) {
        return false
      } else {
        return true
      }
    },
    admin () {
      return this.$store.state.admin
    }
  },
  methods: {
    onSubmit () {
      if (this.image.size > 1024 * 1024) {
        this.$swal({
          icon: 'error',
          title: '錯誤',
          text: '圖片太大'
        })
      } else if (!this.image.type.includes('image')) {
        this.$swal({
          icon: 'error',
          title: '錯誤',
          text: '檔案格式錯誤'
        })
      } else {
        const fd = new FormData()
        fd.append('image', this.image)
        fd.append('description', this.description)

        this.axios.post(process.env.VUE_APP_API + '/albums/', fd)
          .then(res => {
            if (res.data.success) {
              // 將新增的圖片塞進相簿陣列
              res.data.result.src = process.env.VUE_APP_API + '/albums/file/' + res.data.result.file
              res.data.result.title = res.data.result.description
              res.data.result.edit = false
              res.data.result.model = res.data.result.description
              delete res.data.result.file
              delete res.data.result.description
              this.news.push(res.data.result)
              // 送出後清空表單
              this.image = null
              this.description = ''
            } else {
              this.$swal({
                icon: 'error',
                title: '錯誤',
                text: res.data.message
              })
            }
          })
          .catch(err => {
            this.$swal({
              icon: 'error',
              title: '錯誤',
              text: err.response.data.message
            })
          })
      }
    },
    cancel (image) {
      image.edit = false
      image.model = image.title
    },
    save (image) {
      this.axios.patch(process.env.VUE_APP_API + '/albums/' + image._id, { description: image.model })
        .then(res => {
          if (res.data.success) {
            image.edit = false
            image.title = image.model
          } else {
            this.$swal({
              icon: 'error',
              title: '錯誤',
              text: res.data.message
            })
          }
        })
        .catch(err => {
          this.$swal({
            icon: 'error',
            title: '錯誤',
            text: err.response.data.message
          })
        })
    },
    edit (image) {
      image.edit = true
      image.model = image.title
    },
    del (image, idx) {
      this.axios.delete(process.env.VUE_APP_API + '/albums/' + image._id)
        .then(res => {
          if (res.data.success) {
            this.news.splice(idx, 1)
          } else {
            this.$swal({
              icon: 'error',
              title: '錯誤',
              text: res.data.message
            })
          }
        })
        .catch(err => {
          this.$swal({
            icon: 'error',
            title: '錯誤',
            text: err.response.data.message
          })
        })
    }
  },
  mounted () {
    this.axios.get(process.env.VUE_APP_API + '/albums/admin/' + this.admin.id)
      .then(res => {
        if (res.data.success) {
          console.log(this.news)
          this.news = res.data.result.map(newsImage => {
            newsImage.src = process.env.VUE_APP_API + '/albums/file/' + newsImage.file
            newsImage.title = newsImage.description
            newsImage.edit = false
            newsImage.model = newsImage.description
            delete newsImage.file
            delete newsImage.description
            return newsImage
          })
        } else {
          this.$swal({
            icon: 'error',
            title: '錯誤',
            text: res.data.message
          })
        }
      })
      .catch(err => {
        this.$swal({
          icon: 'error',
          title: '錯誤',
          text: err.response.data.message
        })
      })
  }
}
</script>
