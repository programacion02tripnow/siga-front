<template>
  <b-card
    v-if="data"
    class="card-transaction"
    no-body
  >
    <b-card-header>
      <b-card-title>Reservas</b-card-title>
    </b-card-header>

    <b-card-body>
      <div
        v-for="transaction in data"
        :key="transaction.mode"
        class="transaction-item"
      >
        <b-media no-body>
          <b-media-aside>
            <b-avatar
              rounded
              size="42"
              :variant="transaction.avatarVariant"
            >
              <img
                :src="transaction.avatar"
                alt=""
                class="img-fluid p-1"
              >
            </b-avatar>
          </b-media-aside>
          <b-media-body>
            <h6 class="transaction-title">
              {{ transaction.mode }}
            </h6>
          </b-media-body>
        </b-media>
        <div
          class="font-weight-bolder"
          :class="transaction.deduction ? 'text-danger':'text-success'"
        >
          {{ transaction.payment }}
        </div>
      </div>
    </b-card-body>
  </b-card>
</template>

<script>
import {
  BCard, BCardHeader, BCardTitle, BCardBody, BMediaBody, BMedia, BMediaAside, BAvatar,
} from 'bootstrap-vue'

export default {
  components: {
    BCard,
    BCardHeader,
    BCardTitle,
    BCardBody,
    BMediaBody,
    BMedia,
    BMediaAside,
    BAvatar,
  },
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
}
</script>
