<template>
  <div class="page-container">
    <h2 class="text-primary mb-4">EMPLEADOS</h2>

    <div class="row mb-3">
      <div class="col-md-9">
        <input 
          type="text" 
          class="form-control" 
          v-model="busqueda" 
          placeholder="Buscar empleado por nombre" 
        />
      </div>
      <div class="col-md-3">
        <button class="btn btn-primary" @click="abrirModal()">
          <i class="bi bi-person-fill-add"></i><span> Agregar Empleado</span>
        </button>
      </div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Área</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="empleado in empleadosFiltrados" :key="empleado.id">
          <td>{{ empleado.id }}</td>
          <td>{{ empleado.nombre }}</td>
          <td>{{ empleado.area }}</td>
          <td>
            <button @click="abrirModal(empleado)" class="btn btn-warning btn-sm">
              <i class="bi bi-pencil-square"></i><span> Editar</span>
            </button>
            <button @click="eliminarEmpleado(empleado.id)" class="btn btn-danger btn-sm">
              <i class="bi bi-eraser-fill"></i><span> Eliminar</span>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal -->
    <div class="modal fade" id="modalEmpleado" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ empleado.id ? 'Editar Empleado' : 'Añadir Empleado' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="guardarEmpleado">
              <div class="mb-3">
                <label for="nombre" class="form-label">Nombre</label>
                <input type="text" id="nombre" v-model="empleado.nombre" class="form-control" required />
              </div>
              <div class="mb-3">
                <label for="area" class="form-label">Área</label>
                <select id="area" v-model="empleado.area" class="form-select" required>
                  <option value="producción">Producción</option>
                  <option value="finanzas">Finanzas</option>
                  <option value="contabilidad">Contabilidad</option>
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
      empleados: [],
      empleado: { id: null, nombre: '', area: '' },
      busqueda: '',
    };
  },
  computed: {
    empleadosFiltrados() {
      return this.empleados.filter((empleado) =>
        empleado.nombre.toLowerCase().includes(this.busqueda.toLowerCase())
      );
    },
  },
  methods: {
    async cargarEmpleados() {
      const response = await api.get('/empleados'); // Aquí se hace la consulta a la API que te trae los empleados
      this.empleados = response.data;
    },
    abrirModal(empleado = { id: null, nombre: '', area: '' }) {
      this.empleado = { ...empleado };        
      const modalElement = document.getElementById('modalEmpleado');
      const modal = new Modal(modalElement);
      modal.show();
    },
    cerrarModal() {
      const modalElement = document.getElementById('modalEmpleado');
      const modalInstance = Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
    },
    async guardarEmpleado() {
      if (this.empleado.id) {
        await api.put(`/empleados/${this.empleado.id}`, this.empleado);
      } else {
        await api.post('/empleados', this.empleado);
      }
      this.cargarEmpleados();
      this.cerrarModal();
    },
    async eliminarEmpleado(id) {
      await api.delete(`/empleados/${id}`);
      this.cargarEmpleados();
    },
  },
  created() {
    this.cargarEmpleados();
  },
};
</script>
