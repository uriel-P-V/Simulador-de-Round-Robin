function crearProcesos(id){
    lastId = id;
    const tiempo = randomNumber(9, 19);
    const operacion = generarOperacion();
    
    const errores = validar(operacion);

    if(isEmpty(errores)){
        const proceso =  new Proceso(
                            id, 
                            tiempo, 
                            operacion, 
                            Number(randomNumber(6, 25))); //size
        proceso.RealizarOperacion();
        return proceso;
    }
    else{
        crearProcesos(id);
    }
}


function generarOperacion(){
    let operacion;
    const operado1 = randomNumber();
    const operado2 = randomNumber();
    switch(randomNumber(1, 6)){
        case 1:
            operacion = '+'
            break;
        case 2:
            operacion = '-'
            break;
        case 3:
            operacion = '/'
            break;
        case 4:
            operacion = '*'
            break;
        case 5:
            operacion = '%'
            break;
        case 6:
            operacion = 'x'
            break;
    }
    return `${operado1}${operacion}${operado2}`;
}


function actualizarProcesosListos(){
    const tablaProceso = document.querySelector('#loteProceso');
    tablaProceso.innerHTML = ` `;
    
    // Mostrar solo los primeros cinco elementos de procesosListos
    const primerosCincoProcesos = procesosListos.slice(0, 5);

    primerosCincoProcesos.forEach(process=>{
        const row = document.createElement('TR');
        row.innerHTML = ` 
            <td>${process.id}</td>
            <td>${process.tiempoEstimado}</td>
            <td>${process.servicio}</td>
        `;
        tablaProceso.appendChild(row);
    })
}


function Terminados(proceso){   
    const alert = document.querySelector('.alerta');
    const tbody  = document.querySelector('#procesoTerminado');
    const row = document.createElement('TR');
    alert.innerHTML = ` `;
    row.innerHTML = `
        <td>${proceso.id}</td>
        <td>${proceso.operacion}</td>
        <td>${proceso.resultado}</td>
    `;
    tbody.appendChild(row);
}

function actualizarPoceso(){
    const divProceso = document.querySelector('#procesoEjecucion');

    if(procesoActual == PROCESO_NULL && procesosBloqueados.length){
        divProceso.innerHTML = `
           <p>ID: <span>NULL</span></p>
           <p>Operacion: <span>NULL</span></p>
           <p>Tiempo Max. Estimado: <span>NULL</span></p>
           <p>Tiempo Restante: <span>NULL</span></p>
           <p>Tiempo Transcurrido: <span>NULL</span></p>
           <p>Quantum: <span id="VQuantium">NULL</span></p>
        `;
    }else{
        divProceso.innerHTML = `
           <p>ID: <span>${procesoActual.id}</span></p>
           <p>Operacion: <span>${procesoActual.operacion}</span></p>
           <p>Tiempo Max. Estimado: <span>${procesoActual.tiempoEstimado}</span></p>
           <p>Tiempo Restante: <span>${procesoActual.remain}</span></p>
           <p>Tiempo Transcurrido: <span>${procesoActual.servicio}</span></p>
           <p>Quantum: <span id="VQuantium"></span></p>
        `;
    }
}

function createFinalTable(){
    const tablaProceso = document.querySelector('#final');
    const div = document.querySelector('.contenedor--grid');
    div.style.display = 'block';


    procesosTerminados.forEach(process=>{
        process.calcularTiempos();
        const row = document.createElement('TR');
        row.innerHTML = ` 
            <td>${process.id}</td>
            <td>${process.operacion}</td>
            <td>${process.resultado}</td>
            <td>${process.tiempoEstimado}</td>
            <td>${process.llegada}</td>
            <td>${process.finalizo}</td>
            <td>${process.retorno}</td>
            <td>${process.respuesta}</td>
            <td>${process.espera}</td>
            <td>${process.servicio}</td>
        `;
        tablaProceso.appendChild(row);
    })
}

function createBCPTable(procesosBCP){
    const bcp = document.querySelector('#BCP');


    procesosBCP.forEach(process=>{
        process.calcularTiempos(GLOBAL_TIMER.currentCycle);
        const row = document.createElement('TR');
        row.classList.add(process.estado);
        row.innerHTML = ` 
            <td>${process.id}</td>
            <td>${process.estado}</td>
            <td>${process.operacion}</td>
            <td>${process.tiempoEstimado}</td>
            <td>${process.remain}</td>
            <td>${process.llegada}</td>
            <td>${process.finalizo}</td>
            <td>${process.retorno}</td>
            <td>${process.espera}</td>
            <td>${process.servicio}</td>
            <td>${process.respuesta}</td>
        `;
        bcp.appendChild(row);
    })
}

function actualizarBloqueados(){
    const tablaProceso = document.querySelector('#Bloqueados');
    tablaProceso.innerHTML = ` `;
    
    procesosBloqueados.forEach(process=>{
        const row = document.createElement('TR');
        row.innerHTML = ` 
            <td>${process.id}</td>
            <td>${process.bloqueado}</td>
        `;
        tablaProceso.appendChild(row);
    })
}
                       
//Obtiene los dos operandos y retorna el segundo para despues validar si es 0 
function validarOperando (operacion, operando){
    const operandos =  operacion.split(operando);
    return operandos[1];
}

function IsValidDivision(operacion){ //2/2
    const operador = operacion.match('[+-/%\*x]{1,1}') //Obtiene operacion +, -, *, 7, %
    if( operador[0] ==='/' || operador [0]==='%' ){
        const operando = validarOperando(operacion, operador);
        if(operando === '0'){
           return false;
        }
    }
    return true
}

function validar(operacion){
    let errores = []
    if(!IsValidDivision(operacion)) 
        errores.push('El formato de Division o Residuo no es valido.');
    return errores;
}

function isEmpty(array){
    return array.length === 0;
}

function randomNumber(min = 0, max=100){
    return Math.floor(Math.random() * (max - min)) + min;
}

const checkTime = (int) => {
    if (int < 10) { int = '0' + int };
    return int;
}

function drawMemorytable(){
    const table = document.querySelector('#memoria');
    let index = 0;
     for(let i= 0; i<17.5; i++){
         const row = document.createElement('tr');
         for(let j = 0; j<2 ; j++){
            const td = document.createElement('td');
            td.textContent = index;
            const tdProcess = document.createElement('td');
            tdProcess.textContent = '-';
            tdProcess.id = `process-${index}`;
            const tdBarra = document.createElement('td');
            tdBarra.className = 'tdBarra';
            const p = document.createElement('p');
            p.id=`info-${index}`;
            p.className = 'info';
            p.textContent = '0/5';

            const Barra = document.createElement('progress');
            Barra.id=`progress-${index}`;
            Barra.className = 'html5';
            Barra.max = 100;
            Barra.value = 0;

            tdBarra.append(Barra, p);
            row.append(td, tdProcess, tdBarra);
            ++index;
         }
         table.append(row);
     }
}