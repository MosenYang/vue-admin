<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  created() {
    // var Sys = {}
    // var ua = navigator.userAgent.toLowerCase()
    // var s
    // var scan;
    // (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1]
    //   : (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1]
    //     : (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1]
    //       : (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1]
    //         : (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0
    // console.log('versions ', Sys)
  }
}
</script>
