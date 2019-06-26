<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  created() {
    (function(window) {
      const docEl = document.documentElement
      const resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize'
      const recalc = function() {
        let innerWidth = docEl.getBoundingClientRect().width || docEl.clientWidth || window.innerWidth
        innerWidth < 320 ? innerWidth = 320 : innerWidth
        if (!innerWidth) {
          return false
        }
        // 设置css像素/em
        if (innerWidth < 765) {
          // docEl.style.fontSize = innerWidth / 3.75 + 'px'// 100
          docEl.style.fontSize = (innerWidth * 20 / 375) + 'px'
          return
        }
        if (innerWidth > 765 && innerWidth < 1024) {
          // docEl.style.fontSize = innerWidth / 5.12 + 'px'//150
          docEl.style.fontSize = innerWidth * 30 / 768 + 'px'
          return
        }
        docEl.style.fontSize = 40 + 'px'
      }
      recalc()
      setTimeout(function() { recalc() }, 300)
      window.addEventListener(resizeEvt, recalc, false)
      window.addEventListener('load', recalc, false)
      window.addEventListener('resize', recalc, false)
      document.addEventListener('DOMContentLoaded', recalc, false)
    })(window)
  }
}
</script>
