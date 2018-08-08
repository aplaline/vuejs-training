<template>
  <div id="app">
    <nav>
      <router-link to="/">Magazyn</router-link> |
      <router-link to="/about">O programie</router-link>
    </nav>
    <main>
      <router-view />
    </main>
    <footer>Aplikacja Magazyn</footer>
  </div>
</template>

<style>
* {
  box-sizing: border-box;
}
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>

<style scoped>
#app {
  min-height: 100%;
  max-height: 100%;

  display: grid;
  grid-template-areas:
    "header"
    "main"
    "footer";
  grid-template-columns: 1fr;
  grid-template-rows: 50px 1fr 50px;
}

nav {
  margin: auto 20px;
  grid-area: header;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}

main {
  margin: 10px 0 10px 10px;
  padding: 0 10px 0 0;
  overflow: auto;
  grid-area: main;
}

footer {
  margin: auto;
  grid-area: footer;
}
</style>
