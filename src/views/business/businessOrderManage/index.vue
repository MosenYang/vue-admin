<template>
  <div>
    <router-view />
  </div>
</template>
<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      title: '',
      firstName: '',
      lastName: ''
    }
  },
  computed: {
    fullName() {
      return this.firstName + this.lastName
    }
  },
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {
    getCurrentDate() {
      return new Date().toLocaleDateString()
    }
  }
}
</script>
<style scoped>
  /*@import "../base/reset.css";*/

</style>
