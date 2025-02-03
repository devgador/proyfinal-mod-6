<template>
  <div>
    <nav class="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">
          <img src="/volks.png" alt="Automovil" class="navbar-logo" />
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor01"
          aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarColor01">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <router-link to="/empleados" class="nav-link">Empleados</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/vehiculos" class="nav-link">Vehiculos</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/asignaciones" class="nav-link">Asignaciones</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <router-view />
  </div>
</template>
<style>
.navbar-logo {
  height: 60px;
  width: auto;
}
</style>
<script>
export default {
  name: "App",
};
</script>
