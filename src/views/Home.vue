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
        <input type="number" v-model="product.price">
      </div>
      <div class="field">
        <label>Dostępność</label>
        <input type="number" v-model="product.availability">
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
      }, {
        id: 5,
        name: 'Wiertarka udarowa',
        description: 'Podczas prac remontowo-budowlanych jednym z najczęściej używanych urządzeń są wiertarki, niezastąpione, jeśli chcemy wykonać jakikolwiek otwór.<br>W naszej ofercie znajdziesz wiertarki udarowe i bez udaru, wiertarki kątowe do specjalnych zastosowań.',
        price: 99.99,
        availability: 8,
      }, {
        id: 6,
        name: 'Wyżynarka przewodowa 740W',
        description: 'Wyrzynarki to narzędzia, bez których nie obędzie się żadna ekipa remontowa, ale też majsterkowicze i przeciętne gospodarstwa domowe. Pozwalają na precyzyjne cięcie zarówno drewna, ale też metalu i plastiku. Korzystając z wyrzynarek możesz przyciąć listwy, wyciąć otwory pod kuchenkę i zlewozmywak w blatach, wycinać otwory o niewielkiej krzywiźnie, a to tylko niewielkie spektrum ich zastosowań.',
        price: 199.99,
        availability: 2,
      }, {
        id: 7,
        name: 'Szlifierka kątowa 700W',
        description: 'Szlifierki kątowe służą przede wszystkim do cięcia i szlifowania metalu oraz innych twardych materiałów. Najczęściej używa się ich do przecinania prętów zbrojeniowych, blachy, cięcia betonowych i ceramicznych elementów, a także do zgrubnego szlifowania twardych powierzchni. Decydując się na zakup szlifierki kątowej miejmy na uwadze przede wszystkim średnicę tarczy oraz moc urządzenia – oczywiście w zależności od materiałów do jakich ma być przeznaczone. Droższe egzemplarze szlifierek kątowych zaopatrzone są często w system antywibracyjny znacznie podnoszący komfort pracy.',
        price: 139.99,
        availability: 7,
      }, {
        id: 8,
        name: 'Papier ścierny 4+10 280 x 115 mm P120 ',
        description: 'Papiery i płótna ścierne do szlifierek oscylacyjnych, wyposażone w specjalne układy otworów odpylających. Arkusze dostępne w rożnych kształtach, pasujących do szlifierek ze stopą prostokątną, stopą trójkątną (Delta), czy stopą typu żelazko. Papiery w pełnym zakresie granulacji (grubości) ziarna, do wykorzystania w pracach zgrubnych jak i wykończeniowych, wymagających najdrobniejszego ziarna.',
        price: 9.99,
        availability: 0,
      } ]
    }
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
      const termSearch = x =>  x.name.toLowerCase().indexOf(this.search) !== -1 || x.description.toLowerCase().indexOf(this.search) !== -1
      const availabileSearch = x => x.availability > 0
      const unavailabileSearch = x => x.availability === 0
      const filter = this.search === '' ? emptySearch : termSearch

      const AVAILABILITY = {
        all: emptySearch,
        available: x => x.availability > 0,
        low: x => x.availability < 3,
        unavailable: x => x.availability === 0,
      }
      const availability = AVAILABILITY[this.availability]

      return this.items.filter(filter).filter(availability).sort(SORTERS[this.sort])
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
