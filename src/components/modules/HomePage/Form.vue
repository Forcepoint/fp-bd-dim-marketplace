<template>
  <div>

    <div class="left">
      <p>Module ID</p>
      <input type="text" placeholder="Module ID" v-model="module.id" />
      <p>Module Name</p>
      <input type="text" placeholder="Module Name" v-model="module.name" />
    </div>

    <div class="right">
      <p>Icon</p>
      <Upload :url="module.icon_url" :key="upload_key" />
    </div>

    <br />
    <div class="center">
      <p>Docker Image Name</p>
      <input type="text" placeholder="Docker Image Name" v-model="module.image_ref" />

      <p>Description</p>
      <textarea ref='description' placeholder="Description" v-model="module.description"></textarea>

      <p>Module Type</p>
      <v-select v-model="module.type" :options="options" :placeholder="'Module Type'" class="select"></v-select>

      <p>Accepted Data Types</p>
      <div class="checkboxes">
        <span v-for="(data_type, value) in data_types" :key="value" class="checkbox">
          <input type="checkbox" :value="value" :name="data_type" :id="data_type" v-model="module.accepted_data_types" />
          <label :for="data_type">{{ data_type }}</label><br />
        </span>
        <div style="clear: both;"></div>
      </div>

      <p>Volumes</p>
      <div v-for="(mod, index) in module.volumes" :key="index">
        <input type="text" placeholder="Volume" v-model="module.volumes[index]"/>
        <div style="clear: both;"></div>
      </div>
      <button @click="add_volume()">Add Volume</button>

      <button @click="$EventBus.$emit('close_form')">Close Form</button>
      <button @click="submit()">Submit</button>
      <div style="clear: both;"></div>
    </div>

  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { CatalogModule } from '@/components/dataclasses/CatalogModule'
import { Marketplace } from '@/components/dataclasses/Marketplace'
import Upload from '@/components/modules/HomePage/Upload.vue'

@Component({
  components: {
    Upload
  }
})
export default class Form extends Vue {
  @Prop(Marketplace) marketplace!: Marketplace
  @Prop(Number) index!: number

  upload_key = 0
  module = new CatalogModule('', '', '', '', [], '', '', [''], [])

  // Options
  options = [
    'ingress',
    'egress'
  ]

  // Data Types
  data_types = {
    IP: 'IP Addresses',
    RANGE: 'IP Ranges',
    URL: 'URLs',
    DOMAIN: 'Domains'
  }

  // Module Data
  url_to_file = ''

  mounted() {
    if (this.index !== -1) {
      this.module = this.marketplace.modules[this.index]
    }
    this.$EventBus.$on('edit_module', this.edit_module)
    this.$EventBus.$on('clear_module', this.clear_module)
    this.$EventBus.$on('file_uploaded', this.set_file)
  }

  /**
   * Upon clicking submit, validate the values
   * for the module and then append them to the
   * overall marketplace list and PUT them on the
   * artifactory repo in the modules.json file.
   */
  submit() {

    // Validate module first.
    if (!this.valid()) {
      return
    }

    // Update marketplace with module.
    const mp = JSON.parse(JSON.stringify(this.marketplace))
    if (this.index === -1) {
      mp.modules.push(this.module)
    }

    // PUT json marketplace on Artifactory
    const url = 'https://artifactory.frcpnt.com/artifactory/dim-marketplace/modules.json'
    const headers = {
      Authorization: `Bearer ${this.$token}`
    }
    Vue.axios.put(url, JSON.stringify(mp), { headers: headers }).then(() => {
      this.$EventBus.$emit('close_form')
      this.$EventBus.$emit('load_modules')
      this.$EventBus.$emit('main_alert', { type: 1, value: 'Successfully updated the Dynamic Intelligence Manager Marketplace.' })
    })

  }

  /**
   * Validate the values for the module before
   * submission to the artifactory repository.
   */
  valid() {

    // Check if fields empty.
    if (this.module.id === '') {
      this.$EventBus.$emit('main_alert', { type: 3, value: 'Please fill in all fields before submitting. The Module ID field is empty.' })
      return false
    }

    if (this.module.name === '') {
      this.$EventBus.$emit('main_alert', { type: 3, value: 'Please fill in all fields before submitting. The Module Name field is empty.' })
      return false
    }

    if (this.module.image_ref === '') {
      this.$EventBus.$emit('main_alert', { type: 3, value: 'Please fill in all fields before submitting. The Module Image field is empty.' })
      return false
    }

    if (this.module.description === '') {
      this.$EventBus.$emit('main_alert', { type: 3, value: 'Please fill in all fields before submitting. The Module Description field is empty.' })
      return false
    }

    if (this.module.type === '') {
      this.$EventBus.$emit('main_alert', { type: 3, value: 'Please fill in all fields before submitting. The Module Type field is empty.' })
      return false
    }

    if (this.module.accepted_data_types.length === 0) {
      this.$EventBus.$emit('main_alert', { type: 3, value: 'Please fill in all fields before submitting. Please select at least one accepted data type.' })
      return false
    }

    // Check if file empty
    if (this.module.icon_url === '') {
      this.$EventBus.$emit('main_alert', { type: 3, value: 'Please upload an icon for the module before submitting.' })
      return false
    }

    return true

  }

  set_file(url: string) {
    this.module.icon_url = url
    this.module.env_vars[2] = `ICON_URL=${url}`
  }

  clear_module() {
    this.index = -1
    this.module = new CatalogModule('', '', '', '', [], '', '', [''], [])
  }

  edit_module() {
    this.upload_key++
  }

  add_volume() {
    this.module.volumes.push('')
  }

  @Watch('module.id')
  set_module() {
    this.module.env_vars[0] = `MODULE_SVC_NAME=${this.module.id}`
    console.log(this.module)
  }

}
</script>

<style lang="scss" scoped>

@import '@/scss/variables.scss';

.left {
  width: 70%;
  float: left;
}

.right {
  width: 30%;
  float: left;
  box-sizing: border-box;
  padding: 0 0 0 3.5em;
}

input[type=text], textarea {
  background-color: $secondary;
  border: none;
  padding: 1.25em;
  width: calc(100% - 3em);
  position: relative;
  margin: 0 0 1.75em 0;
}

textarea {
  min-height: 10em;
  font-family: inherit;
  font-size: 0.95em;
}

textarea::placeholder {
  font-family: inherit;
}

.field input:hover, textarea:hover {
  background-color: $quatenary;
}

p {
  color: $main;
  font-size: 1em;
  margin: 0 0 0.75em 0;
}

.checkbox {
  float: left;
  margin: 0 2em 0 0;
}

.checkbox label {
  display: block;
  margin: -1.25em 0 0 2em;
}

.checkboxes {
  width: 100%;
}

button {
  border: none;
  background: $main;
  color: #FFFFFF;
  padding: 1em 1.5em;
  margin: 2em 1em 0 0;
  border-radius: 3px;
  float: right;
}

button:hover {
  background: #000000;
  cursor: pointer;
}

</style>
