var mysql      = require('mysql');
var con = mysql.createConnection({
    host     : 'sophia.cs.hku.hk',
    user     : '',
    password : '',
    database : ''
});
con.connect(function(err) {
    if (err) throw err;
});

var userrecord
var musicrecord
  
const saveRecord = (result, loc) => {
    if (loc == 0)
        userrecord = result;
    else if (loc == 1)
        musicrecord = result
}

loadfromdb("login", 0)
loadfromdb("music", 1)

const express = require('express')
const app = express();
//const bodyParser = require('body-parser');

app.use(express.static("public"))
app.use(express.json())

app.set("view engine", "pug");
app.set("views", "views");

var session = require('express-session');
// const { query } = require('express');

app.use(session({secret: "musicapp"}));

app.use(express.urlencoded({extended: false}));

app.use("/", (req, res, next) => {
    next()
});

app.get("/login", (req, res) => {

    if ((req.query.action) && (req.query.action == "Logout")) {
        req.session.destroy((err) => {
    if (err)
        console.log("Cannot access session");
    });
    res.redirect("/login");
    } else {
    if (req.session.login)
        res.render("mainpage", {selectedcat: "All Music", username: req.session.login, cartnum: getcartnum(req.session.cart)});
    else
        res.render("login", {cartnum: getcartnum(req.session.cart)});
  }
});

app.post("/login", (req, res) => {

    if (req.session.login){
        res.redirect("/mainpage/category/all")
    }
    if (checklogin(req.body.username, req.body.password)) {
        req.session.login = req.body.username
        res.redirect("/mainpage/category/all")
    } else{
        if ((req.body.username)&&(req.body.password)){
            res.render("registermsg", {msg: "Invalid login, please login again.", success: "true"})
        }else{
            res.render("login", {msg: "Please do not leave the fields empty.", cartnum: getcartnum(req.session.cart)})
        }
    }
})

app.get("/register", (req, res) => {
    res.render("register", {cartnum: getcartnum(req.session.cart)})
})

app.post("/register/:option", (req, res) => {
    console.log("get register request!")
    console.log(req.body)
    if(req.body.username === undefined)
        res.end()
    loadfromdb("login", 0)
    let stop = 0
    for(let i = 0 ; i < userrecord.length ; i++)
    {   
        if (req.body.username == userrecord[i].UserId)
        {
            if (req.params.option=="path")
                res.render("registermsg", {msg: "Account already existed", success: "false"})
            else if(req.params.option=="state") 
                res.json(false)
            stop = 1
            break
        }
    }
    if (!stop){
        let query = `INSERT INTO login (UserId, PW) VALUES ("${req.body.username}", "${req.body.password}")`
        console.log(query)
        con.query(query, function (err, result) {
            if (err) throw err;
            console.log("1 record inserted");
            loadfromdb("login", 0)
            if (req.params.option=="path")
                res.render("registermsg", {msg: "Account created! Welcome", success: "true"})
            else if(req.params.option=="state"){
                req.session.login = req.body.username;
                res.json(true)
            }
        })
    }
})

app.get("/mainpage/category/:cat", (req, res) => {
    if (req.params.cat == "all"){
        res.render("mainpage", {selectedcat: "All Music", username: req.session.login, cartnum: getcartnum(req.session.cart)})
    }else if (req.params.cat == "classical"){
        res.render("mainpage", {selectedcat: "Classical", cartnum: getcartnum(req.session.cart), username: req.session.login})
    }else if (req.params.cat == "baroque"){
        res.render("mainpage", {selectedcat: "Baroque", cartnum: getcartnum(req.session.cart), username: req.session.login})
    }else if (req.params.cat == "romantic"){
        res.render("mainpage", {selectedcat: "Romantic", cartnum: getcartnum(req.session.cart), username: req.session.login})
    }else if (req.params.cat == "late19th"){
        res.render("mainpage", {selectedcat: "Late 19th", cartnum: getcartnum(req.session.cart), username: req.session.login})
    }
})

app.get("/mainpage/music/:id", (req, res) => {
    res.render("musicinfo", {musicid: req.params.id, username: req.session.login, cartnum: getcartnum(req.session.cart)})
})

app.get("/content", function(req, res){
    console.log("client reqest content");
    res.json(musicrecord);
})

app.get("/content/:id", function(req, res){
    console.log("client reqest content");
    res.json(musicrecord[req.params.id-1])
})

app.get("/order/:id/:quantity", function(req, res){
    if (!req.session.cart){
        req.session.cart = []
        for (let i = 1; i < musicrecord.length+1 ; i++)
        {
            req.session.cart[i] = 0
        }
    }

    if (req.params.quantity > 0){
        req.session.cart[req.params.id] += parseInt(req.params.quantity)
    }
    res.end()
})

app.get("/cart", function(req, res){
    if (!req.session.cart){
        req.session.cart = []
        for (let i = 1; i < musicrecord.length+1 ; i++)
        {
            req.session.cart[i]=0
        }
    }

    res.render("cart", {username:req.session.login, cartnum: getcartnum(req.session.cart)})
})

app.get("/getcart", function(req, res){
    console.log("client reqest cart")
    if (!req.session.cart){
        req.session.cart = []
        for (let i = 1; i < musicrecord.length+1 ; i++)
        {
            req.session.cart[i]=0
        }
    }
    res.json(req.session.cart)
})

app.get("/getcart/invoice", function(req, res){
    console.log("client reqest cart");
    let tempcart = []
    if (req.session.cart){
        for (let i=0; i<req.session.cart.length; i++)
        {
            tempcart[i] = req.session.cart[i]
        }
    }
    initcart(req.session.cart)
    res.json(tempcart)
})

app.get("/checkout/invoice", function(req, res) {
    res.render("invoice")
})

app.get("/cart/remove/:id", function(req, res){
    console.log("remove from cart")
    req.session.cart[req.params.id] = 0
    res.redirect("/cart")
})

app.get("/checkout", function(req, res){
    res.render("checkout", {username: req.session.login, cartnum: getcartnum(req.session.cart)})
})

app.get("/checkac/:name", function(req, res){
    if (checkacexist(req.params.name)){
        res.json(true)
    }else{
        res.json(false)
    }
})

app.get("/logout", function(req, res){
    res.render("logoutmsg")
})

app.get("/getinvoiceaddress", function(req, res){

    // setTimeout(function(){
    console.log(req.session.invoiceaddress)
    res.json(req.session.invoiceaddress)
    // }, 3000)
})


app.post("/checkout/submit", function(req, res){
    req.session.invoiceaddress=req.body
    console.log(req.session.invoiceaddress)
    
    res.json("ok")
})


app.get("/search/:query", function(req, res){
    res.render("mainpage", {selectedcat: "All Music", username: req.session.login, cartnum: getcartnum(req.session.cart), query: req.params.query})
})

app.get("/search/", function(req, res){
    res.redirect("/mainpage/category/all")
})

app.listen(8000, () => {
  console.log("Project app listening on port 8000!")
  console.log("Please access the page at localhost:8000/login ")
})




function checklogin(username, password){
    let success = false
    loadfromdb("login", 0)

    for (let i in userrecord)
    {
        let ac = userrecord[i]
        if (ac.UserId == username)
        {
            if (ac.PW == password){
                console.log("correct!")
                success = true
                break
            }else{
                break
            }
        }
    }
    return success;
}

function loadfromdb(table, loc){

    con.query(`SELECT * FROM ${table}`, function (err, result, fields) {
        if (err) throw err;
    
        saveRecord(result, loc)
      
    })
    
}

function getcartnum(cart){
    if (!cart){
        return 0
    }

    let num = 0
    for (let i = 1; i<musicrecord.length+1;i++)
    {
        num+=cart[i]
    }
    return num
}

function checkacexist(user){
    loadfromdb("login", 0)
    for (let i in userrecord)
    {
        let ac = userrecord[i]
        if (ac.UserId == user)
        {
            return true
        }
    }
    return false;
}

function initcart(cart){
    if (cart){
        for (let i = 0; i < cart.length;i++)
        {
            cart[i]=0
        }
    }
}