
var btn = document.getElementById("btn")
var tableBody = document.querySelector("#studentTable tbody") 
btn.addEventListener("click", function (e) {
    e.preventDefault();
    var name = document.getElementById("name").value
    var age = document.getElementById("age").value
    var course = document.getElementById("course").value
    var email = document.getElementById("email").value
    
    // Use querySelector for CSS selectors like :checked
    var genderEl = document.querySelector('input[name="gender"]:checked')
    var gender = genderEl ? genderEl.value : ""

    var row = document.createElement("tr")
    row.innerHTML = '<td>' + name + '</td>'+
        '<td>' + age + '</td>' +
        '<td>' + course+ '</td>' +
        '<td>' + gender+ '</td>' +
        '<td>' + email+ '</td>' +
        '<td><button class="delete-btn" onclick="deleteRow(this)">Delete</button></td>'
    tableBody.append(row)
    
})

 function deleteRow(event) {
    event.parentElement.parentElement.remove();
 }