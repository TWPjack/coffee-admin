<template>
  <div id="reg">
    <b-container>
      <b-row class="d-flex justify-content-center">
        <b-col xl="6"
               lg="8"
               md="10"
               sm="12"
               xs="12"
               class="box">
          <b-form @submit.prevent="onSubmit"
                  @reset="onReset">
            <b-form-group id="input-group-1"
                          label="帳號"
                          label-for="input-1"
                          :state="accountState"
                          description="帳號長度為 4 ~ 20 個字"
                          invalid-feedback="帳號格式不符">
              <b-form-input id="input-1"
                            v-model="account"
                            type="text"
                            required="required"
                            placeholder="請輸入帳號..."
                            :state="accountState"></b-form-input>
            </b-form-group>
            <b-form-group id="input-group-2"
                          label="密碼"
                          label-for="input-2"
                          :state="passwordState"
                          description="密碼長度為 4 ~ 20 個字"
                          invalid-feedback="密碼格式不符">
              <b-form-input id="input-2"
                            v-model="password"
                            type="password"
                            required="required"
                            placeholder="請輸入密碼..."
                            :state="passwordState"></b-form-input>
            </b-form-group>
            <div class="text-center">
              <b-btn class="mx-1"
                     variant="success"
                     type="submit">登入</b-btn>
              <b-btn class="mx-1"
                     variant="danger"
                     type="reset">重置</b-btn>
            </div>
          </b-form>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      account: '',
      password: ''
    }
  },
  computed: {
    accountState () {
      if (this.account.length === 0) {
        return null
      } else if (this.account.length >= 4 && this.account.length <= 20) {
        return true
      } else {
        return false
      }
    },
    passwordState () {
      if (this.password.length === 0) {
        return null
      } else if (this.password.length >= 4 && this.password.length <= 20) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    onSubmit () {
      // 如果帳號密碼驗證通過
      if (this.accountState && this.passwordState) {
        this.axios
          .post(process.env.VUE_APP_API + '/admins/login', this.$data)
          .then(res1 => {
            if (res1.data.success) {
              console.log(res1.data)
              this.$store.commit('login', res1.data.result)
              this.$swal({
                icon: 'success',
                title: '登入成功'
              }).then(() => {
                // sweet alert 對話框關掉後才跳到相簿頁
                this.$router.push('/')
              })
            } else {
              this.$swal({
                icon: 'error',
                title: '發生錯誤',
                text: res1.data.message
              })
            }
          })
          .catch((err) => {
            this.$swal({
              icon: 'error',
              title: '發生錯誤',
              text: err.response.data.message
            })
          })
      }
    },
    onReset () {
      this.account = ''
      this.password = ''
    }
  }
}
</script>

<style lang="scss">
.box {
  border: 0.1rem solid rgba($color: #747474, $alpha: 1);
  box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
  margin: 2rem;
}
</style>
