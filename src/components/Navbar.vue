<template>
  <div class="Nav">
    <b-navbar class="nav"
              toggleable="lg"
              type="dark">
      <div class="container">
        <b-navbar-brand>管理員</b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse"
                    is-nav>
          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
            <b-nav-item v-if="admin.id.length > 0"
                        @click="logout">登出</b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </div>
    </b-navbar>
  </div>
</template>

<script>
export default {
  name: 'Navbar',
  props: {},
  computed: {
    admin () {
      return this.$store.state.admin
    }
  },
  methods: {
    logout () {
      this.axios.delete(process.env.VUE_APP_API + '/admins/logout')
        .then(res => {
          // 如果登出成功
          if (res.data.success) {
            this.$swal({
              icon: 'success',
              title: '成功',
              text: '登出成功'
            })

            // 清除 vuex
            this.$store.commit('logout')

            // 導回首頁
            if (this.$route.path !== '/') {
              this.$router.push('/')
            }
          } else {
            this.$swal({
              icon: 'error',
              title: '錯誤',
              text: res.data.message
            })
          }
        })
        .catch(error => {
          // 如果回來的狀態碼不是 200，直接 alert 錯誤訊息
          this.$swal({
            icon: 'error',
            title: '錯誤',
            text: error.response.data.message
          })
        })
    }
  },
  mounted () {

  }
}
</script>

<style scoped lang="scss">
.Nav {
  flex: 0 0 auto;
  .nav{
    background-color: var(--coffee3);
  }
}
</style>
