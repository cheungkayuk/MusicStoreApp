window.onload = function() {
    console.log("loaded")
    var bttn = document.getElementById("bttn")
    
    const ContentRenderer = {
        Music : [],
        mainframe : document.getElementById("mainframe"),
        selectedcat : document.getElementById("select").textContent,
        username : document.getElementById("username").textContent,
        search : [],
        
        loaddata : function(data) {
            this.Music = data
        },

        render : function() {
            for (let i in this.Music)
            {
                if ((this.selectedcat !== "All Music")&&(this.search.length == 0))
                {
                    if(this.selectedcat !== this.Music[i].Category)
                    {
                        continue
                    }
                }

                if (this.search.length > 0)
                {
                    let skip = 1

                    for (let j in this.search)
                    {
                        if (this.Music[i].MusicName.includes(this.search[j]) || (this.Music[i].Composer.includes(this.search[j])) ){
                            skip = 0
                            break
                        }
                    }
                    if (skip){
                        continue
                    }
                }

                let block = document.createElement("div")
                block.className = "musicblock"

                let headimg = document.createElement("img")
                headimg.src = "/images/" + this.Music[i].img
                headimg.alt = "Image of " + this.Music[i].MusicName
                headimg.className = "headimg"
                headimg.onload = function(event){
              
                }
    
                let namebox = document.createElement("div")
                namebox.id = "namebox"

                let textblock = document.createElement("div")
                textblock.id = "textblock"

                let name = document.createElement("a")
                name.className = "musiclink"
                name.href = `/mainpage/music/${this.Music[i].MusicId}`
                name.textContent = this.Music[i].MusicName
                namebox.appendChild(name)

                let des = document.createElement("p")
                let str = ""
                let arr = ""
                if (this.Music[i].NewArrival == "Yes")
                {
                    arr += "<div class='arrival'> NEW ARRIVAL! </div>" 
                }
                
                str += "Composer: " + this.Music[i].Composer + "<br>" +
                       "Price: $ " + this.Music[i].Price + "<br>"




                des.innerHTML = arr + str                
                textblock.appendChild(des)

                block.appendChild(namebox)
                block.appendChild(headimg)
                block.appendChild(textblock)
                

                mainframe.appendChild(block)
            }
        },

        updatestatusline : function() {
            console.log(this.selectedcat)
            let hiddenarrow = document.getElementById("hiddenarrow")
            let selectedstatus = document.getElementById("selectedstatus")
            if (this.selectedcat == "All Music"){
                hiddenarrow.style.display = "none"
                selectedstatus.textContent = ""
                return
            }else if(this.selectedcat == "Classical"){
                hiddenarrow.style.display = "inline"
                selectedstatus.textContent = "Classical"
                selectedstatus.href = "/mainpage/category/classical"
            }else if(this.selectedcat == "Baroque"){
                hiddenarrow.style.display = "inline"
                selectedstatus.textContent = "Baroque"
                selectedstatus.href = "/mainpage/category/baroque"
            }else if(this.selectedcat == "Romantic"){
                hiddenarrow.style.display = "inline"
                selectedstatus.textContent = "Romantic"
                selectedstatus.href = "/mainpage/category/romantic"
            }else if(this.selectedcat == "Late 19th"){
                hiddenarrow.style.display = "inline"
                selectedstatus.textContent = "Late 19th"
                selectedstatus.href = "/mainpage/category/late19th"
            }
        },

        useroption : function() {
            let loginout = document.getElementById("loginout")
            let register = document.getElementById("register")

            if (this.username){
                loginout.textContent = "Logout"
                loginout.href= "/logout"
                register.textContent = ""
            }else{
                loginout.textContent = "Sign In"
                loginout.href = "/login"
                register.textContent = "Register"
                register.href = "/register"
            }
        },

        rerender : function() {
            let mainframe = document.getElementById("mainframe")
            mainframe.innerHTML = ""
            this.selectedcat = "All Music"
            this.updatestatusline()
            this.render()
        }
    }

    ContentRenderer.updatestatusline()
    ContentRenderer.useroption()
    
    var searchquery = document.getElementById("searchquery").textContent
    var searchbar = document.getElementById("searchbar")
    var searchbutton = document.getElementById("searchbutton")

    searchbar.addEventListener("keyup", function(event){
        if (event.keyCode === 13) {

            let field = document.getElementById("select")
            let hfield = document.getElementById("hiddenfield")
            if (searchbar.value == ""){
                ContentRenderer.search = []
                field.style.display = ""
                hfield.textContent = ""
            }else{
                ContentRenderer.search = searchbar.value.split(" ")
                console.log(ContentRenderer.search)
                field.style.display = "none"
                hfield.textContent = "Search Results"
            }
            ContentRenderer.rerender()
        }
    })

    searchbutton.addEventListener("click", function(event){     
        let field = document.getElementById("select")
        let hfield = document.getElementById("hiddenfield")
        if (searchbar.value == ""){
            ContentRenderer.search = []
            field.style.display = ""
            hfield.textContent = ""
        }else{
            ContentRenderer.search = searchbar.value.split(" ")
            console.log(ContentRenderer.search)
            field.style.display = "none"
            hfield.textContent = "Search Results"
        }
        ContentRenderer.rerender()  
    })


    fetch("/content")
        .then ( (res) => {
            if (res.ok){
                console.log("SUCCESS")
                return res.json()
            }
        })
        .then ( (data) => {
            console.log(data)
            ContentRenderer.loaddata(data)
            if (searchquery !== "")
            {
                let field = document.getElementById("select")
                let hfield = document.getElementById("hiddenfield")
                searchbar.value = searchquery
                ContentRenderer.search = searchbar.value.split(" ")
                console.log(ContentRenderer.search)
                field.style.display = "none"
                hfield.textContent = "Search Results"
                ContentRenderer.rerender()
            }else{
                ContentRenderer.render()
            }
            
        })
        .catch(err => {
            console.log('Error caught, ',err);
        });
}