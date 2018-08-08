<template>
  <div class="home">
    <h1>Magazyn</h1>
    <article v-for="item in items" :key="item.id">
      <header>{{ item.name }}</header>
      <main>{{ item.description }}</main>
      <footer>Cena: {{ item.price }}, Dostępność: {{ item.availability }}</footer>
      <aside>
        <button v-on:click="update(item)">Zaktualizuj</button>
      </aside>
    </article>

    <dialog v-if="product !== null" ref="editor">
      <h2>Edytor stanu magazynowego</h2>
      <div class="field">
        <label>Nazwa</label>
        <input v-model="product.name">
      </div>
      <div class="field">
        <label>Opis</label>
        <textarea v-model="product.description"></textarea>
      </div>
      <div class="field">
        <label>Cena</label>
        <input type="number" v-model="product.price">
      </div>
      <div class="field">
        <label>Dostępność</label>
        <input type="number" v-model="product.availability">
      </div>
      <button v-on:click="closeDialog">Close</button>
    </dialog>
  </div>
</template>

<script>
export default {
  name: 'home',
  components: {
  },
  data () {
    return {
      product: null,
      items: [ {
        id: 1,
        name: 'Klucz francuski',
        description: 'Nastawny klucz płaski do operowania na rozmiarach od 2 do 30',
        price: 50.3,
        availability: 21,
      } ]
    }
  },
  methods: {
    update (item) {
      this.product = item
      this.$nextTick(() => this.$refs.editor.showModal())
    },
    closeDialog () {
      this.$refs.editor.close()
    }
  }
}
</script>

<style lang="scss" scoped>
article {
  display: grid;
  grid-template-areas:
    "header actions"
    "main actions"
    "footer actions";
  grid-template-columns: 1fr;

  header {
    grid-area: header;
  }

  main {
    grid-area: main;
  }

  footer {
    grid-area: footer;
  }

  aside {
    grid-area: actions;
    margin: auto;
  }
}



.field {
  margin: 5px;

  label {
    font-family: Arial, Helvetica, sans-serif;
    margin: 2px 5px 0 0;
    display: inline-block;
    width: 90px;
    text-align: right;
  }

  input, textarea {
    font-family: Arial, Helvetica, sans-serif;
    vertical-align: top;
    width: 300px;
    padding: 1px;
    margin: 0;
  }

  textarea {
    height: 8em;
  }
}
</style>
