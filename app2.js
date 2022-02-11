const express=require('express')
const app=express()
const jwt=require('jsonwebtoken')
const { resetWatchers } = require('nodemon/lib/monitor/watch')
app.use(express.json())
let user_token
let refreshToken=[]

app.listen(3000,()=>
{
    console.log("The server is running on port 3000")
})

const posts=[
    {
        username:"Kyle",title:"Post 1"
    },
    {
        username:"Jim",title:"Post 1"
    }
]
app.get("/posts",authenticateToken,(req,res)=>
{
    res.send(posts)
})
app.get("",(req,res)=>
{
    res.send("Hello world")
})

app.post("/login",(req,res)=>
{
    const username=req.body.username;
    const user={name:username}
   const accessToken= jwt.sign(user,"Mayank")
   refreshToken.push(accessToken)
   res.set({
       'Authorization':'Bearer'+accessToken
   })
})
app.get("/logout",(req,res)=>
{
   const accessToken= jwt.sign({id:11},'Mayank',{expiresIn:"1s"})
  
    res.json({
        accessToken:accessToken
    })
})

app.post("/token",(req,res)=>
{
    const refreshToken=req.body.token 
    if(refreshToken==null)
    {
        return res.sendStatus(401)
    }
})
function authenticateToken(req,res,next){

    const authHeader=req.headers['authorization']
    const token=authHeader && authHeader.split(' ')[1]
    console.log(token)
    user_token=token
    if(token==null)
    {
        return res.sendStatus(401)
    }
   else  if(!refreshToken.includes(token))
   {
        return res.sendStatus(401)
   }
   else
   {
    jwt.verify(token,"Mayank",(err,user)=>
    {   
        
        if(err) return res.sendStatus(403)
        res.set('Authorization','Bearer '+token)
        req.user=user
        next()
    })

   }
    
   
}
