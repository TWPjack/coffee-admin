<template>
  <div id="products">
    <b-container>
      <b-row>
        <b-col cols="12">
          <h1 class="text-center">商品上下架</h1>
          <b-form @submit.prevent="onSubmit">
            <!-- productid -->
            <b-form-group label-for="input-productid"
                          :state="productidState"
                          description="商品id"
                          invalid-feedback="格式不符">
              <b-form-input id="input-productid"
                            v-model="productid"
                            type="number"
                            placeholder="請輸入商品ID"
                            :state="productidState">
              </b-form-input>
            </b-form-group>
            <!-- name -->
            <b-form-group label-for="input-name"
                          :state="nameState"
                          description="字不要太多"
                          invalid-feedback="格式不符">
              <b-form-input id="input-name"
                            v-model="name"
                            type="text"
                            placeholder="請輸入商品名稱"
                            :state="nameState">
              </b-form-input>
            </b-form-group>
            <!-- file -->
            <img-inputer class="mx-auto"
                         v-model="image"
                         placeholder="請選擇圖片"
                         bottom-text="點擊或拖曳更換圖片"
                         :max-size="1024"
                         exceedSizeText="檔案大小不能超過"
                         accept="image/*"></img-inputer>
            <!-- price -->
            <b-form-group label-for="input-price"
                          :state="priceState"
                          description="商品id"
                          invalid-feedback="格式不符">
              <b-form-input id="input-productid"
                            v-model="price"
                            type="number"
                            placeholder="請輸入商品價格"
                            :state="priceState">
              </b-form-input>
            </b-form-group>
            <!-- total -->
            <b-form-group label-for="input-total"
                          :state="totalState"
                          description="商品數量"
                          invalid-feedback="格式不符">
              <b-form-input id="input-total"
                            v-model="total"
                            type="number"
                            placeholder="請輸入商品數量"
                            :state="totalState">
              </b-form-input>
            </b-form-group>
            <!-- description -->
            <b-form-group label-for="input-description"
                          :state="descriptionState"
                          description="最多200個字"
                          invalid-feedback="格式不符">
              <b-form-textarea id="input-description"
                               v-model="description"
                               type="text"
                               placeholder="請輸入商品說明..."
                               :state="descriptionState">
              </b-form-textarea>
            </b-form-group>
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
               md="6"
               v-for="(product) in productsArray"
               :key="product._id">
          <b-card>
            <b-card-img :src="product.src"></b-card-img>
            <b-card-body>
              <b-btn v-if="product.edit"
                     variant="danger"
                     @click="cancel(product)">取消</b-btn>
              <b-btn v-if="product.edit"
                     variant="success"
                     @click="save(product)">保存</b-btn>
              <b-btn v-if="!product.edit"
                     variant="success"
                     @click="edit(product)">編輯</b-btn>
              <b-btn v-if="!product.edit"
                     variant="danger"
                     @click="del(product, idx)">刪除</b-btn>
              <hr />
              <table>
                <tr>
                  <td>productid</td>
                  <td>
                    <b-form-input v-if="product.edit"
                                  v-model="product.productidEdit"></b-form-input>
                    <div v-else>{{ product.productidPresent }}</div>
                  </td>
                </tr>
                <tr>
                  <td>name</td>
                  <td>
                    <b-form-input v-if="product.edit"
                                  v-model="product.nameEdit"></b-form-input>
                    <div v-else>{{ product.namePresent }}</div>
                  </td>
                </tr>
                <tr>
                  <td>price</td>
                  <td>
                    <b-form-input v-if="product.edit"
                                  v-model="product.priceEdit"></b-form-input>
                    <div v-else>{{ product.pricePresent }}</div>
                  </td>
                </tr>
                <tr>
                  <td>total</td>
                  <td>
                    <b-form-input v-if="product.edit"
                                  v-model="product.totalEdit"></b-form-input>
                    <div v-else>{{ product.totalPresent }}</div>
                  </td>
                </tr>
                <tr>
                  <td>description</td>
                  <td>
                    <b-form-input v-if="product.edit"
                                  v-model="product.descriptionEdit"></b-form-input>
                    <div v-else>{{ product.descriptionPresent }}</div>
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
  name: 'Products',
  data () {
    return {
      productid: null,
      name: '',
      image: null,
      price: null,
      total: null,
      description: '',
      productsArray: []
    }
  },
  computed: {
    productidState () {
      if (this.productid <= 0) {
        return false
      } else if (this.productid > 10) {
        return false
      } else {
        return true
      }
    },
    nameState () {
      if (this.name.length === 0) {
        return null
      } else if (this.name.length > 20) {
        return false
      } else {
        return true
      }
    },
    priceState () {
      if (this.price <= 0) {
        return false
      } else {
        return true
      }
    },
    totalState () {
      if (this.total <= 0) {
        return false
      } else {
        return true
      }
    },
    descriptionState () {
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
        fd.append('productid', this.productid)
        fd.append('name', this.name)
        fd.append('image', this.image)
        fd.append('price', this.price)
        fd.append('total', this.total)
        fd.append('description', this.description)

        this.axios.post(process.env.VUE_APP_API + '/products/', fd)
          .then(res => {
            if (res.data.success) {
              // 將新增的圖片塞進相簿陣列
              res.data.result.src = process.env.VUE_APP_API + '/products/file/' + res.data.result.file
              res.data.result.productidPresent = res.data.result.productid
              res.data.result.namePresent = res.data.result.name
              res.data.result.pricePresent = res.data.result.price
              res.data.result.totalPresent = res.data.result.total
              res.data.result.descriptionPresent = res.data.result.description
              res.data.result.edit = false
              res.data.result.productidEdit = res.data.result.productid
              res.data.result.nameEdit = res.data.result.name
              res.data.result.priceEdit = res.data.result.price
              res.data.result.totalEdit = res.data.result.total
              res.data.result.descriptionEdit = res.data.result.description
              delete res.data.result.file
              delete res.data.result.productid
              delete res.data.result.name
              delete res.data.result.price
              delete res.data.result.total
              delete res.data.result.description
              this.productsArray.push(res.data.result)
              // 送出後清空表單
              this.productid = null
              this.name = ''
              this.image = null
              this.price = null
              this.total = null
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
    cancel (product) {
      product.edit = false
      product.productidEdit = product.productidPresent
      product.nameEdit = product.namePresent
      product.priceEdit = product.pricePresent
      product.totalEdit = product.totalPresent
      product.descriptionEdit = product.descriptionPresent
    },
    save (product) {
      this.axios.patch(process.env.VUE_APP_API + '/products/' + product._id,
        {
          productid: product.productidEdit,
          name: product.nameEdit,
          price: product.priceEdit,
          total: product.totalEdit,
          description: product.descriptionEdit
        })
        .then(res => {
          if (res.data.success) {
            product.edit = false
            product.productidPresent = product.productidEdit
            product.namePresent = product.nameEdit
            product.pricePresent = product.priceEdit
            product.totalPresent = product.totalEdit
            product.descriptionPresent = product.descriptionEdit
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
    edit (product) {
      product.edit = true
      product.productidEdit = product.productidPresent
      product.nameEdit = product.namePresent
      product.priceEdit = product.pricePresent
      product.totalEdit = product.totalPresent
      product.descriptionEdit = product.descriptionPresent
    },
    del (product, idx) {
      this.axios.delete(process.env.VUE_APP_API + '/products/' + product._id)
        .then(res => {
          if (res.data.success) {
            this.productsArray.splice(idx, 1)
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
    this.axios.get(process.env.VUE_APP_API + '/products/admin/' + this.admin.id)
      .then(res => {
        if (res.data.success) {
          this.productsArray = res.data.result.map(product => {
            product.src = process.env.VUE_APP_API + '/products/file/' + product.file
            product.productidPresent = product.productid
            product.namePresent = product.name
            product.pricePresent = product.price
            product.totalPresent = product.total
            product.descriptionPresent = product.description
            product.edit = false
            product.productidEdit = product.productid
            product.nameEdit = product.name
            product.priceEdit = product.price
            product.totalEdit = product.total
            product.descriptionEdit = product.description
            delete product.file
            delete product.productid
            delete product.name
            delete product.price
            delete product.total
            delete product.description
            return product
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
