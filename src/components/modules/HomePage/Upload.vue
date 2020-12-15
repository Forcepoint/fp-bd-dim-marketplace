<template>
  <div>

    <!-- File Input - Hidden -->
    <input type="file" accept=".png,.jpg,.jpeg" ref="file" id="file" />

    <!-- File uploading -->
    <div v-if="uploading">
      <font-awesome-icon icon="spinner" class="uploading" spin></font-awesome-icon>
    </div>

    <!-- File upload waiting. -->
    <div v-else-if="!uploaded && !uploading">
      <div class="container">
        <img class="uploaded" src="@/assets/placeholder.jpg" />
        <div class="overlay" @click="open_file_upload()">
          <div class="text">Choose Image</div>
        </div>
      </div>
      <button @click="upload_file">Upload</button>
    </div>

    <!-- File upload complete -->
    <div v-else>
      <div class="container">
        <img class="uploaded" :src="url" />
        <div class="overlay" @click="open_file_upload()">
          <div class="text">Change Image</div>
        </div>
      </div>
      <button @click="upload_file">Upload</button>
    </div>

  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { v4 as uuidv4 } from 'uuid'

@Component
export default class Upload extends Vue {
  @Prop(String) url!: string

  uploaded = false
  uploading = false
  url_to_file = ''

  mounted() {
    this.url_to_file = this.url
    this.$EventBus.$on('close_form', this.clear_image)
  }

  /**
   * Handle the file upload for Module Icons.
   * Sends to the artifactory endpoint with the
   * filename appended.
   */
  upload_file() {

    this.uploading = true

    // Retrieve file field element.
    const files_field = this.$refs.file as HTMLInputElement

    // Upload file if field is not empty.
    if (files_field !== undefined && files_field.files !== null && files_field.files.length > 0) {

      // Build formdata.
      const file = files_field.files[0]
      const form_data = new FormData()
      form_data.append('file', file, file.name)

      // Build request url and headers.
      this.url_to_file = `https://artifactory.frcpnt.com/artifactory/dim-marketplace/${uuidv4()}.${file.name.split('.').pop()}`
      const headers = {
        Authorization: `Bearer ${this.$token}`
      }

      // Send request with file to artifactory.
      Vue.axios.put(this.url_to_file, file, { headers: headers }).then(response => {
        this.uploaded = true
        this.$EventBus.$emit('file_uploaded', this.url_to_file)
      })

      this.uploading = false
    } else {

      this.uploading = false
      this.$EventBus.$emit('main_alert', { type: 2, value: 'Please select a file, before clicking Upload.' })

    }
  }

  open_file_upload() {
    const file_input = this.$refs.file as HTMLInputElement
    file_input.click()
  }

  clear_image() {
    this.url_to_file = ''
  }

  @Watch('url')
  update_image() {
    this.uploaded = true
    this.url_to_file = this.url
  }

}
</script>

<style lang="scss" scoped>

@import '@/scss/variables.scss';

img {
  width: 100%;
  cursor: pointer;
}

input {
  display: none;
}

button {
  border: none;
  background: $main;
  color: #FFFFFF;
  width: 100%;
  box-sizing: border-box;
  padding: 0.5em 0;
}

button:hover {
  cursor: pointer;
  background: #000000;
}

.uploading {
  font-size: 1.5em;
  padding: calc(50% - 1.5em);
  margin: 1.5em 0 0 0;
}

.container {
  position: relative;
  width: 100%;
}

.uploaded {
  display: block;
  width: 100%;
  height: auto;
}

.overlay {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  width: 100%;
  opacity: 0;
  cursor: pointer;
  transition: .2s ease;
  background-color: rgba(0, 0, 0, 0.5);
}

.container:hover .overlay {
  opacity: 1;
}

.text {
  color: white;
  font-size: 20px;
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  text-align: center;
}

</style>
