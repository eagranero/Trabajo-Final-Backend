
const socket = io();

socket.on("connect", () => {
  console.log("me conecte!");
});

socket.on("data-generica", (data) => {
  console.log(data);
});

socket.on("listadoChat", (data) => {
  console.log(data)
  const dataString = data.map(d=>`<div><span style='color:blue;font-weight:bold'> ${d.email} </span> <span style='color:brown'>${d.timeStamp}</span> <span style='font-style:italic'>${d.mensaje}</span></div>`);
  const html = dataString.reduce((html, item) => item + html,"");
  if(document.getElementById("div-chats")!=null) document.getElementById("div-chats").innerHTML = html;
 });

function enviar() {
  let date = new Date();
    const msg = document.getElementById("caja-msg").value;
    const tiempo = "["+date.toLocaleDateString() + " - " + date.toLocaleTimeString()+"]";
    socket.emit("msg-chat",{timeStamp:tiempo,email:"",tipo:"usuario",mensaje:msg})
  return false;
}

socket.on("listadoProductos", (data) => {
  const html = data.reduce((html, item) =>
  html+ 
  "<div style=\"border-style:solid; padding:20px ;margin:10px ;text-align:center; width:200px\">"
  +"<a style=\"text-decoration:none ; color:black\" href=\"/api/productos/"+item._id+"\">" 
  + "<h2>" + item.nombre + "</h2>"
  + "<h3>$" + item.precio + "</h3>"
  + "<h3>" + item.categoria + "</h3>"
  + "<h4>" + item.descripcion + "</h3>"
  + "<img style=\"width:200px\" src=\"" + item.thumbnail + "\"/>"
  +"</a>"
  + "<form method=\"post\"  action=\"carrito/agregaritem/"+item._id+"\" ><button style=\"margin-block: 10px;\" name=\"boton\" type=\"submit\" placeholder=\"Agregar al Carrito\">Agregar al Carrito</button></form>"  
  + "</div>","");
  if(document.getElementById("div-productos")!=null)
  document.getElementById("div-productos").innerHTML = html;
});