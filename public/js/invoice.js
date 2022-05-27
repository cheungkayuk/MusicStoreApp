window.onload = function() {
    console.log("loaded")
    
    const ContentRenderer = {
        Cart : [],
        Address : {},
        Music : {},
        addresstext : document.getElementById("address"),

        loadcart : function(data) {
            this.Cart = data
        },

        loadmusics : function(data) {
            this.Music = data
        },
        
        
        render : function() {
            let cn = this.Address.companyname
            let al2 = this.Address.addressline2
            let rg = this.Address.region
            
            if (cn == "")
                cn = "NA"
            if (al2 == "")
                al2 = "NA"
            if (rg == "")
                rg = "NA"

            this.addresstext.innerHTML = `<b>Full Name:</b> ${this.Address.fullname} &emsp; <b>Company:</b> ${cn} <br>
                                          <b>Address Line 1:</b> ${this.Address.addressline1} <br>
                                          <b>Address Line 2:</b> ${al2} <br>
                                          <b>City:</b> ${this.Address.city} &emsp; <b>Region:</b> ${rg} &emsp; <b>Country:</b> ${this.Address.country} <br>
                                          <b>Postcode:</b> ${this.Address.postcode} <br>`

            let totalprice = 0
            for (let i=1; i<this.Cart.length; i++)
            {
                if (this.Cart[i] == 0)
                {
                    continue
                }

                totalprice += this.Music[i-1].Price * this.Cart[i]
                let mainframe = document.getElementById("order")

                let itemblock = document.createElement("div")
                itemblock.className = "itemblock"

                let detail = document.createElement("p")

                detail.innerHTML = this.Cart[i] + " * Music Name: " + this.Music[i-1].MusicName +  "<br>" +
                                    "HK$ " + this.Cart[i]*this.Music[i-1].Price                                 
                

            
                itemblock.appendChild(detail)
                order.append(itemblock)
                
            }
            let pricetext = document.getElementById("price")        
            pricetext.textContent = `Total Price : $ ${totalprice}`  
        },

       


    }
    fetch(`/getinvoiceaddress`)
        .then ( (res) => {
            if (res.ok){
                console.log("SUCCESS!!!!!!")
                
                return res.json()
            }
        })
        .then ( (data) => {
            console.log(data)
            ContentRenderer.Address = data
        })
        .catch(err => {
            console.log('Error caught, ',err);
        });

    fetch(`/getcart/invoice`)
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
            ContentRenderer.render()
        })
        .catch(err => {
            console.log('Error caught, ',err);
        });
}