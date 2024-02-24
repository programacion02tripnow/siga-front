<template>

  <div style="width:100%;">
    <h5>Bitacora {{ qty_binnacle }}</h5>
    <div class="input-group mb-2">
      <div class="input-group-prepend">
        <label
          for="childs"
          class="input-group-text"
        >Bitacora</label>
      </div>
      <textarea
        id="childs"
        class="form-control"
        type="text"
        name="childs"
        placeholder=""
      />
    </div>
  </div>

</template>

<script>
export default {
  name: 'PickupBinnacle',
  props: ['qty_binnacle'],
}
</script>
