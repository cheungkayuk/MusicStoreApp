window.onload = function() {
    console.log("loaded")
    
    const ContentRenderer = {
        Music : {},
        Cart : [],
        mainframe : document.getElementById("mainframe"),
        username : document.getElementById("username").textContent,
        loadcart : function(data) {
            this.Cart = data
        },

        loadmusics : function(data) {
            this.Music = data
        },

        render : function() {
            let totalprice = 0
            for (let i=1; i<this.Cart.length; i++)
            {
                if (this.Cart[i] == 0)
                {
                    continue
                }

                totalprice += this.Music[i-1].Price * this.Cart[i]
                let mainframe = document.getElementById("mainframe")

                let itemblock = document.createElement("div")
                itemblock.className = "itemblock"

                let detail = document.createElement("p")

                detail.innerHTML = "Music Name: " + this.Music[i-1].MusicName +  "<br>" +
                                   "Quantiy: " + this.Cart[i]
                

                let deletebutton = document.createElement("a")
                deletebutton.className="deletebutton"

                deletebutton.textContent = "Delete"
                deletebutton.href = `/cart/remove/${this.Music[i-1].MusicId}`

             
                itemblock.appendChild(detail)
                itemblock.appendChild(deletebutton)
                mainframe.append(itemblock)
                
            }
            let pricetext = document.getElementById("price")        
            pricetext.textContent = `Total Price = $ ${totalprice}`   
            
            let checkoutbutton = document.getElementById("checkoutbutton")
            if (totalprice > 0){
                checkoutbutton.style.display = ""
            }else{
                // checkoutbutton.style.display = "none"
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
        }
    }

    ContentRenderer.useroption()

    var searchbutton = document.getElementById("searchbutton")
    var searchbar = document.getElementById("searchbar") 
    searchbutton.addEventListener("click", function(event){
        window.location.href= `/search/${searchbar.value}`
    })


    fetch(`/getcart`)
        .then ( (res) => {
            if (res.ok){
                console.log("SUCCESS")
                return res.json()
            }
        })
        .then ( (data) => {
            console.log(data)
            ContentRenderer.loadcart(data)
            // if (ContentRenderer.Music.length)
            //     ContentRenderer.render()
            
        })
        .catch(err => {
            console.log('Error caught, ',err);
        });

    fetch(`/content`)
        .then ( (res) => {
            if (res.ok){
                console.log("SUCCESS")
                return res.json()
            }
        })
        .then ( (data) => {
            console.log(data)
            ContentRenderer.loadmusics(data)
            if (ContentRenderer.Cart)
                ContentRenderer.render()
            
        })
        .catch(err => {
            console.log('Error caught, ',err);
        });
}