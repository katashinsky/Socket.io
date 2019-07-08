
const socket = io('http://localhost:8000')
let nsSocket = ""

socket.on('nsList', (data) => {
    let namespacesDiv = document.querySelector('.namespaces');
    namespacesDiv.innerHTML = ""
    data.forEach(ns => {
        namespacesDiv.innerHTML += `<div class="namespace" ns=${ns.endpoint}><img src="${ns.img}"></div>`
    });

    document.querySelectorAll('.namespace').forEach((elem) => {
        elem.addEventListener('click', (e) => {
            const nsEndpoint = elem.getAttribute('ns')
        })
    })

    joinNs('/wiki')
})


