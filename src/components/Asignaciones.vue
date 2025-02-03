<template>
  <div class="page-container">
    <h2 class="text-primary mb-4">ASIGNACIÓN DE VEHÍCULOS</h2>

    <div class="row mb-3">
      <div class="col-md-9">
        <input 
          type="text" 
          class="form-control" 
          v-model="busqueda" 
          placeholder="Buscar asignación por nombre de empleado" 
        />
      </div>
      <div class="col-md-3">
        <button class="btn btn-primary mb-3" @click="abrirModal()">
          <i class="bi bi-person-fill-add"></i><span> Asignar Vehículo</span>
        </button>
      </div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Empleado</th>
          <th>Vehículo</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="asignacion in asignacionesFiltradas" :key="asignacion.id">
          <td>{{ asignacion.id }}</td>
          <td>{{ obtenerEmpleado(asignacion.empleadoId) }}</td>
          <td>{{ obtenerVehiculo(asignacion.vehiculoId) }}</td>
          <td>
            <button @click="abrirModal(asignacion)" class="btn btn-warning btn-sm">
              <i class="bi bi-pencil-square"></i><span> Editar</span>
            </button>
            <button @click="eliminarAsignacion(asignacion.id)" class="btn btn-danger btn-sm">
              <i class="bi bi-eraser-fill"></i><span> Eliminar</span>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal -->
    <div class="modal fade" id="modalAsignacion" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ asignacion.id ? 'Editar Asignación' : 'Asignar Vehículo' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="guardarAsignacion">
              <div class="mb-3">
                <label for="empleado" class="form-label">Empleado</label>
                <select id="empleado" v-model="asignacion.empleadoId" class="form-select" required>
                  <option v-for="empleado in empleados" :key="empleado.id" :value="empleado.id">
                    {{ empleado.nombre }}
                  </option>
                </select>
              </div>
              <div class="mb-3">
                <label for="vehiculo" class="form-label">Vehículo</label>
                <select id="vehiculo" v-model="asignacion.vehiculoId" class="form-select" required>
                  <option v-for="vehiculo in vehiculos" :key="vehiculo.id" :value="vehiculo.id">
                    {{ vehiculo.placa }} - {{ vehiculo.tipo }} - {{ vehiculo.color }}
                  </option>
                </select>
              </div>
              <button type="submit" class="btn btn-primary">Guardar</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api';
import { Modal } from 'bootstrap';

export default {
  data() {
    return {
      asignaciones: [],
      asignacion: { id: null, empleadoId: null, vehiculoId: null },
      empleados: [],  // Lista de empleados
      vehiculos: [],  // Lista de vehículos
      busqueda: '',
    };
  },
  computed: {
    asignacionesFiltradas() {
      return this.asignaciones.filter((asignacion) => 
        this.obtenerEmpleado(asignacion.empleadoId).toLowerCase().includes(this.busqueda.toLowerCase())
      );
    },
  },
  methods: {
    async cargarAsignaciones() {
      const response = await api.get('/asignaciones'); // Ruta para obtener asignaciones
      this.asignaciones = response.data;
    },
    async cargarEmpleados() {
      const response = await api.get('/empleados'); // Ruta para obtener empleados
      this.empleados = response.data;
    },
    async cargarVehiculos() {
      const response = await api.get('/vehiculos'); // Ruta para obtener vehículos
      this.vehiculos = response.data;
    },
    obtenerEmpleado(id) {
      const empleado = this.empleados.find((empleado) => empleado.id === id);
      return empleado ? empleado.nombre : 'Desconocido';
    },
    obtenerVehiculo(id) {
      const vehiculo = this.vehiculos.find((vehiculo) => vehiculo.id === id);
      return vehiculo ? `${vehiculo.placa} (${vehiculo.tipo})` : 'Desconocido';
    },
    abrirModal(asignacion = { id: null, empleadoId: null, vehiculoId: null }) {
      this.asignacion = { ...asignacion };
      const modalElement = document.getElementById('modalAsignacion');
      const modal = new Modal(modalElement);
      modal.show();
    },
    cerrarModal() {
      const modalElement = document.getElementById('modalAsignacion');
      const modalInstance = Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
    },
    async guardarAsignacion() {
      if (this.asignacion.id) {
        await api.put(`/asignaciones/${this.asignacion.id}`, this.asignacion);
      } else {
        await api.post('/asignaciones', this.asignacion);
      }
      this.cargarAsignaciones();
      this.cerrarModal();
    },
    async eliminarAsignacion(id) {
      await api.delete(`/asignaciones/${id}`);
      this.cargarAsignaciones();
    },
  },
  created() {
    this.cargarAsignaciones();
    this.cargarEmpleados();
    this.cargarVehiculos();
  },
};
</script>
