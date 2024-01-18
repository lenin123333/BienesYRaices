import { Dropzone } from 'dropzone'

const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')

Dropzone.options.imagen = {
    dictDefaultMessage: 'Sube tus imagenes aqui',
    acceptedFile: '.png,.jpg,.jpeg',
    maxFileSize: 5,
    maxFiles: 1,
    paralleUploads: 1,
    autoProcessQueue: false,
    addRemoveLinks: true,
    dictRemoveFile: 'Eliminar Archivo',
    dictMaxFilesExceeded: "El Limite es 1 Archivo",
    headers: {
        'CSRF-Token': token
    },
    paramName: 'imagen',
    init: function () {
        const dropzone = this
        const botonPublicar = document.querySelector('#publicar')
        botonPublicar.addEventListener('click', function () {
            dropzone.processQueue()
        })
        dropzone.on('queuecomplete', function () {
            if (dropzone.getActiveFiles().length == 0) {
                window.location.href = '/mis-propiedades'
            }
        })

    }
}
