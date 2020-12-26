const button = document.getElementById('send');
const input = document.getElementById('title');
const list = document.getElementById('list');
const labels = document.getElementsByTagName('label');
let contador = 0;

button.addEventListener('click', () => {
    // Encontrar labels y facilitar su acceso
    for (var i = 0; i < labels.length; i++) {
        if (labels[i].htmlFor != '') {
            var elem = document.getElementById(labels[i].htmlFor);
            if (elem)
                elem.label = labels[i];         
        }
    }
    document.getElementById('MyFormElem').label.innerHTML = 'Look ma this works!'; //labels[0].innerHTML = "nice";
    contador += 1;
    const p = document.createElement('p');
    const texto = document.createTextNode(` ${contador}. ${input.value}`);
    p.appendChild(texto);
    p.addEventListener('click', () => {
        p.remove();
    })
    list.append(p);
})

input.addEventListener('change', () => {
    if (input.value == '' ||  input.value == null){
        button.setAttribute('disabled', '');
    } else {
        button.removeAttribute('disabled');
    }
})
