function archivos() {
var files = $("#subirimagen")[0].files;
var nombres = "";
for (var i = 0; i < files.length; i++)
{
    nombres = nombres + files[i].name + " ";
}
$('#nombreArchivos').text(nombres);
}