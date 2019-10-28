<template>
  <div id="app">
    <router-view/>
    <div style="margin: 0px auto; width: 562px; height: 640px; background: url('blob:https://www.shipinyasuo.com/2e70b18e-8fa3-4805-9335-ccac3bf1951f') center center no-repeat;">
      
    </div>
  </div>
</template>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
