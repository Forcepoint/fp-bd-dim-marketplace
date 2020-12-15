<template>
  <div>
    <div v-for="(module, index) in marketplace.modules" :key="index" class="module">
      <img :src="module.icon_url" />
      <div class="module-details">
        <h2>{{ module.name }}</h2>
        <ul>
          <li v-for="(tag, index) in module.accepted_data_types" :key="index">{{ data_types[tag] }}</li>
        </ul>
      </div>
      <button @click="$EventBus.$emit('delete_module', index)">Delete</button>
      <button @click="$EventBus.$emit('edit_module', index)">Edit</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { CatalogModule } from '@/components/dataclasses/CatalogModule'
import { Marketplace } from '@/components/dataclasses/Marketplace'

@Component
export default class Modules extends Vue {
  @Prop(Marketplace) marketplace!: Marketplace

  // Data Types
  data_types = {
    IP: 'IP Addresses',
    RANGE: 'IP Ranges',
    URL: 'URLs',
    DOMAIN: 'Domains'
  }
}
</script>

<style lang="scss" scoped>

@import '@/scss/variables.scss';

.module {
  width: 100%;
  height: 6em;
  box-sizing: border-box;
  padding: 0.75em;
  background: #F7F7F7;
  margin: 0 0 1em 0;
}

.module img {
  float: left;
  height: 4.5em;
}

.module h2 {
  float: left;
  margin: 0.75em 1.5em 0 1.5em;
  font-weight: 100;
  font-size: 1.25em;
  width: 18em;
}

.module button {
  float: right;
}

.module-details ul {
  list-style: none;
  display: block;
  float: left;
  width: 18em;
  margin: 0em 1.8em 0 1.8em;
}

.module-details ul li {
  font-size: 12px;
  color: #FFFFFF;
  background-color: $green1;
  box-sizing: border-box;
  padding: 0.2em;
  border-radius: 2px;
  float: left;
  margin: 0 0.25em 0 0;
}

.module-type {
  font-size: 0.75em;
  color: $main;
  text-transform: uppercase;
}

button {
  border: none;
  background: $main;
  color: #FFFFFF;
  padding: 0.75em 1.5em;
  border-radius: 3px;
  margin: -1.5em 1em 0 0;
}

button:hover {
  background: #000000;
  cursor: pointer;
}

</style>
