<template>
  <div class="Sidebar container d-flex flex-column">
    <router-link to="/"
                 class="text-white">
      <button type="button"
              class="btnCustom btn btn-primary btn-lg btn-block my-5">
        首頁
      </button>
    </router-link>
    <router-link to="/news"
                 class="text-white">
      <button type="button"
              class="btnCustom btn btn-primary btn-lg btn-block my-5">
        最新消息上下架
      </button>
    </router-link>
    <router-link to="/products"
                 class="text-white">
      <button type="button"
              class="btnCustom btn btn-primary btn-lg btn-block my-5">
        商品上下架
      </button>
    </router-link>
    <router-link to="/orders"
                 class="text-white">
      <button type="button"
              class="btnCustom btn btn-primary btn-lg btn-block my-5">
        訂單管理
      </button>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'Sidebar',
  props: {},
  computed: {

  },
  methods: {

  },
  mounted () {

  }
}
</script>

<style scoped lang="scss">
.Sidebar {
  height: 100%;
  overflow: hidden;
  .btnCustom {
    background-color: var(--coffee1);
  }
}
</style>
