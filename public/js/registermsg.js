window.onload = function() {

    var success = document.getElementById("hidden").textContent
    console.log(success)
    if (success == "true"){
        setTimeout(function(){
                window.location.href = "/login"
        }, 3000)
    }else if (success == "false"){
        setTimeout(function(){
                window.location.href = "/register"
        }, 3000) 
    }
}