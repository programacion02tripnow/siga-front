<template>
  <b-media
    v-if="user.getAttr('multimedia',false).length>0"
    vertical-align="center"
  >
    <template #aside>
      <b-avatar
        size="32"
        :src="user.getAttr('multimedia',false)[0].getAttr('file_url')"
      />
    </template>
    <span
      class="font-weight-bold d-block text-nowrap"
    >
      {{ user.getAttr('first_name') }} {{ user.getAttr('last_name') }}
    </span>
    <small class="text-muted">{{ user.getAttr('username') }}</small>
    <br>
    <slot name="details" />
  </b-media>
</template>

<script>

import { BAvatar, BMedia } from 'bootstrap-vue'
import User from '@/dc-it/models/User'
import { ref } from '@vue/composition-api/dist/vue-composition-api'

export default {
  name: 'UserInfoComponent',
  components: {
    BMedia,
    BAvatar,
  },
  props: {
    model: {
      type: Object,
      required: true,
    },
    value: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const user = ref(new User())
    if (props.value) {
      if (!props.value.getAttr) {
        const tmp = new User()

        tmp.initValues(props.value)
        user.value = tmp
      } else {
        user.value = props.value
      }
    }

    return {
      user,
    }
  },
}
</script>

<style scoped>

</style>
