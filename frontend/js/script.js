console.log("hola")


const contenedor=document.getElementById("contenedor");
contenedor.innerHTML="hola tarola"

/*fetch("http://localhost:8080/",{
    method : "GET",
    mode: 'no-cors'
})
.then(resultado => console.log(resultado))
.then(respuesta => {
    console.log(respuesta)
})*/


const getPokemon = () => {
    //You can use name, number, type, or ability in the url. 
    //Example: pokemon/ditto/, pokemon/1/, type/3/ or ability/4/.
    fetch(`http://localhost:8080/`,{
        method: 'GET',
        mode: 'no-cors',
        credentials: 'same-origin',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    })
      .then(response => console.log(response.json()))
      .then(data => {console.log(data)})
  }

  getPokemon()