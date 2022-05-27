window.onload = function() {
    console.log("loaded")
    
    const ContentRenderer = {
        Music : {},
        Cart : [],
        mainframe : document.getElementById("mainframe"),
        acusername : document.getElementById("username").textContent,
        comfirmbutton : document.getElementById("comfirmbutton"),
        desiredname : document.getElementById("desiredname"),
        desiredpassword : document.getElementById("desiredpassword"),
        usermsg : document.getElementById("usermsg"),

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

                detail.innerHTML = this.Cart[i] + " * Music Name: " + this.Music[i-1].MusicName +  "<br>" +
                                   "HK$ " + this.Cart[i]*this.Music[i-1].Price                                 
                

             
                itemblock.appendChild(detail)
                mainframe.append(itemblock)
                
            }
            let pricetext = document.getElementById("price")        
            pricetext.textContent = `Total Price = $ ${totalprice}`   

        },

       

        useroption : function() {
            let loginout = document.getElementById("loginout")
      

            if (this.acusername){
                loginout.textContent = "Logout"
                loginout.href= "/logout"
                let unlogin = document.getElementById("unlogin")
                unlogin.innerText = ""
            }else{
                loginout.textContent = "Login"
                loginout.href = "/login"
            
            }
        }
    }

    ContentRenderer.useroption()

    ContentRenderer.desiredname.onblur = function(){
        let userinput = ContentRenderer.desiredname.value
        if (userinput !== ""){
            fetch(`/checkac/${userinput}`)
                .then ( (res) => {
                    if (res.ok){
                        console.log("SUCCESS")
                        return res.json()
                    }
                })
                .then ( (data) => {
                    if (data)
                        ContentRenderer.usermsg.textContent = "Username Duplicated!"
                    else
                        ContentRenderer.usermsg.textContent = ""
                })
                .catch(err => {
                    console.log('Error caught, ',err);
                });
        }
    }

    ContentRenderer.desiredname.onclick = function(){
        ContentRenderer.usermsg.textContent = ""
    }

    
    ContentRenderer.comfirmbutton.addEventListener("click", function(event){
        event.preventDefault()
        if (!ContentRenderer.acusername){
            if ((ContentRenderer.desiredname.value=="")||(ContentRenderer.desiredpassword.value=="")){
                return
            }
        }
        let deliveryform = document.getElementById("deliveryform")
        
        if(!deliveryform.checkValidity())
            return

        const addressinfo = {fullname: deliveryform.fullname.value,
                            companyname: deliveryform.companyname.value,
                            addressline1: deliveryform.addressline1.value,
                            addressline2: deliveryform.addressline2.value,
                            city: deliveryform.city.value,
                            region: deliveryform.region.value,
                            country: deliveryform.country.value,
                            postcode: deliveryform.postcode.value}
  
        console.log(addressinfo)
        
        if(!ContentRenderer.acusername){
            if(ContentRenderer.usermsg.textContent==""){
                const accountinfo = {username: ContentRenderer.desiredname.value, password: ContentRenderer.desiredpassword.value}
                fetch('/register/state', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(accountinfo),
                })
                    .then ( (res) => {
                        if (res.ok){
                            console.log("SUCCESS")
                            return res.json()
                        }
                    })
                    .then ( (data) => {
                        console.log(data)
                        if (data){
                            fetchaddress(addressinfo)
                        }else{
                            ContentRenderer.usermsg.textContent = "Username Duplicated!"
                        }
                    })
                    .catch(err => {
                        console.log('Error caught, ',err);
                    });
                }
        }else{
            fetchaddress(addressinfo)
        }
    
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
        })
    
}

function fetchaddress(addressinfo){
    fetch('/checkout/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(addressinfo),
        })
        .then ( (res) => {
            if (res.ok){
                console.log("SUCCESS")
                return res.json()
            }
        })
        .then( (data) => {
            console.log(data)
            window.location.href = "/checkout/invoice"
        })
        .catch(err => {
            console.log('Error caught, ',err);
        });
}