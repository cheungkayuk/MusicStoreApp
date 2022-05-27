window.onload = function() {
    var searchbutton = document.getElementById("searchbutton")
    var searchbar = document.getElementById("searchbar") 
    searchbutton.addEventListener("click", function(event){
        window.location.href= `/search/${searchbar.value}`
    })

    var username = document.getElementById("username")
    var password = document.getElementById("password")
    var okbutton = document.getElementById("okbutton")
    var errormsg = document.getElementById("error")
    okbutton.addEventListener("click", function(event){
        if ((username.value == "")||(password.value == ""))
        {
            event.preventDefault()
            errormsg.textContent = "Please do not leave the fields empty"
        }
    })
}