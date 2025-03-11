<template>
  <div class="part">
    <div class="title">{{ props.parttext }}</div>
    <article>{{ props.partart }}</article>
  </div>
</template>

<script setup>
const props = defineProps(['parttext', 'partart', 'msg'])
</script>

<style scoped lang="scss">
h1 {
  margin: 0 0 4vh 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.part {
  margin: 4vh auto;
  width: 40vw;
  .title {
    font-size: 4vmin;
    font-weight: 700;
  }
  article {
    font-size: 2vmin;
    font-family: 微软雅黑;
    padding: 4vh;
  }
}
</style>
