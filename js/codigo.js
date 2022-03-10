$(document).ready(inicio);

// Variables Globales
let listaUsuarios = [];
let listaRecetas = [];
let auxRecetasConElTiempo = [];
let usuarioLogueado = null;

function inicio() {
    ocultarTodo();
    mostrarItemLoginEnBarra();
    precargarDatos();
    listarRecetas();

    $("#catalogoRecetas").show();

    // Eventos del menu
    $("#mnuIniciarSesion").click(mostrarLogin);
    $("#mnuCerrarSesion").click(cerrarSesion);
    $("#mnuRegistrarUsuario").click(mostrarRegistrarUsuario);
    $("#mnuRegistrarReceta").click(mostrarRegistrarReceta);
    $("#mnuListarUsuarios").click(mostrarListarUsuarios);
    $("#mnuCatalogoRecetas").click(mostrarCatalogo);
    $("#mnuReportes").click(mostrarReportes);
    $("#mnuEstadoUsuarios").click(estadosUsuarios);

    // Reportes
    $("#btnBuscadorTiempo").click(buscadorSegunTiempo);
    $("#btnBuscadorPorTiempo").click(buscadorPorTiempo);
    $("#btnBuscadorDuracion").click(buscadorSegunDuracion);
    $("#btnBuscadorRendimiento").click(recetasSegunLikes);

    //Busqueda por nombre de receta
    $("#btnBuscador").click(listarRecetasBuscador);

    // eventos en los botones de los ejercicios 
    $("#btnLogin").click(login);
    $("#btnRegistrarUsuario").click(nuevoUsuario);
    $("#btnRegistrarReceta").click(nuevaReceta);
}



function mostrarRegistrarUsuario() { // Funcion para mostrar registro de usuario
    ocultarTodo();
    $("#menuAdmin").show();
    $("#registroUsuario").show();
    $("#mensajesRegistrarUsuario").html("");
}

function mostrarRegistrarReceta() { // Funcion para mostrar registro de recetas
    ocultarTodo();
    $("#menuAdmin").show();
    $("#registroReceta").show();
    $("#mensajesRegistrarReceta").html("");
}

function mostrarCatalogo() { // Funcion para mostrar catalogo
    ocultarTodo();
    $("#menuAdmin").show();
    $("#catalogoRecetas").show();
    listarRecetas();
    $("#Buscador").show();
}

function cerrarSesion() { // Funcion para cerra sesión
    usuarioLogueado = null;
    $("#bienvenida").html("");
    ocultarTodo();
    mostrarItemLoginEnBarra();
    $("#catalogoRecetas").show();
    listarRecetas();
}

function mostrarListarUsuarios() { // Funcion para mostrar la lista de usuarios
    ocultarTodo();
    $("#menuAdmin").show();
    $("#listadoUsuarios").show();
    listarUsuarios();
}

function mostrarItemLoginEnBarra() { // Funcion para mostar los items de la barra de opciones de arriba
    $("#menuAdmin").show();
    $("#mnuListarUsuarios").hide();
    $("#mnuRegistrarReceta").hide();
    $("#mnuCatalogoRecetas").hide();
    $("#mnuCerrarSesion").hide();
    $("#mnuListadoColaboradores").hide();
    $("#mnuRegistrarUsuario").hide();
    $("#mnuIniciarSesion").show();
    $("#Buscador").show();
    $("#mnuReportes").hide();

    if (usuarioLogueado == null) {  // Solo funciona si el usuario esta logeado
        $("#mnuEstadoUsuarios").hide();
    } else {
        if (usuarioLogueado.esAdministrador == true) { // Solo funciona si el usuario logeado es administador
            $("#mnuEstadoUsuarios").show();
        } else {
            $("#mnuEstadoUsuarios").hide();
        }
    }
}

// Funciones del menu
function ocultarTodo() {
    $("#menuAdmin").hide();
    $("#login").hide();
    $("#registroUsuario").hide();
    $("#catalogoRecetas").hide();
    $("#listadoUsuarios").hide();
    $("#registroReceta").hide();
    $("#mnuIniciarSesion").hide();
    $("#buscadorSegunTiempo").hide();
    $("#reportes").hide();
    $("#catalogoRecetasPorTiempo").hide();
}

// ---------------------------------------
// LOGIN CON ADMINISTRADOR Y COLABORADOR
//----------------------------------------

function mostrarLogin() {
    ocultarTodo();
    mostrarItemLoginEnBarra();
    $("#login").show();
    $("#Buscador").hide();

}

function login() {
    let nomUsuario = $("#txtUsuarioLogin").val();
    let password = $("#txtClaveLogin").val();
    if (verificarLogin(nomUsuario, password)) {

        if (usuarioLogueado.esAdministrador == true) { // Solo funciona si el usuario logeado es administador
            $("#txtUsuarioLogin").val("");
            $("#txtClaveLogin").val("");
            // Mostrar Menu
            ocultarTodo();
            $("#menuAdmin").show();
            $("#mnuIniciarSesion").hide();
            $("#mnuListarUsuarios").show();
            $("#mnuRegistrarReceta").show();
            $("#mnuCatalogoRecetas").show();
            $("#mnuCerrarSesion").show();
            $("#mnuListadoColaboradores").show();
            $("#mnuRegistrarUsuario").show();
            mostrarCatalogo();
            $("#Buscador").show();
            $("#mnuReportes").show();
            $("#mnuEstadoUsuarios").show();
            $("#bienvenida").html(usuarioLogueado.nombreCompleto);
        } else { // Se muestran las funciones para los colaboradores
            $("#txtUsuarioLogin").val("");
            $("#txtClaveLogin").val("");
            // Mostrar Menu
            ocultarTodo();
            $("#menuAdmin").show();
            $("#mnuListarUsuarios").show();
            $("#mnuRegistrarReceta").show();
            $("#mnuCatalogoRecetas").show();
            $("#mnuCerrarSesion").show();
            $("#mnuListadoColaboradores").hide();
            $("#mnuRegistrarUsuario").hide();
            $("#mnuEstadoUsuarios").hide();
            $("#mnuReportes").show();
            mostrarCatalogo();
            $("#bienvenida").html(usuarioLogueado.nombreCompleto);
            $("#Buscador").show();
        }

    } else {
        $("#mensajesLogin").html("El usuario y/o clave son incorrectos");
    }
}

function verificarLogin(nomUsuario, contraseña) { // Se chequea si el colaborador o admin esta registrado
    let ok = false;
    let pos = 0;
    while (pos < listaUsuarios.length && !ok) {
        let objeto = listaUsuarios[pos];
        if (objeto.nombreUsuarioFinal == nomUsuario && objeto.password == contraseña) {
            ok = true;
            usuarioLogueado = objeto;
        }
        pos++
    }
    return ok;
}

// ---------------------------------------
//            CREAR USUARIO
//----------------------------------------

function nuevoUsuario() { // Funcion que crea el usuario
    $("#mensajesRegistrarUsuario").html("");
    let nombreUsuario = $("#txtNombreUsuario").val();
    let apellidoUsuario = $("#txtApellido").val();
    let password = $("#txtClave").val();
    let nombreUsuarioFinal = nombreUsuario[0] + apellidoUsuario;

    if (password.length == 0) {

        $("#mensajesRegistrarUsuario").html("La contraseña no puede estar vacia");

    } else {

        if (existeUsuario(nombreUsuarioFinal)) { // Se chequea que el nombre de usuario no exista y si existe, se crea uno nuevo

            let nomUsuario = chequearNombre(nombreUsuarioFinal);
            usuarioRepetido = new Usuario(nombreUsuario, nomUsuario, apellidoUsuario, unaClave, false, true);
            agregarUsuario(usuarioRepetido);
            $("#txtNombreUsuario").val("");
            $("#txtApellido").val("");
            $("#txtClave").val("");
        }
        else { // Se crea usuario ya que no existe un nombre de usuario repetido
            let usuarioACrear = new Usuario(nombreUsuario, nombreUsuarioFinal, apellidoUsuario, unaClave, false, true);

            agregarUsuario(usuarioACrear);
            $("#txtNombreUsuario").val("");
            $("#txtApellido").val("");
            $("#txtClave").val("");
        }

        $("#mensajesRegistrarUsuario").html("Usuario creado correctamente");
    }
}

function chequearNombre(nombre) { // Se chequea que el nombre de usuario

    for (let usuario of listaUsuarios) {
        if (usuario.nombreUsuarioFinal == nombre) {
            nombre = cambiarNombre(nombre);
        }
    }
    return nombre;
}

function cambiarNombre(nombreAChequear) { // Se cambia el nombre de usuario

    nombreAChequear = nombreAChequear + "1"; 
    let nombreChequeado = chequearNombre(nombreAChequear)
    return nombreChequeado;
}


function agregarUsuario(usuario) { // Se agrega el usuario al array

    nombreUsuario = usuario.nombreUsuario.toLowerCase();
    nombreUsuarioFinal = usuario.nombreUsuarioFinal.toLowerCase();
    apellidoUsuario = usuario.apellidoUsuario.toLowerCase();
    unaClave = usuario.password.toLowerCase();
    esAdministrador = usuario.esAdministrador;
    habilitado = usuario.habilitado;
    //Defino el array asociativo / Objeto
    let unUsuario = new Usuario(nombreUsuario, nombreUsuarioFinal, apellidoUsuario, unaClave, esAdministrador, habilitado);
    // Agregar el Objeto a la lista
    listaUsuarios.push(unUsuario);
}

function existeUsuario(nombreUsuario) { // Se chequea que el usuario no exista

    let existe = false;
    let pos = 0;
    while (pos < listaUsuarios.length && !existe) {

        let objeto = listaUsuarios[pos];
        if (objeto.nombreUsuarioFinal == nombreUsuario) {
            existe = true;
        }
        pos++
    }
    return existe;
}

// ---------------------------------------
//            CREAR RECETA
//----------------------------------------

function nuevaReceta() {

    let unTitulo = $("#txtTitulo").val();
    let descripcion = $("#txtDescripcion").val();
    let unaDuracion = parseInt($("#txtDuracion").val());
    let foto = $("#txtFoto").val();
    foto = obtenerNombreArchivo(foto)
    let mensajeError = validarReceta(unTitulo, descripcion, unaDuracion, foto);

    if (mensajeError == "") { // Esta correcta la validación

        autor = usuarioLogueado;
        agregarReceta(unTitulo, descripcion, autor, unaDuracion, foto, 0, 0);
        $("#txtTitulo").val("");
        $("#txtDescripcion").val("");
        $("#txtDuracion").val("");
        $("#txtFoto").val("");
        $("#mensajesRegistrarReceta").html("");
        $("#registroReceta").hide();
        listarRecetas();
        $("#catalogoRecetas").show();
    }
    else {
        $("#mensajesRegistrarReceta").html(mensajeError);
    }
}

function agregarReceta(unTitulo, descripcion, autor, unaDuracion, foto, meGusta, noMegusta) {
    let id = new String(listaRecetas.length + 1);
    //Defino el array asociativo / Objeto
    let unaReceta = new Receta(unTitulo, descripcion, autor, unaDuracion, foto, id, meGusta, noMegusta);
    // Agregar el Objeto a la lista
    listaRecetas.unshift(unaReceta); //funcion unshift, para pushear en el primer lugar.
}

function validarReceta(unTitulo, descripcion, unaDuracion, foto) {

    let mensaje = ""
    if (unTitulo == "") {
        mensaje += "El titulo de la receta no puede ser vacío<br>";
    }
    if (descripcion == "") {
        mensaje += "La descripción no puede ser vacía<br>";
    }
    if (descripcion.length >= 150) {
        mensaje += "La descripción no puede tener mas de 150 caracteres<br>";
    }
    if (unaDuracion == 0) {
        mensaje += "La duración no puede ser vacía<br>";
    }
    if (foto == "") {
        mensaje += "Debe agregar una foto<br>";
    }
    return mensaje;
}

function obtenerNombreArchivo(pathCompleto) { // Se obtiene la ubicacion de la foto seleccionada por el usuario
    
    let posicionUltimaBarra = pathCompleto.lastIndexOf("\\");
    let resultado = pathCompleto.substring(posicionUltimaBarra + 1);
    return resultado;
}

function listarRecetas() { // Funcion que lista todas las recetas
    let auxListaOrdenada = []; // Se crea lista auxiliar para ordenar las recetas

    $("#catalogoRecetas").empty();
    for (unaReceta of listaRecetas) {
        // Una receta es de clase Receta, que tiene dentro autor que es de clase usuario. Usuario tiene el detalle si es administrador.
        if (unaReceta.autor.esAdministrador) {
            auxListaOrdenada.unshift(unaReceta); // Se pushea las recetas del admin al inicio del array para que se vean primero
        } else {
            auxListaOrdenada.push(unaReceta); 
        }
    }

    listaRecetas = auxListaOrdenada;

    for (let pos = 0; pos < listaRecetas.length; pos++) {
        let unaReceta = listaRecetas[pos];

        if (unaReceta.autor.habilitado) {
            agregarEnCatalogoHTML(unaReceta, pos);
        }
    }
}

function actualizarRecetas() { // Solo refresca la vista de las recetas, no las ordena de ninguna manera.
    $("#catalogoRecetas").html("");
    for (let pos = 0; pos < listaRecetas.length; pos++) {
        let unaReceta = listaRecetas[pos];
        agregarEnCatalogoHTML(unaReceta, pos);
    }
}

function agregarEnCatalogoHTML(unaReceta, posEnLista) { // Funcion que agrega el html de la receta
    let textoHTML = "<div class='catalogoRecetario'>";
    textoHTML += "<hr>";
    textoHTML += "<h2>" + unaReceta.titulo + "</h2>";
    textoHTML += "<h4>Id:" + unaReceta.id + "</h4>";
    textoHTML += "<img class='afiche' src='Recetas/" + unaReceta.foto + "' alt='" + unaReceta.titulo + "'>";
    textoHTML += "<p class='duracion'><strong>" + unaReceta.duracion + "</strong> minutos</p>";
    textoHTML += "<p>";
    textoHTML += unaReceta.descripcion;
    textoHTML += "</p>";
    textoHTML += "<p class='likes'>";
    textoHTML += unaReceta.meGusta;
    textoHTML += "<img class='likes'  id='" + "x" + unaReceta.id + "' src='imagenesMeGusta/meGusta.jpg'>";
    textoHTML += unaReceta.noMeGusta;
    // Se agrega un x en el id para que el identificador no se repita
    textoHTML += "<img class='likes' id='" + posEnLista + "' src='imagenesMeGusta/noMeGusta.jpg'>";
    textoHTML += "</p>";
    textoHTML += "<h5>Publicado por: " + unaReceta.autor.nombreUsuarioFinal + " </h5>"
    textoHTML += "<hr>";
    textoHTML += "</div>";
    $("#catalogoRecetas").append(textoHTML);
    $("#x" + unaReceta.id).click(meGusta);
    $("#" + posEnLista).click(noMeGusta);
}
// ----------------------------------------------------------------
//                      FUNCION ME GUSTA
//-----------------------------------------------------------------

function meGusta() {
    let imagen = $(this); // Me guardo cual fue el elemento sobre el que se hizo clic
    let auxId = imagen.attr("id");  // El id tiene un x adelante para que no se repita el identificador
    let id = parseInt(auxId.substring(1, auxId.length)); // Se identifica el id

    for (receta of listaRecetas) {
        if (id == receta.id) {
            aumentarMeGustaReceta(receta)// Le pido a la receta que aumente su cantidad de likes
        }
        actualizarRecetas(); // Actualizo el catalogo para que quede actualizado con los likes
    }
}

function noMeGusta() {
    let imagen = $(this);
    let posEnLista = parseInt(imagen.attr("id"));
    let receta = listaRecetas[posEnLista];  // Obtengo el objeto receta en la posicion 
    aumentarNoMeGustaReceta(receta); // Le pido a la receta que aumente su cantidad de likes
    actualizarRecetas(); // Actualizo el catalogo para que quede actualizado con los likes
}

function aumentarMeGustaReceta(receta) { // Funcion que aumenta la cantidad de me gusta
    receta.meGusta = receta.meGusta + 1;
}

function aumentarNoMeGustaReceta(receta) { // Funcion que aumenta la cantidad de no me gusta
    receta.noMeGusta = receta.noMeGusta + 1;
}

// ----------------------------------------------------------------
//          LISTA DE COLABORADORES CON ADMIN INCLUIDO
//-----------------------------------------------------------------

function listarUsuarios() { // Funcion que crea una tabla y lista todos los usuarios
    ocultarTodo();
    $("#menuAdmin").show();
    $("#listadoUsuarios").show();
    $("#listaUsuarios").empty();
    $("#Buscador").hide();
    // Ttulo + Cabezal
    $("#listaUsuarios").append("<caption><big><strong>Lista de Usuarios</strong></big></caption>");
    $("#listaUsuarios").append("<tr><th>Usuario</th><th>Nombre</th><th>Apellido</th></tr>");
    //  Datos
    for (let usuario of listaUsuarios) {
        $("#listaUsuarios").append("<tr><td>" + usuario.nombreUsuarioFinal + "</td><td>" + usuario.nombreUsuario + "</td><td>" + usuario.apellidoUsuario + "</td></tr>");
    }
}

// ----------------------------------------------------------------
//        LISTA BUSCADOR POR NOMBRE DE RECETA O DESCRIPCION
//-----------------------------------------------------------------

function listarRecetasBuscador() { // Funcion que busca receta por nombre o descripcion

    $("#parrafoBuscador").html("");
    $("#catalogoRecetas").show();
    $("#catalogoRecetas").empty();

    let nombreRecetaBuscada = $("#txtRecetaBuscador").val();
    for (let pos = 0; pos < listaRecetas.length; pos++) {
        let unaReceta = listaRecetas[pos];
        if (unaReceta.titulo.toLowerCase().includes(nombreRecetaBuscada.toLowerCase()) || unaReceta.descripcion.toLowerCase().includes(nombreRecetaBuscada.toLowerCase())) {
            agregarEnCatalogoHTML(unaReceta, pos);
        }
    }
    if ($("#catalogoRecetas").html() == "") {
        $("#parrafoBuscador").html("No se encontraron resultados");
    }
}

//-----------------------------------------------------------
//                      REPORTES
//-----------------------------------------------------------

function mostrarReportes() { // Se muestra el listado de reportes

    ocultarTodo();
    $("#menuAdmin").show();
    $("#reportes").show();
    $("#catalogoRecetasPorTiempo").html("");
    $("#catalogoRecetasPorTiempo").show();
}

function buscadorSegunTiempo() { // Muestra las recetas con el tiempo determinado

    ocultarTodo();
    $("#menuAdmin").show();
    $("#buscadorSegunTiempo").show();
    $("#catalogoRecetasPorTiempo").show();
}

function buscadorPorTiempo() { // Muestra las recetas con el tiempo determinado

    auxRecetasConElTiempo = [];
    $("#parrafoBuscadorSegunTiempo").html("");
    $("#catalogoRecetasPorTiempo").html("");
    let duracionRecetaBuscada = $("#txtBuscarTiempo").val();

    for (receta of listaRecetas) {
        // Una receta es de clase Receta, que tiene dentro autor que es de clase usuario. Usuario tiene el detalle si es administrador.
        if (receta.duracion == duracionRecetaBuscada) {
            auxRecetasConElTiempo.push(receta);
        }
    }

    for (let pos = 0; pos < auxRecetasConElTiempo.length; pos++) {
        let unaReceta = auxRecetasConElTiempo[pos];
        agregarEnCatalogoPorTiempoHTML(unaReceta);
    }

    if ($("#catalogoRecetasPorTiempo").html() == "") {
        $("#parrafoBuscadorSegunTiempo").html("No se encontraron resultados");
    }
}

function agregarEnCatalogoPorTiempoHTML(unaReceta) {  // Funcion que agrega el html de la receta en seccion reportes
    let textoHTML = "<div class='catalogoRecetario'>";
    textoHTML += "<hr>";
    textoHTML += "<h2>" + unaReceta.titulo + "</h2>";
    textoHTML += "<h4>Id:" + unaReceta.id + "</h4>";
    textoHTML += "<img class='afiche' src='Recetas/" + unaReceta.foto + "' alt='" + unaReceta.titulo + "'>";
    textoHTML += "<p class='duracion'><strong>" + unaReceta.duracion + "</strong> minutos</p>";
    textoHTML += "<p>";
    textoHTML += unaReceta.descripcion;
    textoHTML += "</p>";
    textoHTML += "<p class='likes'>";
    textoHTML += unaReceta.meGusta;
    textoHTML += "<img class='likes' src='imagenesMeGusta/meGusta.jpg'>";
    textoHTML += unaReceta.noMeGusta;
    // Se agrega un x en el id para que el identificador no se repita
    textoHTML += "<img class='likes' src='imagenesMeGusta/noMeGusta.jpg'>";
    textoHTML += "</p>";
    textoHTML += "<h5>Publicado por: " + unaReceta.autor.nombreUsuarioFinal + " </h5>";
    textoHTML += "<hr>";
    textoHTML += "</div>";
    $("#catalogoRecetasPorTiempo").append(textoHTML);
}

function buscadorSegunDuracion() {

    ocultarTodo();
    $("#menuAdmin").show();
    buscadorPorDuracion();
    $("#catalogoRecetasPorTiempo").show();
}

function buscadorPorDuracion() { // Se busca la receta con maximo tiempo de duracion

    $("#catalogoRecetasPorTiempo").html("");
    let maxTiempo = 0;
    let maxReceta = [];

    for (receta of listaRecetas) {
        if (receta.duracion >= maxTiempo) {
            maxTiempo = receta.duracion;
        }
    }

    for (receta of listaRecetas) {
        if (receta.duracion == maxTiempo) {
            maxReceta.push(receta);
        }
    }

    for (receta of maxReceta) {
        agregarEnCatalogoPorTiempoHTML(receta);
    }

    if ($("#catalogoRecetasPorTiempo").html() == "") {
        $("#parrafoBuscadorSegunTiempo").html("No se encontraron resultados");
    }
}

function recetasSegunLikes() {

    ocultarTodo();
    $("#menuAdmin").show();
    buscadorPorLikes();
    $("#catalogoRecetasPorTiempo").show();
}

function buscadorPorLikes() { // Se busca la receta con mayor porcentaje de likes
    let maxPercent = 0;
    let maxReceta = [];

    $("#catalogoRecetasPorTiempo").html("");

    for (receta of listaRecetas) {

        let percent = receta.meGusta / (receta.meGusta + receta.noMeGusta)

        if (percent >= maxPercent) {
            maxPercent = percent;
        }
    }

    for (receta of listaRecetas) {
        let percent = receta.meGusta / (receta.meGusta + receta.noMeGusta)

        if (maxPercent == percent) {
            maxReceta.push(receta);
        }
    }

    $("#catalogoRecetasPorTiempo").html("Tiene un rendimiento de : " + "<p><big><strong>" + maxPercent * 100 + " %" + "</strong></big></p>");
    for (receta of maxReceta) {
        agregarEnCatalogoPorTiempoHTML(receta);
    }
}

// -------------------------------------------------------------------------------------------
//                           ESTADOS DE LOS USUARIOS
//--------------------------------------------------------------------------------------------

function estadosUsuarios() {

    listaEstadoUsuarios();
    $("#menuAdmin").show();
}

function listaEstadoUsuarios() { // Tabla que usa el chef para habilitar o deshabilitar los colaboradores

    ocultarTodo();
    $("#menuAdmin").show();
    $("#listadoUsuarios").show();
    $("#listaUsuarios").empty();
    $("#Buscador").hide();
    // Ttulo + Cabezal
    $("#listaUsuarios").append("<caption><big><strong>Estado de Usuarios</strong></big></caption>");
    $("#listaUsuarios").append("<tr><th>Usuario</th><th>Nombre</th><th>Apellido</th><th>Estado</th><th>Cambiar</th></tr>");
    //  Datos
    for (let usuario of listaUsuarios) {
        let estado = "";
        let imagen = "";
        if (usuario.habilitado) {
            estado = "Habilitado";
            imagen = "meGusta";
        } else {
            estado = "No Habilitado";
            imagen = "noMeGusta";
        }
        $("#listaUsuarios").append("<tr><td>" + usuario.nombreUsuarioFinal + "</td><td>" + usuario.nombreUsuario + "</td><td>" + usuario.apellidoUsuario + "</td><td>" + estado + "</td><td>" + "<img class='likes'" + "id='" + usuario.nombreUsuarioFinal + "' src='imagenesMeGusta/" + imagen + ".jpg'>" + "</td></tr>");
        $("#" + usuario.nombreUsuarioFinal).click(cambiarEstadoUsuario);
    }

    function cambiarEstadoUsuario() {
        let imagen = $(this); // Me guardo cual fue el elemento sobre el que se hizo clic
        let userNombre = imagen.attr("id"); // Se identifica el usuario.

        for (usuario of listaUsuarios) {
            if (userNombre == usuario.nombreUsuarioFinal) {
                usuario.habilitado = !usuario.habilitado; // Se le cambia el valor al true o false del estado
            }
        }

        // Se le cambia el estado del usuario dentro de las recetas.
        for (receta of listaRecetas) {
            if (receta.autor.nombreUsuarioFinal == userNombre) {
                receta.autor.habilitado = !receta.autor.habilitado
            }
        }

        listaEstadoUsuarios(); // Actualizo el listado de usuario.
    }
}

// -------------------------------------------------------------------------------------------
//  SE AGREGA EL ADMINISTRADOR, ALGUNA RECETA EN CATALOGO Y ALGUN USUARIO AL CARGAR LA PAGINA
//--------------------------------------------------------------------------------------------

function agregarAdministrador() {
    let admin = new Usuario("chef", "chef", "chef", "chef-01", true, true);
    agregarUsuario(admin);
    agregarReceta("Pollo al Horno con Papas", "Lo que vamos a hacer va a ser cocinar este ave con su guarnición, todo a la vez, provocando que sus propios jugos se mezclen con esta guarnición y obteniendo una receta espectacular. <br>  <br> INGREDIENTES PARA 4 PERSONAS: <br> 1 pollo entero o 4 muslos completos <br>  4 patatas medianas  <br> 4 cebollas medianas aceite de oliva sal y pimientaTomillo seco  <br> ", admin, 30, "PolloAlHornoConPapas.jpg", 15, 1);
    agregarReceta("Lentejas Con Verduras", "Las lentejas con verduras es una de las recetas de cocina básica, más fácil, barata y sana de todas las que existen. Tiene tan solo un puñado de ingredientes (a variar según gustos) y todos muy baratos. Además, bien son sabidos los beneficios de las legumbres en el organismo, sumado a las verduras.", admin, 25, "lentejasConVerduras.jpg", 20, 5);
    agregarReceta("Conejo al Horno con Papas", "El conejo es una carne sin apenas grasa, lo cual la convierte en una de las carnes más saludables que existen. Además no está falto de proteínas – alrededor de 21g por cada 100g de carne –  ni de vitamina B. El punto débil de esta carne es que puede llegar a resultar algo insípida. Pero eso tiene fácil solución. Seremos un poco más generosos a la hora de echar sal. Además, también echaremos vino blanco, pimienta negra recién molida y hierbas aromáticas.", admin, 23, "conejoAlHornoConPapas.jpg", 2, 5);
    agregarReceta("Aros de Cebolla", "pequeños (y también a muchos de los no tan pequeños, entre los que me incluyo) y que se suele servir en los propios establecimientos de comida rapida. Así que aquí aprenderemos a hacerlos caseros, siempre serán mejores que en cualquier lugar de comida rápida.", admin, 1, "arosDeCebolla.jpg", 15, 2);
    agregarReceta("Salmon al Horno con Verduras", "El salmon al horno con verduras es una deliciosa manera de preparar este pescado, con alto contenido de ácidos grasos Omega 3. Es una receta muy facil de hacer, rapida, saludable y que apenas conlleva esfuerzo. El horno se encargará de todo. A ver quién da más. Como resultado, obtendrás este cotizado pescado azul, acompañado de una deliciosa guarnición de verdura.", admin, 30, "salmonAlHornoConVerduras.jpg", 3, 5);
}

function precargarDatos() {

    agregarAdministrador();

    let santiagoBouvier = new Usuario("santiago", "sbouvier", "bouvier", "1234", false, true);
    agregarUsuario(santiagoBouvier);
    let santinoBouvier = new Usuario("santino", "sbouvier1", "bouvier", "1234", false, false);
    agregarUsuario(santinoBouvier);
    let santiagoCalcagno = new Usuario("santiago", "scalcagno", "calcagno", "1234", false, true);
    agregarUsuario(santiagoCalcagno);
    let pepeRodriguez = new Usuario("pepe", "prodriguez", "rodriguez", "1234", false, true);
    agregarUsuario(pepeRodriguez);
    let pabloGonzalez = new Usuario("pablo", "pgonzalez", "gonzalez", "1234", false, true);
    agregarUsuario(pabloGonzalez);
    let andreaLopez = new Usuario("andrea", "alopez", "lopez", "1234", false, false);
    agregarUsuario(andreaLopez);
    let veronicaSosa = new Usuario("veronica", "vsosa", "sosa", "1234", false, true);
    agregarUsuario(veronicaSosa);

    agregarReceta("Pizza de Jamon", "Prepara la masa de pizza casera que prefieras, podemos recomendarte esta masa de pizza fina y crujiente, si quieres hacer la pizza para la comida prepárala por la mañana y si quiere la pizza para cenar, ponte a prepararla a mediodía. Una vez hecha y reposada la masa de pizza el tiempo recomendado y acercándose la hora de comer o cenar, forma cuatro bolas de masa y extiende cada una con el rodillo. A continuación procede a cubrirlas. Extiende una generosa cucharada de tomate sobre la masa de pizza desde el centro, haciendo círculos, hasta el exterior. Una vez que la salsa cubra la masa de pizza reparte la berenjena previamente lavada, cortada en daditos y reposada con sal para quitarle el posible amargor.", pepeRodriguez, 5, "pizza1.png", 63, 17);
    agregarReceta("Pollo al Horno Con Verduras", "Es una opción muy saludable debido a que la carne de pollo es de las más saludables de todas las carnes que hay, las verduras que poco hay que decir de ellas y a que, el horneado es una de las técnicas de cocción más sanas. Así que ésta es una estupenda manera de comer carne de forma muy saludable. Veamos como hacer este pollo al horno con verduras. <br> INGREDIENTES PARA 4 PERSONAS:<br> 4 muslos de pollo completos <br> 2 patatas medianas <br> 3 zanahorias <br> 1 cebolla <br> 4 dientes de ajo <br> 1 pimiento verde <br> 1/2 pimiento rojo <br> Tomillo seco <br> sal y pimienta <br> Aceite", santiagoCalcagno, 25, "PolloAlHornoConVerduras.jpg", 41, 15);
    agregarReceta("Tacos Mexicanos", "Los tacos mexicanos son una popular receta de este país americano. Consiste en carne, generalmente de ternera (o res como lo llaman allí) o de pollo, cocinada junto a tomate y después introducida dentro de una tortilla de maíz o trigo. Finalmente se adereza con pico de gallo, una salsa típica del país.", andreaLopez, 1, "tacosMexicanos.jpg", 4, 5);
    agregarReceta("Banderillas de Salchicha", "Las banderillas de salchicha o corndogs, es una receta típicamente estadounidense. Consiste en una salchicha frankfurt, pinchada con una brocheta y envuelta con una tempura de harina de trigo y maíz, huevo y leche. Finalmente se fríe. Es muy barata y fácil de hacer y como aperitivo le viene excelente. Estos corndogs, concretamente, no van a llevar harina de maíz. ", andreaLopez, 7, "BanderillasDeSalchicha.jpg", 5, 8);
    agregarReceta("Espaguetis Carbonara", "Los espaguetis a la carbonara es probablemente la forma más internacional de preparar esta pasta. La auténtica salsa carbonara de italia contiene yema de huevo, queso y bacon. No tiene nata, ingrediente que le solemos añadir en España. Incluso hay muchas versiones que tan solo contienen nata.", andreaLopez, 10, "EspaguetiCarbonara.jpg", 23, 45);
    agregarReceta("Tortilla de Papa", "La tortilla de patatas rellena de queso y jamon, es un pasito más, de la típica tortilla de patatas española. En este caso lleva un relleno de jamón york y queso, tipo de sandwich. Aunque el relleno puede ser el que prefieras. Como salsa boloñesa, jamón serrano, chorizo, alguna hortaliza tales como lechuga, tomate y cebolla, como si fuese una ensalada o, en definitiva lo que te apetezca. En este caso, emplearemos el relleno más cocido de todos, el jamón y el queso", pepeRodriguez, 56, "tortillaDePapa.jpg", 23, 12);
    agregarReceta("Galletas de Manteca Caseras", "Las galletas de mantequilla caseras, son unas galletitas muy faciles de hacer y con pocos ingredientes. Yo las suelo hacer mucho en Navidad. Por eso, las galletitas de la foto, tienen formas navideñas (forma de estrella, de abeto y de campana). Para hacerlas,no necesitarás más que un puñado de ingredientes básicos y unos moldes. Y los moldes no son 100% indispensables. En caso de carecer con ellos, se pueden hacer con un vaso pequeño que tengas en casa. ", pepeRodriguez, 8, "galletasDeManteca.jpg", 34, 12);
    agregarReceta("Salmon a la Plancha", "El salmon a la plancha, es una manera muy fácil y sabrosa de preparar este delicioso pescado. Conserva todos sus aromas y sabores y además, lo tendremos listo en cuestión de minutos. El salmón es un alimento alto en proteínas y en ácidos grasos omega 3 lo cual, lo hace un alimento muy sano y apto para su consumo", santinoBouvier, 2, "SalmonALaPlancha.jpg", 23, 12);

    //RECETA PARA AGREGAR EN DEFENSA
  
    agregarReceta("Macarrones con Carne Picada y Tomate","Macarrones con carne picada y tomate. Una forma muy fácil y rápida de preparar pasta. Y también barata. Los tendrás listo en cuestión de 30 minutos. ¡Y el resultado será espectacular! Puedes preparar esta recete con otra pasta a tu gusto, como espagueti o tallarines. Sea como sea, probablemente termines untando en pan.",santiagoBouvier,6,"MacarronesConCarnePicadaYTomate.jpg",145,23);
    agregarReceta("vero sosa","Macarrones con carne picada y tomate. Una forma muy fácil y rápida de preparar pasta. Y también barata. Los tendrás listo en cuestión de 30 minutos. ¡Y el resultado será espectacular! Puedes preparar esta recete con otra pasta a tu gusto, como espagueti o tallarines. Sea como sea, probablemente termines untando en pan.",veronicaSosa,6,"MacarronesConCarnePicadaYTomate.jpg",145,23);
}