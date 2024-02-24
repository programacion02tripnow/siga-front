<template>
  <div>
    <div
      v-if="showForm"
      class="row"
    >
      <div
        v-for="(comment, index) in comments"
        :key="index"
        class="col-12"
      >
        <b-card>
          <div class="mb-1">
            <span class="font-weight-bolder">{{ comment.user.username }}</span>
            -
            <span>{{ dateFormat(comment.created_at) }}</span>
          </div>
          <p>
            {{ comment.comment }}
          </p>

        </b-card>
      </div>
    </div>

    <div class="row">

      <div class="col-md-12">
        <div class="form-group">
          <label>Agregar comentario interno (solo visible en sistema)</label>
          <textarea
            v-model="comment"
            class="form-control"
          />
        </div>
      </div>
      <div class="col-md-12">
        <button
          v-if="showForm"
          class="btn btn-primary"
          type="button"
          :disabled="loading"
          @click="save"
        >
          <span v-if="!loading">
            Guardar comentario
          </span>
          <i
            v-if="loading"
            class="fa fa-spin fa-spinner"
          />
        </button>
      </div>
    </div>

  </div>

</template>

<script>
import { BCard } from 'bootstrap-vue'
import helpers from '@/dc-it/services/helpers'
import GeneralService from '@/dc-it/services/GeneralService'

export default {
  name: 'ReservationDetailCommentsComponent',
  components: {
    BCard,
  },
  props: {
    comments: {
      type: Array,
      required: true,
    },
    reservationDetailId: {
      type: Number,
      required: false,
      default: 0,
    },
    showForm: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    loading: false,
    comment: '',
  }),
  methods: {
    dateFormat(date) {
      return helpers.dateFormat(new Date(date), true)
    },
    save() {
      if (!this.comment.trim()) {
        this.showError('Ingrese el comentario')
        return
      }
      this.loading = true
      GeneralService.getInstance().save('reservations/save-reservation-detail-comment', {
        comment: this.comment,
        reservation_detail_id: this.reservationDetailId,
      }).then(response => {
        this.comments.push(response.data)
        this.comment = ''
        this.loading = false
        this.$emit('onCommentSaved')
        this.showError('Se ha guardado correctamente', 'Aviso')
      })
    },
    showError(text, title = 'Error') {
      this.$swal({
        title,
        text,
        showCancelButton: false,
        confirmButtonText: 'Ok',
        confirmButtonColor: '#41b882',
      })
    },
  },
}
</script>

<style scoped>

</style>
