<template>
  <div id="app">
    <Navbar></Navbar>
    <div id="v-content"
         class="content d-flex flex-row"
         v-bind:style="{minHeight: Height+'px'}">
      <div class="col-12"
           v-if="admin.id.length === 0">
        <Login></Login>
      </div>
      <div class="d-flex flex-row incontent"
           v-if="admin.id.length > 0">
        <div class="sidebar col-2">
          <Sidebar></Sidebar>
        </div>
        <div class="dashboard col-10">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import Sidebar from '@/components/Sidebar.vue'
import Login from '@/components/Login.vue'

export default {
  name: 'App',
  data () {
    return {
      Height: 0
    }
  },
  components: {
    Navbar,
    Sidebar,
    Login
  },
  computed: {
    admin () {
      return this.$store.state.admin
    }
  },
  methods: {
    logout () {
      this.axios
        .delete(process.env.VUE_APP_API + '/admins/logout')
        .then((res) => {
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
        .catch((error) => {
          // 如果回來的狀態碼不是 200，直接 alert 錯誤訊息
          this.$swal({
            icon: 'error',
            title: '錯誤',
            text: error.response.data.message
          })
        })
    },
    heartbeat () {
      this.axios
        .get(process.env.VUE_APP_API + '/admins/heartbeat')
        .then(res => {
          // 如果 vuex 是登入中
          if (this.admin.id.length > 0) {
            // 但是後端沒登入
            if (!res.data) {
              this.$swal({
                icon: 'error',
                title: '錯誤',
                text: '登入時效已過'
              })
              // 登出
              this.$store.commit('logout')
              // 導回首頁
              if (this.$route.path !== '/') {
                this.$router.push('/')
              }
            }
          }
        })
        .catch(() => {
          this.$swal({
            icon: 'error',
            title: '錯誤',
            text: '發生錯誤'
          })
          // 登出
          this.$store.commit('logout')
          // 導回首頁
          if (this.$route.path !== '/') {
            this.$router.push('/')
          }
        })
    }
  },
  mounted () {
    this.heartbeat()
    setInterval(() => {
      this.heartbeat()
    }, 5000)
    this.Height = document.documentElement.clientHeight - 100
    window.onresize = () => { this.Height = document.documentElement.clientHeight - 100 }
  }
}
</script>

<style lang="scss">
/* CSS 原生變數 */
:root {
  /* 主題色 */
  --coffee1: #ebba7c !important;
  --coffee2: #eeb16f !important;
  --coffee3: #ce8c69 !important;
  --coffee4: #88462d !important;
  --coffee5: #4f1e13 !important;

  /* 黑色透明 */
  --black25: rgba(0, 0, 0, 0.25) !important;
  --black50: rgba(0, 0, 0, 0.5) !important;
  --black75: rgba(0, 0, 0, 0.75) !important;

  /* 白色透明 */
  --white25: rgba(255, 255, 255, 0.25) !important;
  --white50: rgba(255, 255, 255, 0.5) !important;
  --white75: rgba(255, 255, 255, 0.75) !important;

  /* 陰影 */
  --shadow1: 0 0 5px var(--black25) !important;
  --shadow2: 0 0 10px var(--black50) !important;
  --shadow3: 0 0 15px var(--black75) !important;

  /* 內距、外距的級數 spacing */
  --s0: 0 !important;
  --s1: 0.25rem !important;
  --s2: 0.5rem !important;
  --s3: 1rem !important;
  --s4: 1.5rem !important;
  --s5: 3rem !important;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: flex;
  flex-direction: column;
  min-width: 300px;
  height: 100%;
  flex: 1 1 auto;
  .content {
    box-sizing: border-box; /*為元素指定的任何內邊距和邊框都將在已設定的寬度和高度內進行繪製*/
    min-height: 100%;
    flex: 1 1 auto;
    .incontent {
      width: 100%;
      .sidebar {
        background-color: var(--black50);
      }
      .dashboard {
        background-color: var(--black25);
      }
    }
  }
}
</style>
