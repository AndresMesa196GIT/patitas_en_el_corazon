function obtenerFavoritos() {
  const favoritos = localStorage.getItem("favoritos");
  return favoritos ? JSON.parse(favoritos) : [];
}

function guardarFavoritos(favoritos) {
  localStorage.setItem("favoritos", JSON.stringify(favoritos));
}

function agregarFavorito(id, nombre, tipo, descripcion, imagen) {
  let favoritos = obtenerFavoritos();

  const existe = favoritos.some(item => item.id === id);

  if (existe) {
    alert("Ya está en favoritos");
    return;
  }

  favoritos.push({
    id: id,
    nombre: nombre,
    tipo: tipo,
    descripcion: descripcion,
    imagen: imagen
  });

  guardarFavoritos(favoritos);
  alert("Agregado a favoritos");
}

function eliminarFavorito(id) {
  let favoritos = obtenerFavoritos();
  favoritos = favoritos.filter(item => item.id !== id);
  guardarFavoritos(favoritos);
  mostrarFavoritos();
}

function mostrarFavoritos() {
  const contenedor = document.getElementById("contenedor-favoritos");
  if (!contenedor) return;

  const favoritos = obtenerFavoritos();

  if (favoritos.length === 0) {
    contenedor.innerHTML = "<p>No hay favoritos.</p>";
    return;
  }

  contenedor.innerHTML = favoritos.map(m => `
    <div class="bg-white rounded-lg shadow-md p-4">
      <img src="${m.imagen}" alt="${m.nombre}" class="w-full h-48 object-cover rounded mb-4">
      <h3 class="text-xl font-bold mb-2">${m.nombre}</h3>
      <p class="text-gray-600">${m.tipo}</p>
      <p class="text-gray-700 mb-3">${m.descripcion}</p>
      <button onclick="eliminarFavorito(${m.id})" class="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600">
        Eliminar
      </button>
    </div>
  `).join("");
}