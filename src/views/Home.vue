<template>
  <div class="home">
    <h1>Magazyn</h1>
    <article v-for="(item, index) in items" :key="item.id" :class="{ odd: index % 2 == 0, even: index % 2 == 1 }">
      <header>{{ item.name }}</header>
      <main v-html="item.description" />
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
        price: 49.99,
        availability: 21,
      }, {
        id: 2,
        name: 'Młotek gumowy',
        description: 'Młotek z wygumowanym obuchem do stosowania przy elementach mogących ulec uszkodzeniu przy obróbce metalowym obuchem',
        price: 30.99,
        availability: 10,
      }, {
        id: 3,
        name: 'Kombinerki',
        description: 'Doskonałej jakości kombinerki do wielorakiego zastosowania',
        price: 69.99,
        availability: 14,
      }, {
        id: 4,
        name: 'Zestaw kluczy nasadowych',
        description: 'Bogady zestaw kluczy nasadowych (od 3mm do 30mm)',
        price: 319.99,
        availability: 3,
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
  padding: 5px;
  display: grid;

  &.odd {
    background-color: #f0f0f0;
  }

  &.even {
    background-color: #f8f8f8;
  }

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
