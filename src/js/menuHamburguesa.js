(function(){
    var click=false;
    document.addEventListener("DOMContentLoaded",function(event){
        const btnMenu= document.getElementById('btn-burger')
        btnMenu.addEventListener('click',mostrarMenu)
    });
   
    function mostrarMenu(){
        const menuBurguer= document.getElementById('menu-burger')
        if(click){
            menuBurguer.classList.add('hidden')
            click = false
        }else{
            menuBurguer.classList.remove('hidden')
            click = true
        }
        
    }

})()