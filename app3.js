const express=require('express')
const app=express()
 const {auth, requiresAuth}=require('express-openid-connect')
const res = require('express/lib/response')



app.use(
    auth({
        authRequired:false,
        auth0Logout:true,
        issuerBaseURL:'https://dev-1l30s9ms.us.auth0.com',
        baseURL:'http://localhost:7000',
        clientID:'19aoJZrxsN1q1ZojQFSKD7K1cwWGShg7',
        secret:'ncldkncdnlcndncdlkcnldnclndcnldcnlkdnclndlnc'
    })
)

app.listen(7000,()=>
{
    console.log("Listenning on port 7000")
})
app.get('/profile',requiresAuth(),(req,res)=>
{
    res.send(JSON.stringify(req.oidc.user))
})
app.get("/",(req,res)=>
{
    res.send(req.oidc.isAuthenticated()?'Logged in':'Logged out');

})