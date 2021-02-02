<template>
  <div id="products">
    <b-container>
      <b-row>
        <b-col cols="12">
          <h1 class="text-center">訂單處理</h1>
          <b-table striped
                   hover
                   :items="orders"
                   :fields="ordersFields">
            <template #cell(cargoState)="order">
              {{ order.item.cargoState }}
              <b-button variant="danger"
                        @click="ordChange(order),$bvModal.show('modal-scoped1')">
                訂單修改
              </b-button>
            </template>
            <template #cell(productsDetail)="productsDetail">
              <b-button variant="danger"
                        @click="proD(productsDetail),$bvModal.show('modal-scoped2')">
                商品詳情
              </b-button>
            </template>
            <template #cell(action)="order">
              <b-button variant="danger"
                        @click="delOrder(order)">
                <font-awesome-icon :icon="['fas', 'trash']">刪除</font-awesome-icon>
              </b-button>
            </template>
          </b-table>
        </b-col>
        <b-modal id="modal-scoped1">
          <template #default="">
            <b-form-group label="修改訂單"
                          v-slot="{ ariaDescribedby }">
              <b-form-radio v-model="orderStateSelected"
                            :aria-describedby="ariaDescribedby"
                            name="some-radios"
                            value="訂單已送出">訂單已送出</b-form-radio>
              <b-form-radio v-model="orderStateSelected"
                            :aria-describedby="ariaDescribedby"
                            name="some-radios"
                            value="訂單處理中">訂單處理中</b-form-radio>
              <b-form-radio v-model="orderStateSelected"
                            :aria-describedby="ariaDescribedby"
                            name="some-radios"
                            value="訂單已完成">訂單已完成</b-form-radio>
            </b-form-group>

            <div class="mt-3">訂單狀態: <strong>{{ orderStateSelected }}</strong></div>
          </template>
          <template #modal-footer="{ ok}">
            <b-button size="sm"
                      variant="success"
                      @click="ok(),changeState()">
              確認修改
            </b-button>
          </template>
        </b-modal>
        <b-modal id="modal-scoped2">
          <template #default="">
            <b-table striped
                     hover
                     :items="orders[whichOrder].productsDetail"
                     :fields="cartFields">
              <template #cell(file)="productsDetail">
                <img :src="productsDetail.item.file"
                     style="width: 50px" />
              </template>
              <template #cell(allprice)="productsDetail">
                <p>{{ productsDetail.item.price *  productsDetail.item.count}}</p>
              </template>
            </b-table>
          </template>
          <template #modal-footer="{ ok}">
            <p>總價格：{{ orders[whichOrder].allProductsPrice }}</p>
            <b-button size="sm"
                      variant="success"
                      @click="ok()">
              OK
            </b-button>
          </template>
        </b-modal>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'orders',
  data () {
    return {
      ordersFields: [
        {
          key: 'user',
          label: '帳號'
        },
        {
          key: 'name',
          label: '姓名'
        },
        {
          key: 'paymentMethod',
          label: '付款方式'
        },
        {
          key: 'deliveryMethod',
          label: '運送方式'
        },
        {
          key: 'phone',
          label: '電話'
        },
        {
          key: 'address',
          label: '地址'
        },
        {
          key: 'date',
          label: '訂購日期'
        },
        {
          key: 'allProductsAmount',
          label: '總數量'
        },
        {
          key: 'allProductsPrice',
          label: '總價格'
        },
        {
          key: 'cargoState',
          label: '訂單狀態'
        },
        {
          key: 'productsDetail',
          label: '商品詳情'
        },
        {
          key: 'action',
          label: '刪除'
        }
      ],
      cartFields: [
        {
          key: 'file',
          label: '圖片'
        },
        {
          key: 'name',
          label: '品名'
        },
        {
          key: 'price',
          label: '價格'
        },
        {
          key: 'count',
          label: '數量'
        },
        {
          key: 'allprice',
          label: '合計'
        }
      ],
      orders: [],
      whichOrder: null,
      whichOrder1: null,
      orderStateSelected: ''
    }
  },
  methods: {
    ordChange (order, hhh) {
      this.whichOrder1 = order.index
      this.orderStateSelected = this.orders[this.whichOrder1].cargoState
    },
    proD (productsDetail) {
      this.whichOrder = productsDetail.index
    },
    delOrder (order) {
      this.axios.delete(process.env.VUE_APP_API + '/orders/admindel/' + order.item._id)
        .then(res => {
          if (res.data.success) {
            this.orders.splice(order.index, 1)
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
    changeState (index, ccc) {
      ccc = this.orderStateSelected
      index = this.whichOrder1
      console.log(this.orders[index]._id)
      this.axios.patch(process.env.VUE_APP_API + '/orders/adminedit/' + this.orders[index]._id,
        {
          cargoState: ccc
        })
        .then(res => {
          if (res.data.success) {
            this.orders[index].cargoState = ccc
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
    this.axios.get(process.env.VUE_APP_API + '/orders/adminpresent')
      .then(res => {
        if (res.data.success) {
          if (res.data.result.length === 0) {
            this.orderState = true
          } else if (res.data.result.length !== 0) {
            this.orderState = false
            for (let i = 0; i < res.data.result.length; i++) {
              this.orders.push(
                {
                  _id: res.data.result[i]._id,
                  user: res.data.result[i].user,
                  name: res.data.result[i].name,
                  paymentMethod: res.data.result[i].paymentMethod,
                  deliveryMethod: res.data.result[i].deliveryMethod,
                  phone: res.data.result[i].phone,
                  address: res.data.result[i].address,
                  date: res.data.result[i].date,
                  allProductsAmount: res.data.result[i].allProductsAmount,
                  allProductsPrice: res.data.result[i].allProductsPrice,
                  productsDetail: res.data.result[i].productsDetail,
                  cargoState: res.data.result[i].cargoState
                }
              )
            }
          }
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
