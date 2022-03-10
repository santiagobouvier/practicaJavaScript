// Opcion B de definición de objetos

// Defino un concepto / tipo dato / plantilla - A ese Concepto le llamo CLASE

class Usuario {
    constructor(nombreUsuario,nombreUsuarioFinal,apellidoUsuario,unaClave,esAdministrador,habilitado){
        // Defino los atributos 
        this.nombreUsuario = nombreUsuario
        this.nombreUsuarioFinal = nombreUsuarioFinal;
        this.apellidoUsuario = apellidoUsuario;
        this.password = unaClave;
        this.esAdministrador = esAdministrador;
        this.habilitado = habilitado;
    }
}

let UltimoCodigoReceta = 0; // Autonumerado

class Receta {
    constructor(unTitulo,descripcion,autor,unaDuracion,foto,id,meGusta,noMeGusta){
       // UltimoCodigoReceta = UltimoCodigoReceta+1; // Incremento el autonumero y asigno al código de la receta
        //this.codigo = UltimoCodigoReceta;
        this.titulo = unTitulo;
        this.descripcion = descripcion;
        this.duracion = unaDuracion;
        this.foto = foto;
        this.autor=autor;
        this.id = id;
        this.meGusta = meGusta;
        this.noMeGusta = noMeGusta;
    }




}

class NombreReceta {
    constructor(nombreReceta,descripcionReceta){
        this.nombre = nombreReceta;
        this.descripcion = descripcionReceta;
    }
}



