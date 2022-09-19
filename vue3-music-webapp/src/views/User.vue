<template>
<div class="user">
   <h1>请扫码登录</h1>
  <img :src="imgSrc">
</div>
</template>

<script>
import { loginImg, checkLogin } from '@/api'
export default {
  name: 'User',
  data () {
    return {
      imgSrc: ''
    }
  },
  async created () {
    const result = await loginImg()
    this.imgSrc = result.data.qrimg
    this.checkStatus()
  },
  methods: {
    checkStatus () {
      let timer
      timer = setInterval(async () => {
        const statusRes = await checkLogin()
        if (statusRes.code === 800) {
          alert('二维码已过期,请重新获取')
          clearInterval(timer)
        }
        if (statusRes.code === 803) {
          // 这一步会返回cookie
          clearInterval(timer)
          alert('授权登录成功')
          console.log(statusRes)
          localStorage.setItem('cookieMusic', statusRes.cookie)
          this.$router.push({ path: '/recommend' })
        }
      }, 3000)
    }
  }
}
</script>

<style lang="scss" scoped>
.user{
  position: fixed;
  z-index: 10;
  top: 44px;
  bottom: 0;
  left: 0;
  right: 0;
  background: $color-background;
}
</style>
