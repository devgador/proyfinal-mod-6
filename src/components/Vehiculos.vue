<template>
  <div class="page-container">
    <h2 class="text-primary mb-4">VEHÍCULOS</h2>

    <div class="row mb-3">
      <div class="col-md-9">
        <input 
          type="text" 
          class="form-control" 
          v-model="busqueda" 
          placeholder="Buscar vehículo por placa" 
        />
      </div>
      <div class="col-md-3">
        <button class="btn btn-primary mb-3" @click="abrirModal()">
          <i class="bi bi-person-fill-add"></i><span> Agregar Vehículo</span>
        </button>
      </div>
    </div>
    
    <table class="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Tipo</th>
          <th>Placa</th>
          <th>Color</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="vehiculo in vehiculosFiltrados" :key="vehiculo.id">
          <td>{{ vehiculo.id }}</td>
          <td>{{ vehiculo.tipo }}</td>
          <td>{{ vehiculo.placa }}</td>
          <td>{{ vehiculo.color }}</td>
          <td>
            <button @click="abrirModal(vehiculo)" class="btn btn-warning btn-sm">
              <i class="bi bi-pencil-square"></i><span> Editar</span>
            </button>
            <button @click="eliminarVehiculo(vehiculo.id)" class="btn btn-danger btn-sm">
              <i class="bi bi-eraser-fill"></i><span> Eliminar</span>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal -->
    <div class="modal fade" id="modalVehiculo" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ vehiculo.id ? 'Editar Vehículo' : 'Añadir Vehículo' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="guardarVehiculo">
              <div class="mb-3">
                <label for="tipo" class="form-label">Tipo</label>
                <select id="tipo" v-model="vehiculo.tipo" class="form-select" required>
                  <option value="automóvil">Automóvil</option>
                  <option value="moto">Moto</option>
                </select>
              </div>
              <div class="mb-3">
                <label for="placa" class="form-label">Placa</label>
                <input type="text" id="placa" v-model="vehiculo.placa" class="form-control" required />
              </div>
              <div class="mb-3">
                <label for="color" class="form-label">Color</label>
                <input type="text" id="color" v-model="vehiculo.color" class="form-control" required />
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
      vehiculos: [],
      vehiculo: { id: null, tipo: '', placa: '', color: '' },
      busqueda: '',
    };
  },
  computed: {
    vehiculosFiltrados() {
      return this.vehiculos.filter((vehiculo) =>
        vehiculo.placa.toLowerCase().includes(this.busqueda.toLowerCase())
      );
    },
  },
  methods: {
    async cargarVehiculos() {
      const response = await api.get('/vehiculos'); // Ruta para obtener los vehículos
      this.vehiculos = response.data;
    },
    abrirModal(vehiculo = { id: null, tipo: '', placa: '', color: '' }) {
      this.vehiculo = { ...vehiculo };        
      const modalElement = document.getElementById('modalVehiculo');
      const modal = new Modal(modalElement);
      modal.show();
    },
    cerrarModal() {
      const modalElement = document.getElementById('modalVehiculo');
      const modalInstance = Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
    },
    async guardarVehiculo() {
      if (this.vehiculo.id) {
        await api.put(`/vehiculos/${this.vehiculo.id}`, this.vehiculo);
      } else {
        await api.post('/vehiculos', this.vehiculo);
      }
      this.cargarVehiculos();
      this.cerrarModal();
    },
    async eliminarVehiculo(id) {
      await api.delete(`/vehiculos/${id}`);
      this.cargarVehiculos();
    },
  },
  created() {
    this.cargarVehiculos();
  },
};
</script>
