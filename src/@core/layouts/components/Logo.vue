<template>
  <b-img
    :src="appLogoImage"
    alt="logo"
    style="width: 150px;"
  />
</template>

<script>
import { BImg } from 'bootstrap-vue'
import { $themeConfig } from '@themeConfig'

export default {
  components: {
    BImg,
  },
  setup() {
    const { appName, appLogoImage } = $themeConfig.app

    return {
      appName, appLogoImage,
    }
  },
}
</script>
