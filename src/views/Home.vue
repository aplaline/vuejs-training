<template>
  <div class="home">
    <h1>Magazyn</h1>

    <section class="filters">
      <label>Sortuj po</label>
      <select v-model="sort">
        <option value="id"></option>
        <option value="name">nazwie</option>
        <option value="description">opisie</option>
        <option value="price">cenie</option>
        <option value="availability">dostępności</option>
      </select>

      <label>Szukaj</label>
      <input v-model="search" v-focus>

      <label>Dostępność</label>
      <select v-model="availability">
        <option value="all">Wszystkie</option>
        <option value="available">Dostępne</option>
        <option value="low">Niski stan</option>
        <option value="unavailable">Niedostępne</option>
      </select>
    </section>

    <article v-for="(item, index) in products" :key="item.id" :class="{ odd: index % 2 == 0, even: index % 2 == 1 }">
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
        <input type="number" v-model.number="product.price">
      </div>
      <div class="field">
        <label>Dostępność</label>
        <input type="number" v-model.number="product.availability">
      </div>
      <footer>
        <button v-on:click="saveChanges">Save</button>
        <button v-on:click="closeDialog">Cancel</button>
      </footer>
    </dialog>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
import dialogPolyfill from 'dialog-polyfill'

export default {
  name: 'home',
  components: {
  },
  directives: {
    focus: {
      inserted (e) {
        e.focus()
      },
    }
  },
  data () {
    return {
      sort: 'id',
      search: '',
      availability: 'all',
      product: null,
      editedProduct: null,
      items: [],
    }
  },
  mounted () {
    fetch('http://localhost:3000/api/products')
      .then(response => response.json())
      .then(products => this.items = products)
  },
  computed: {
    products () {
      const SORTERS = {
        id: (a, b) => a.id - b.id,
        name: (a, b) => a.name.localeCompare(b.name),
        description: (a, b) => a.description.localeCompare(b.description),
        price: (a, b) => a.price - b.price,
        availability: (a, b) => a.availability - b.availability,
      }

      const emptySearch = () => true
      const termSearch = x => x.name.toLowerCase().indexOf(this.search) !== -1 || x.description.toLowerCase().indexOf(this.search) !== -1
      const search = this.search === '' ? emptySearch : termSearch

      const AVAILABILITY = {
        all: emptySearch,
        available: x => x.availability > 0,
        low: x => x.availability < 3,
        unavailable: x => x.availability === 0,
      }
      const availability = AVAILABILITY[this.availability]

      return this.items.filter(search).filter(availability).sort(SORTERS[this.sort])
    }
  },
  methods: {
    update (item) {
      this.product = cloneDeep(item)
      this.editedProduct = item
      this.$nextTick(() => {
        dialogPolyfill.registerDialog(this.$refs.editor)
        this.$refs.editor.showModal()
      })
    },
    saveChanges () {
      this.editedProduct.name = this.product.name
      this.editedProduct.description = this.product.description
      this.editedProduct.price = this.product.price
      this.editedProduct.availability = this.product.availability
      this.closeDialog()
    },
    closeDialog () {
      this.$refs.editor.close()
    },
  }
}
</script>

<style lang="scss" scoped>
.filters {
  select, input {
    margin-left: 5px;
    margin-bottom: 10px;
    margin-right: 5px;
  }
}

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
    font-size: 120%;
    font-weight: bolder;
  }

  main {
    grid-area: main;
    margin: 10px 0;
  }

  footer {
    grid-area: footer;
    font-size: 120%;
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

dialog footer {
  height: 45px;
  display: flex;
  padding: 20px 0 0px 0;
  justify-content: space-around;
}
</style>
