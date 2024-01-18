(function() {

    const agregarImagen = document.getElementById('imagen-nueva');
    const contenedorimagen = document.getElementById('foto-perfil');
    const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')
    agregarImagen.addEventListener('change', cambiarFotoPerfil);
    
    async function cambiarFotoPerfil() {
        const file = agregarImagen.files[0];
        const url= '/mi-perfil/agregar-imagen'
        
        if (file) {

            // Use FileReader to read the selected file as a data URL
            const reader = new FileReader();
            const formdata = new FormData()
            formdata.append('imagen', file)
    
            const respuesta = await fetch(url, {
               
                method: "POST",
                headers: {
                    'CSRF-Token': token
                },
                body:formdata,
            });

           
            if(respuesta.status){
                Swal.fire(
                    'Se agrego la iamgen',
                    'Imagen de perfil',
                    'success'
                   );
            }else{
                Swal.fire({
                    type:'error',
                    title:'Hubo un error',
                    text:'Vuelve a intentarlo'
                })
            }
            
    
            reader.onload = function (e) {
                // Set the source of the image to the data URL
                contenedorimagen.src = e.target.result;
            };
    
            // Read the selected file as a data URL
            reader.readAsDataURL(file);
        }
    }
    

})()