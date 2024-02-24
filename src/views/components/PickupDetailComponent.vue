<template>
  <div>
    <h5>Detalle de renta de transporte {{ qty_pickup }}</h5>
    <div class="input-group">
      <div class="input-group mb-2 mr-2">
        <input
          id="room_type"
          class="form-control"
          type="text"
          name="room_type"
          placeholder="Tipo de habitación"
        >
      </div>
      <div class="input-group mb-2 mr-2">
        <input
          id="net_price"
          class="form-control"
          type="text"
          name="net_price"
          placeholder="Precio neto"
        >
      </div>
      <div class="input-group mb-2 mr-2">
        <input
          id="public_price"
          class="form-control"
          type="text"
          name="public_price"
          placeholder="Precio publico"
        >
      </div>
      <div
        class="input-group mb-2 mr-2"
        style="flex-basis:100%"
      >
        <textarea
          id="special_petition"
          class="form-control"
          type="text"
          name="special_petition"
          placeholder="Peticiones"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Pickupdetail',
  props: ['qty_pickup'],
}
</script>
