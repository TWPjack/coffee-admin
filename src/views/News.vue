<template>
  <div id="album">
    <b-container>
      <b-row>
        <b-col cols="12">
          <h1 class="text-center">最新消息上傳</h1>
          <b-form @submit.prevent="onSubmit">
            <!-- title -->
            <b-form-group label-for="input-title"
                          :state="titleState"
                          description="字不要太少"
                          invalid-feedback="格式不符">
              <b-form-input id="input-title"
                            v-model="title"
                            type="text"
                            placeholder="請輸入最新消息標題"
                            :state="titleState">
              </b-form-input>
            </b-form-group>
            <!-- description -->
            <b-form-group label="最新消息說明"
                          label-for="input-1"
                          :state="newsDecriptionState"
                          description="最多500個字"
                          invalid-feedback="格式不符">
              <b-form-textarea id="input-1"
                               v-model="description"
                               type="text"
                               placeholder="請輸入最新消息內容..."
                               :state="newsDecriptionState">
              </b-form-textarea>
            </b-form-group>
            <!-- file -->
            <img-inputer class="mx-auto"
                         v-model="newsImage"
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
        <b-col cols="6"
               v-for="(newsImage, idx) in newsArray"
               :key="newsImage._id">
          <b-card>
            <b-card-img :src="newsImage.src"></b-card-img>
            <b-card-body>
              <b-btn v-if="newsImage.edit"
                     variant="danger"
                     @click="cancel(newsImage)">取消</b-btn>
              <b-btn v-if="newsImage.edit"
                     variant="success"
                     @click="save(newsImage)">保存</b-btn>
              <b-btn v-if="!newsImage.edit"
                     variant="success"
                     @click="edit(newsImage)">編輯</b-btn>
              <b-btn v-if="!newsImage.edit"
                     variant="danger"
                     @click="del(newsImage, idx)">刪除</b-btn>
              <hr />
              <table>
                <tr>
                  <td>title</td>
                  <td>
                    <b-form-input v-if="newsImage.edit"
                                  v-model="newsImage.titleEdit"></b-form-input>
                    <b-card-text v-else>{{ newsImage.titlePresent }}</b-card-text>
                  </td>
                </tr>
                <tr>
                  <td>decription</td>
                  <td>
                    <b-form-textarea v-if="newsImage.edit"
                                     v-model="newsImage.descriptionEdit"></b-form-textarea>
                    <b-card-text v-else
                                 style="white-space: pre-wrap">{{ newsImage.descriptionPresent }}</b-card-text>
                  </td>
                </tr>
              </table>
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
      newsImage: null,
      title: '',
      description: '',
      newsArray: []
    }
  },
  computed: {
    newsTitleState () {
      if (this.title.length === 0) {
        return null
      } else if (this.title.length < 5) {
        return false
      } else {
        return true
      }
    },
    newsDecriptionState () {
      if (this.description.length === 0) {
        return null
      } else if (this.description.length > 500) {
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
      if (this.newsImage.size > 1024 * 1024) {
        this.$swal({
          icon: 'error',
          title: '錯誤',
          text: '圖片太大'
        })
      } else if (!this.newsImage.type.includes('image')) {
        this.$swal({
          icon: 'error',
          title: '錯誤',
          text: '檔案格式錯誤'
        })
      } else {
        const fd = new FormData()
        fd.append('image', this.newsImage)
        fd.append('title', this.title)
        fd.append('description', this.description)
        console.log(fd)
        this.axios.post(process.env.VUE_APP_API + '/news/', fd)
          .then(res => {
            if (res.data.success) {
              // 將新增的圖片塞進相簿陣列
              res.data.result.src = process.env.VUE_APP_API + '/news/file/' + res.data.result.file
              res.data.result.titlePresent = res.data.result.title
              res.data.result.descriptionPresent = res.data.result.description
              res.data.result.edit = false
              res.data.result.titleEdit = res.data.result.title
              res.data.result.descriptionEdit = res.data.result.description
              delete res.data.result.file
              delete res.data.result.title
              delete res.data.result.description
              this.newsArray.push(res.data.result)
              // 送出後清空表單
              this.newsImage = null
              this.title = ''
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
    cancel (newsImage) {
      newsImage.edit = false
      newsImage.titleEdit = newsImage.titlePresent
      newsImage.descriptionEdit = newsImage.descriptionPresent
    },
    save (newsImage) {
      this.axios.patch(process.env.VUE_APP_API + '/news/' + newsImage._id, {
        title: newsImage.titleEdit,
        description: newsImage.descriptionEdit
      })
        .then(res => {
          if (res.data.success) {
            newsImage.edit = false
            newsImage.titlePresent = newsImage.titleEdit
            newsImage.descriptionPresent = newsImage.descriptionEdit
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
    edit (newsImage) {
      newsImage.edit = true
      newsImage.titleEdit = newsImage.titlePresent
      newsImage.descriptionEdit = newsImage.descriptionPresent
    },
    del (newsImage, idx) {
      this.axios.delete(process.env.VUE_APP_API + '/news/' + newsImage._id)
        .then(res => {
          if (res.data.success) {
            this.newsArray.splice(idx, 1)
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
    this.axios.get(process.env.VUE_APP_API + '/news/admin/' + this.admin.id)
      .then(res => {
        if (res.data.success) {
          this.newsArray = res.data.result.map(newsImage => {
            newsImage.src = process.env.VUE_APP_API + '/news/file/' + newsImage.file
            newsImage.titlePresent = newsImage.title
            newsImage.descriptionPresent = newsImage.description
            newsImage.edit = false
            newsImage.titleEdit = newsImage.title
            newsImage.descriptionEdit = newsImage.description
            delete newsImage.file
            delete newsImage.title
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

<style scoped lang="scss">
</style>
