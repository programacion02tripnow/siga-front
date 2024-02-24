<template>
  <section class="invoice-preview-wrapper">
    <b-overlay :show="showOverlay">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <div class="row">
                <div class="col-12">
                  <div class="form-group">
                    <label>Nombre</label>
                    <input
                      v-model="name"
                      type="text"
                      class="form-control"
                    >
                  </div>
                </div>

                <div class="col-12">
                  <h4>Permisos</h4>
                </div>

                <div class="col-12">

                  <div
                    v-for="module of modules"
                    :key="module.getAttr('id')"
                  >
                    <h5 class="mb-1">
                      {{ module.getAttr('name') }}
                    </h5>
                    <div class="d-flex flex-wrap">
                      <div
                        v-for="permission of module.getAttr('module_permissions', false)"
                        :key="permission.getAttr('id')"
                        class="mb-1"
                        style="width: 200px;"
                      >
                        <b-form-checkbox
                          :checked="searchRolePermission(module.getAttr('id'), permission.getAttr('id')).selected"
                          :disabled="searchRolePermission(module.getAttr('id'), permission.getAttr('id')).disabled"
                          switch
                          inline
                          @change="changePermissionValue(module.getAttr('id'), permission.getAttr('id'), $event)"
                        >
                          {{ permission.getAttr('label') }}
                        </b-form-checkbox>
                      </div>
                    </div>

                    <hr>
                  </div>
                </div>

                <div class="col-12">
                  <div class="btn-group">
                    <button
                      class="btn btn-danger"
                      @click="$router.replace('/roles')"
                    >
                      Cancelar
                    </button>
                    <button
                      class="btn btn-primary"
                      @click="save"
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </b-overlay>
  </section>
</template>

<script>
import { BOverlay, BFormCheckbox } from 'bootstrap-vue'
import { ref } from '@vue/composition-api/dist/vue-composition-api'
import Module from '@/dc-it/models/Module'
import GeneralService from '@/dc-it/services/GeneralService'
import Role from '@/dc-it/models/Role'

export default {
  name: 'RoleFormView',
  components: { BOverlay, BFormCheckbox },
  mounted() {
    const promises = [Module.where('id', '>', 0).get()]

    if (this.$route.params.id) {
      promises.push(Role.with('role_permissions').where('id', '=', this.$route.params.id).get())
    }

    Promise.all(promises).then(result => {
      [this.modules] = result
      this.initRolePermissions(this.modules)
      if (this.$route.params.id) {
        const rolesResult = result[1]
        if (rolesResult.length === 0) {
          this.showError('No se ha encontrado el rol')
          this.$router.replace('/roles')
          return
        }
        const rol = rolesResult[0]

        this.id = rol.getAttr('id')
        this.name = rol.getAttr('name')
        const permissions = rol.getAttr('role_permissions')
        permissions.forEach(permission => {
          this.rolePermissions.forEach(module => {
            module.permissions.forEach(p => {
              if (p.modulePermissionId.toString() === permission.module_permission_id.toString()) {
                this.changePermissionValue(module.moduleId, p.modulePermissionId, true)
              }
            })
          })
        })
      }

      this.showOverlay = false
    })
  },
  methods: {
    searchRolePermission(moduleId, permissionId) {
      const module = this.rolePermissions.find(rolePermission => rolePermission.moduleId.toString() === moduleId.toString())
      return module.permissions.find(permission => permission.modulePermissionId.toString() === permissionId.toString())
    },
    changePermissionValue(moduleId, permissionId, event) {
      const module = this.rolePermissions.find(rolePermission => rolePermission.moduleId.toString() === moduleId.toString())
      const permission = module.permissions.find(p => p.modulePermissionId.toString() === permissionId.toString())
      permission.selected = event
      let maxLevel = 1
      module.permissions.forEach(p => {
        if (p.level > maxLevel && p.selected) {
          maxLevel = p.level
        }
      })
      for (let i = 0; i < module.permissions.length; i += 1) {
        if (module.permissions[i].modulePermissionId.toString() !== permission.modulePermissionId.toString()) {
          if (module.permissions[i].level < maxLevel) {
            module.permissions[i].selected = true
            module.permissions[i].disabled = true
          } else {
            module.permissions[i].disabled = false
          }
        }
      }
    },
    save() {
      if (this.name === '') {
        this.showError('Debe de ingresar el nombre del rol')
        return
      }

      const rolePermissions = []
      this.rolePermissions.forEach(module => {
        module.permissions.forEach(permission => {
          if (permission.selected) {
            rolePermissions.push({
              module_permission_id: permission.modulePermissionId,
            })
          }
        })
      })

      if (rolePermissions.length === 0) {
        this.showError('Debe de seleccionar por lo menos un permiso')
        return
      }

      this.showOverlay = true
      const data = {
        id: this.id,
        name: this.name,
        role_permissions: rolePermissions,
      }

      GeneralService.getInstance().save('roles', data).then(() => {
        this.updateRole()
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
    updateRole() {
      this.$store.dispatch('app/updateUserInfo').then(user => {
        localStorage.setItem('userData', JSON.stringify(user))
        this.$ability.update(user.ability)

        this.$router.replace('/roles')
      })
    },
  },
  setup() {
    const modules = ref([])
    const showOverlay = ref(true)
    const rolePermissions = ref([])
    const name = ref('')
    const id = ref(null)

    const initRolePermissions = mods => {
      mods.forEach(module => {
        const d = {
          moduleId: module.getAttr('id'),
          permissions: [],
        }

        module.getAttr('module_permissions', false).forEach(permission => {
          d.permissions.push({
            modulePermissionId: permission.getAttr('id'),
            level: parseInt(permission.getAttr('level'), 10),
            selected: false,
            disabled: false,
          })
        })

        rolePermissions.value.push(d)
      })
    }

    return {
      modules,
      showOverlay,
      rolePermissions,
      name,
      initRolePermissions,
      id,
    }
  },
}
</script>

<style scoped>

</style>
