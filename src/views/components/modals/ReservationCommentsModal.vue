<template>
  <b-sidebar
    :visible="showed"
    right
    backdrop
    backdrop-variant="dark"
    lazy
    @change="(val) => $emit('close', val)"
  >
    <div
      v-if="loading"
      class="px-3 py-2"
    >
      <div class="align-items-center d-flex justify-content-center">
        <b-spinner
          class="mr-1"
          variant="primary"
        />
      </div>
    </div>

    <div
      v-if="!loading"
      class="px-1 py-2 d-flex flex-column h-100 overflow-hidden"
    >
      <div class="row flex-grow-1 overflow-auto">
        <div class="col-12">
          <div
            v-for="comment of comments"
            :key="comment.getAttr('id')"
            class="card"
          >
            <div class="card-body">
              <component
                :is="comment.getAttr('user')"
                :model="comment.getAttr('user', false)"
              >
                <template v-slot:details>
                  <small class="m-0">
                    {{ dateFormat(comment.getAttr('created_at'), true) }}
                  </small>
                </template>
              </component>

              <p
                class="mt-1"
              >
                {{ comment.getAttr('comment') }}
              </p>

            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <div class="form-group">
            <label>Agregar comentario</label>
            <input
              v-model="comment_text"
              type="text"
              class="form-control"
            >
          </div>
          <div class="form-group">
            <button
              class="btn btn-secondary"
              @click="create_comment"
            >
              Guardar
            </button>
          </div>
        </div>
      </div>

    </div>
  </b-sidebar>
</template>

<script>
import { BSidebar, BSpinner } from 'bootstrap-vue'
import helpers from '@/dc-it/services/helpers'
import ReservationComment from '@/dc-it/models/ReservationComment'

export default {
  name: 'ReservationCommentsModal',
  components: {
    BSidebar,
    BSpinner,
  },
  model: {
    prop: 'showed',
    event: 'close',
  },
  props: {
    showed: {
      type: Boolean,
      required: true,
    },
    reservationId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      comments: [],
      comment_text: '',
    }
  },
  mounted() {
    if (this.reservationId) {
      this.loading = true
      ReservationComment.where('reservation_id', '=', this.reservationId).get().then(response => {
        this.comments = response
        this.loading = false
      })
    }
  },
  methods: {
    dateFormat(date, time) {
      return helpers.dateFormat(new Date(date), time)
    },
    create_comment() {
      if (this.comment_text === '') {
        this.showError('Debe ingresar un comentario.')
        return
      }

      this.loading = true

      const c = new ReservationComment()
      c.setAttr('comment', this.comment_text)
      c.setAttr('reservation_id', this.reservationId)

      c.save().then(response => {
        if (response.result === 'success') {
          this.comment_text = ''
          ReservationComment.where('reservation_id', '=', this.reservationId).get().then(res => {
            this.comments = res
            this.loading = false
          })
        } else {
          this.showError('No se ha guardado el comentario')
        }
        this.loading = false
      })
    },
    showError(text) {
      this.$swal({
        title: 'Error',
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
