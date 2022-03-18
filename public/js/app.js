document.addEventListener('DOMContentLoaded',()=>{
    const skills = document.querySelector('.lista-conocimientos');

    let  alertas = document.querySelector('.alertas');

    if(alertas){
        limpiarAlertas();
    }

    if(skills){
        skills.addEventListener('click',agregarSkills);
        skillsSeleccionados();
    }
});
const skills = new Set();
const agregarSkills = e =>{
    if(e.target.tagName==='LI'){
        if(e.target.classList.contains('activo')){
            skills.delete(e.target.textContent);
            e.target.classList.remove('activo');
        }else{
            skills.add(e.target.textContent);
            e.target.classList.add('activo');
        }     
    }
    const skillArray=[...skills]
    document.querySelector('#skills').value = skillArray;
}

const skillsSeleccionados = () =>{
    const seleccionadas = Array.from(document.querySelectorAll('.lista-conocimientos .activo'));
    seleccionadas.forEach(seleccionada =>{
        skills.add(seleccionada.textContent);
    });
    const skillArray=[...skills]
    document.querySelector('#skills').value = skillArray;
}

const limpiarAlertas=()=>{
    let  alertas = document.querySelector('.alertas');
    const interval= setInterval(() => {
        if(alertas.children.length>0){
            alertas.removeChild(alertas.children[0]);
        }else if (alertas.children.length === 0){
            alertas.parentElement.removeChild(alertas);
            clearInterval(interval);
        }
    }, 2000);
    
}