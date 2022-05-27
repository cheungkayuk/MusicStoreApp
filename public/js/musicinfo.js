window.onload = function() {
    console.log("loaded")
    var bttn = document.getElementById("bttn")
    
    const ContentRenderer = {
        Music : {},
        mainframe : document.getElementById("mainframe"),
        username : document.getElementById("username").textContent,
        loaddata : function(data) {
            this.Music = data
            // let musicid = document.getElementById("musicid")
        },

        render : function() {
    
            let imgdiv = document.getElementById("imglocation")
            let headimg = document.createElement("img")
            headimg.src = "/images/" + this.Music.img
            headimg.alt = "Image of " + this.Music.Composer
            headimg.className = "headimg"
            imgdiv.appendChild(headimg)

            let namebox = document.getElementById("musicname")
            namebox.textContent = this.Music.MusicName

            let des = document.getElementById("des")
            let str = ""
            let arr = ""
            if (this.Music.NewArrival == "Yes")
            {
                arr += "<div class='arrival'> NEW ARRIVAL! </div>" 
            }
            
            str += "Composer: " + this.Music.Composer + "<br>" +
                    "Published: " + this.Music.Published + "<br>" +
                    "Category: " + this.Music.Category + "<br>" +
                    "Description: " + this.Music.Description


            let price = document.getElementById("price")
            price.textContent = "Price: $ " + this.Music.Price
            des.innerHTML = arr + str                

        
            let musiclink = document.getElementById("musiclink")
            musiclink.textContent = this.Music.MusicName
            musiclink.href = `/mainpage/music/${this.Music.MusicId}`

            let music = document.getElementById("music")
            music.innerHTML = `<source src="/mp3/${this.Music.clip}" type="audio/mpeg" id="music">`
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


    let musicid = document.getElementById("musicid").textContent

    let orderbuttom = document.getElementById("orderbutton")
    let quantitybar = document.getElementById("quantitybar")



    orderbuttom.addEventListener("click", function(event){
        let quantity = quantitybar.value
        let id = ContentRenderer.Music.MusicId
        quantitybar.value = "0"
        if (quantity>0){
            console.log(`/order/${id}/${quantity}`)
            fetch(`/order/${id}/${quantity}`)
                .then ( (res) => {
                    if (res.ok){
                        console.log("SUCCESS")
                        window.location.href = "/mainpage/category/all";
                    }
                })
                .catch(err => {
                    console.log('Error caught, ',err);
                });
        }
    })

    fetch(`/content/${musicid}`)
        .then ( (res) => {
            if (res.ok){
                console.log("SUCCESS")
                return res.json()
            }
        })
        .then ( (data) => {
            console.log(data)
            ContentRenderer.loaddata(data)
            ContentRenderer.render()
            
        })
        .catch(err => {
            console.log('Error caught, ',err);
        });
}