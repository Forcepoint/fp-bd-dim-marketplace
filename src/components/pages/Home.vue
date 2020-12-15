<template>
  <div>

    <!-- Logo -->
    <img src="@/assets/fp_login_logo.png" class="logo" />

    <div id="main">

      <!-- Alert Area -->
      <Alert :alert_title="'main_alert'" />

      <!-- Panel Area -->
      <div class="panel">

        <!-- Panel Header -->
        <div class="panel-header">
          <h2>Marketplace</h2>
        </div>

        <!-- Panel Content -->
        <div class="panel-content">

          <!-- Show Controls -->
          <button v-if="!form_visible" @click="form_visible = true">Add Module to Marketplace</button>

          <!-- Show Contents -->
          <Form v-if="form_visible" :marketplace="marketplace" :index="module_index" :key="form_key" />
          <Modules :marketplace="marketplace" :key="modules_key" v-else />

        </div>

      </div>

    </div>

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { CatalogModule } from '@/components/dataclasses/CatalogModule'
import { Marketplace } from '@/components/dataclasses/Marketplace'
import Alert from '@/components/modules/Global/Alert.vue'
import Form from '@/components/modules/HomePage/Form.vue'
import Modules from '@/components/modules/HomePage/Modules.vue'

@Component({
  components: {
    Alert,
    Form,
    Modules
  }
})
export default class Home extends Vue {

  // Visibility Flags
  form_visible = false

  // Data
  module_index = -1
  marketplace: Marketplace = new Marketplace([])

  // Refresh Keys
  form_key = 0
  modules_key = 0

  mounted() {
    this.$EventBus.$on('load_modules', this.load_modules)
    this.$EventBus.$on('delete_module', this.delete_module)
    this.$EventBus.$on('edit_module', this.edit_module)
    this.$EventBus.$on('close_form', this.close_form)
    this.load_modules()
  }

  load_modules() {
    this.marketplace = new Marketplace([])
    const url = 'https://artifactory.frcpnt.com/artifactory/dim-marketplace/modules.json'
    Vue.axios.get(url).then((response) => {
      response.data.modules.forEach(module => {
        const new_module = new CatalogModule(
          module.id,
          module.name,
          module.description,
          module.type,
          module.accepted_data_types,
          module.image_ref,
          module.icon_url,
          module.volumes,
          module.env_vars
        )
        this.marketplace.modules.push(new_module)
      })
      console.log(this.marketplace)
      this.modules_key++
    })
  }

  edit_module(index: number) {
    this.module_index = index
    this.form_visible = true
    this.form_key++
  }

  delete_module(index: number) {
    delete this.marketplace.modules[index]

    // PUT json marketplace on Artifactory
    const url = 'https://artifactory.frcpnt.com/artifactory/dim-marketplace/modules.json'
    const headers = {
      Authorization: `Bearer ${this.$token}`
    }
    Vue.axios.put(url, JSON.stringify(this.marketplace), { headers: headers }).then(() => {
      this.load_modules()
      this.$EventBus.$emit('main_alert', { type: 1, value: 'Successfully deleted the module from the Dynamic Intelligence Manager Marketplace.' })
    })
  }

  close_form() {
    this.form_visible = false
    this.module_index = -1
    this.$EventBus.$emit('clear_module')
    this.form_key++
  }

}
</script>

<style lang="scss" scoped>

@import '@/scss/variables.scss';

.logo {
  width: 30em;
  margin: 2em auto;
  display: block;
}

#main {
  width: 50em;
  margin: 2em auto;
}

button {
  border: none;
  width: 100%;
  padding: 1.5em;
  background: $main;
  color: #FFFFFF;
  margin: 0 0 1.5em 0;
}

button:hover {
  background: #000000;
  cursor: pointer;
}

</style>
