const express=require('express');
const res = require('express/lib/response');
const mysql=require('mysql2')
const path=require('path')
const request=require('request')
const fs=require('fs');
const jwt=require('jsonwebtoken')
const { workerData } = require('worker_threads');
const localStorage=require("localStorage")


const app=express()
app.use(express.json())
app.use(express.urlencoded())
app.use(express.static(path.join(__dirname,'views')));
const {auth, requiresAuth}=require('express-openid-connect');
const { resolve } = require('path');


const connection=mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'host',
        database:'myweb419',
        multipleStatements:true
})

//let  user_email=null;


app.post("/signin",(req,res)=>
{       
        console.log(req.body)
        const email=req.body.email
        const password=req.body.password
        console.log(email)
        console.log(password)
        let new_user_id

        let sql="select * from register where email=? and password=?";
        connection.query(sql,[email,password],(err,result)=>
        {
                if(err) throw err;
                console.log(result)
                if(result==null||result=="")
                {       
                        //Sign In Unsuccessful
                        console.log("Sign In Unsuccessful")
                        res.send({"count":1})
                }
                else if(result[0].user_id!=1)
                {       
                        //Sign In for User
                        console.log("Sign In Successful")
                       console.log("My Result ",result[0].user_id)
                        //console.log(user_id)
                        user_id=result[0].user_id

                        //Temp s
                        fs.writeFileSync("JSON/user_id.json",JSON.stringify({"user_id":user_id}))                        
                        


                        //Temp e
                        console.log(user_id)
                        res.send({"count":0})

                }
                else
                {       //Sign In for Admin 
                        user_id=result[0].user_id
                        fs.writeFileSync("JSON/user_id.json",JSON.stringify({"user_id":user_id}))  
                        console.log(user_id)
                        res.send({
                                "count":2
                        })
                }
        })

})




app.get("/home-signin",(req,res)=>
{
        res.sendFile(path.resolve(__dirname,'views/html/home-signin.html'))
})








app.post("/register",(req,res)=>
{       
        const body=req.body;
        console.log(body)
        const data=req.body;
        connection.query('select email from register where email=?',[req.body.email],(err,result)=>
        {
                if(err){
                       throw err;
                }
                if(result==""||result==null)
                {       
                        console.log(result)
                      let sql=`insert into register(first_name,last_name,email,password,phone,address,postal_code)
                      values(?,?,?,?,?,?,?)` 
                      connection.query(sql,
                        [
                                data.first_name,
                                data.last_name,
                                data.email,
                                data.password,
                                data.phone,data.address,
                                data.postal_code

                        ],(err,result)=>
                        {
                               
                              if(err) throw err;
                              console.log("Number of Records Inserted "+result.affectedRows)
      
                        })
                        res.send({

                                "counter":0
                        })

                }
                else
                {       
                        console.log(result)
                        console.log("User already exists")
                        res.send({"counter":1})

                }
    
        })
})


app.get("/register",(req,res)=>
{
       res.sendFile(path.resolve(__dirname,'views/html/register.html'))
})

// app.get("/getusername",(req,res)=>
// {       
//        let my_user_id=user_id
//       connection.query("select * from register where user_id=?",user_id,(err,result)=>
//       {
//               if(err) throw err;
//               console.log(result)
//               res.send(result)

//       })

// })

//nutrition page starts here
app.get("/nutrition",authenticateToken,(req,res)=>
{
        res.sendFile(path.resolve(__dirname,"views/html/nutrition.html"))
})
app.post("/nutrition",(req,res)=>
{       
        console.log(req.body.food_name)
        const food_name=req.body.food_name
        request.get(
                {
                url:'https://api.calorieninjas.com/v1/nutrition?query='+food_name,
                headers:{
                    'X-Api-Key':'LlpUDw3hD03wWNKvTDGzpQ==PD0zUfzovOIQxNLu'
                },
             },(error,response,body)=>
                {
                    if(error){
                       // result='Unable to connect with the server'
                     return console.log("Unable to connect with the server")
                    }
                    else if(response.statusCode!=200)
                    {
                       //result='An issue occured'
                        return console.log("An issue occured")
                    }
                    else {
                        res.send(body)
                         console.log(body)
                    }
                })

})


//nutrition page ends here
app.get("/account-info",authenticateToken,(req,res)=>
{
        res.sendFile(path.resolve(__dirname,'views/html/account_info.html'))
})
//To check if the old password of the user is correct or not
app.post("/old-password", (req,res)=>
{
        let old_password=req.body.old_password
        console.log(old_password)
        let appData=fs.readFileSync('JSON/user_id.json')
        let data=JSON.parse(appData)
        let user_id=data.user_id
        console.log(user_id)
        let sql=`select password from register where user_id=? and password=?`
          connection.query(sql, [user_id, old_password], (er1, rs1) => {
                if (er1)
                        throw er1;
                console.log(rs1);
                if (rs1 == null || rs1 == "") {

                        res.send({ "count": 2 });
                }
                else {
                        res.send({ "count": 0 });
                }
        })
})
//To Update the new password for the user
app.post("/update-password",(req,res)=>
{
        let new_password=req.body.new_password
        console.log(new_password)
        let appData=fs.readFileSync('JSON/user_id.json')
        let data=JSON.parse(appData)
        let user_id=data.user_id
        console.log(user_id)

        let sql=`update register set password=? where user_id=?`
        connection.query(sql,[new_password,user_id],(error,result)=>
        {
                if(error) throw error;
                console.log(result)
                res.send(result)
        })
     

})
//Add user bmi and bmr to the database
app.post("/add-fitness-to-profile",(req,res)=>
{
        let user_bmi=req.body.user_bmi
        let user_bmr=req.body.user_bmr
        console.log(user_bmi)
        console.log(user_bmr)

        let appData=fs.readFileSync('JSON/user_id.json')
        let data=JSON.parse(appData)
        let user_id=data.user_id
        console.log(user_id)

        let sql=`select * from healthmetrices where user_id=? and bmi=? and bmr=?`
        connection.query(sql,[user_id,user_bmi,user_bmr],(er,rs)=>
        {
                if(er) throw er;
                if(rs==""||rs==null)
                {
                        sql=`insert into healthmetrices(user_id,bmi,bmr) values(?,?,?)`
                        connection.query(sql,[user_id,user_bmi,user_bmr],(er1,rs1)=>
                        {
                                if(er1) throw er1;
                                console.log(rs1)

                        })
                }
                else
                {
                        sql=`update healthmetrices set bmi=?,bmr=? where user_id=?`
                        connection.query(sql,[user_bmi,user_bmr,user_id],(er2,rs2)=>
                        {
                                if(er2) throw er2;
                                console.log(rs2);

                        })
                }
        })
        res.sendStatus(200)
})
app.get("/get-fitness-profile",(req,res)=>
{
        let appData=fs.readFileSync('JSON/user_id.json')
        let data=JSON.parse(appData)
        let user_id=data.user_id
        console.log(user_id)

        let sql=`select * from healthmetrices where user_id=?`
        connection.query(sql,[user_id],(er,rs)=>
        {
                if(er) throw er;
                console.log(rs)
                res.send(rs)
        })
      
})
app.get("/account-info-all",(req,res)=>
{       
        const appData=fs.readFileSync('JSON/user_id.json')
        const data=JSON.parse(appData)
        console.log(data)
        let user_id=data.user_id
        let sql=`select * from register where user_id=?`
        connection.query(sql,[user_id],(err,result)=>
        {
                if(err)
                {
                        throw err;
                }
                else{
                        console.log(result)
                        res.send(result)
                }

        })
})
//Update Account Info
app.post("/update-account-info-all",(req,res)=>
{       
        let appData=fs.readFileSync('JSON/user_id.json')
        let data=JSON.parse(appData)
        let user_id=data.user_id
        console.log(user_id)
        console.log(req.body)
       const first_name=req.body.first_name
       const last_name=req.body.last_name
       const email=req.body.email
       const phone=req.body.phone
       const address=req.body.address
       const postal_code=req.body.postal_code
       let sql=`update register set first_name=?,last_name=?,email=?,address=?,phone=?,postal_code=? where user_id=?`;

       connection.query(sql,[first_name,last_name,email,address,phone,postal_code,user_id],(err,result)=>
       {
                if(err)
                {
                        throw err;
                }
                console.log(result)
                res.send(result)
       })

})
//account info page starts here 





//account info page ends here 

//fitness page starts here
app.get("/fitness",authenticateToken,(req,res)=>
{
        res.sendFile(path.resolve(__dirname,'views/html/fitness.html'))
})


//fitness page ends here


//workout page starts here
app.get("/workout",authenticateToken,(req,res)=>
{
        res.sendFile(path.resolve(__dirname,'views/html/workout.html'))
})


app.post("/add-workout",(req,res)=>
{
        console.log(req.body)
        let workout_name=req.body.workout_name
        let workout_calories=req.body.workout_calories
        let workout_time_period=req.body.workout_time_period
        let workout_image_url=req.body.workout_image_url
        let workout_description=req.body.workout_description

        console.log(workout_name)
        console.log(workout_calories)
        console.log(workout_time_period)
        console.log(workout_image_url)
        console.log(workout_description)
        let my_data=fs.readFileSync("json/workout.json")
        let data=JSON.parse(my_data)

        let final_Array=[]
        for( let i=0;i<data.length;i++)
        {
                final_Array.push(data[i])
        }
        final_Array.push({
                "workout_name":workout_name,
                "workout_calories":workout_calories,
                "workout_time_period":workout_time_period,
                "workout_image_url":workout_image_url,
                "workout_description":workout_description
        })

        console.log(final_Array)
        fs.writeFileSync('JSON/workout.json',JSON.stringify(final_Array))
        res.send(JSON.stringify(final_Array))


        //let mydata=fs.readFileSync("json")
})
app.get("/rough",(req,res)=>
{              
        let workout_name="a1"
        let workout_calories="a2"
        let workout_time_period="a3"
        let workout_image_url="a4"
        let workout_description="a5"

        let mydata=fs.readFileSync("json/workout.json")
        let data=JSON.parse(mydata)
      //  console.log(data)
        console.log(data.workouts)
       

        final_Array=[]
        for(let i=0;i<data.workouts.length;i++)
        {
                final_Array.push(data.workouts[i])
        }
        final_Array.push({
                "wokrout_name":workout_name,
                "workout_calories":workout_calories,
                "workout_time_period":workout_time_period,
                "workout_image_url":workout_image_url,
                "workout_description":workout_description
        })
        console.log(final_Array)
        res.send(final_Array)
        //Rough code not to uncomment
       // fs.writeFileSync('workout.json',JSON.stringify(final_Array))

})
app.get("/workout-admin",(req,res)=>
{
        res.sendFile(path.resolve(__dirname,'views/html/workout-admin.html'))
})

//To get the names of all the workouts
app.get("/get-workout",(req,res)=>
{
        console.log("Inside Get Workout")
        let mydata=fs.readFileSync("JSON/workout.json")
        let data=JSON.parse(mydata)
        console.log(data)
        let final_Array=[]

        for(let i=0;i<data.length;i++)
        {      // console.log(data[i].)
               final_Array.push(data[i].Workout_Name)
        }
        //res.send(workout_name)
        res.send(final_Array)

})
//To get the details of a specific workout
app.post("/workout-detail",(req,res)=>
{
        console.log("Inside Workout Detail")
        const workoutName=req.body.workoutName
        console.log(workoutName)

        let mydata=fs.readFileSync("JSON/workout.json")
        let data=JSON.parse(mydata)

        let final_Array=[]
        for(let i=0;i<data.length;i++)
        {
              if(data[i].Workout_Name==workoutName)
              {
                      final_Array.push(data[i])
                      console.log("Match Found")
                      res.send(final_Array)
              }
             
        }
 

})      
app.post("/getcout",(req,res)=>
{
        let workout_name=req.body.Workout_Name
        console.log(workout_name)
        let workout_duration=req.body.Workout_Time
        console.log(workout_duration)

        let current_workout_duration=parseFloat(workout_duration)

        
        let mydata=fs.readFileSync('JSON/workout.json')
        let data=JSON.parse(mydata)

        let final_Array=[]
        for(let i=0;i<data.length;i++)
        {
                if(data[i].Workout_Name==workout_name)
                {
                        final_Array.push(data[i])
                }
        }
        let calories_burned_amount=0;

        if(current_workout_duration==1)
        {
                calories_burned_amount=final_Array[0].Workout_Calories;
                console.log(calories_burned_amount)
        }
        else if(current_workout_duration==0.25)
        {
                calories_burned_amount=final_Array[0].Workout_Calories*0.25;
                console.log(calories_burned_amount)

        }
        else if(current_workout_duration==0.50)
        {
                calories_burned_amount=final_Array[0].Workout_Calories*0.50
                console.log(calories_burned_amount)
        }
        else if(current_workout_duration==0.75)
        {
                calories_burned_amount=final_Array[0].Workout_Calories*0.75
                console.log(calories_burned_amount)
        }

        res.send({
                "calories_burned":calories_burned_amount
        })

})

//workout page ends here


//recipe page starts here

app.get("/recipe",authenticateToken,(req,res)=>
{
        res.sendFile(path.resolve(__dirname,'views/html/recipe.html'))
})

app.get("/recipe-admin",(req,res)=>
{
        res.sendFile(path.resolve(__dirname,"views/html/recipe-admin.html"))
})
app.post("/add-recipe",(req,res)=>
{
        console.log(req.body)
        const recipe_name=req.body.recipe_name;
        const  recipe_calories=req.body.recipe_calories
        const recipe_description=req.body.recipe_description
        const recipe_serving_size=req.body.recipe_serving_size
        const recipe_image_url=req.body.recipe_image_url

        console.log(recipe_name,recipe_calories,recipe_description,recipe_serving_size,recipe_image_url)
        const my_data=fs.readFileSync("JSON/recipe.json")
        const data=JSON.parse(my_data)

        let final_Array=[]
        for(let i=0;i<data.length;i++)
        {
               final_Array.push(data[i])

        }
        final_Array.push({
                "recipe_name":recipe_name,
                "recipe_calories":recipe_calories,
                "recipe_serving_size":recipe_serving_size,
                "recipe_image_url":recipe_image_url,
                "recipe_type":recipe_type,
                "recipe_description":recipe_description
        })

        fs.writeFileSync('JSON/recipe.json',JSON.stringify(final_Array))

}) 

app.post("/update-recipe",(req,res)=>
{
        console.log(req.body)
        const recipe_name=req.body.recipe_name;
        const  recipe_calories=req.body.recipe_calories
        const recipe_description=req.body.recipe_description
        const recipe_serving_size=req.body.recipe_serving_size
        const recipe_image_url=req.body.recipe_image_url
        console.log(recipe_name,recipe_calories,recipe_description,recipe_serving_size,recipe_image_url)
        const my_data=fs.readFileSync("JSON/recipe.json")
        const data=JSON.parse(my_data)

        let final_Array=[]
        for(let i=0;i<data.length;i++)
        {
               if(data[i].recipe_name==recipe_name)
               {
                       final_Array.push({
                        "recipe_name":recipe_name,
                        "recipe_calories":recipe_calories,
                        "recipe_serving_size":recipe_serving_size,
                        "recipe_image_url":recipe_image_url,
                        "recipe_type":recipe_type,
                        "recipe_description":recipe_description

                       })
               }
               final_Array.push(data[i])

        }
        fs.writeFileSync('JSON/recipe.json',JSON.stringify(final_Array))
       
})
app.get("/vegan-recipe",(req,res)=>
{
        let mydata=fs.readFileSync("JSON/recipe.json")
        let data=JSON.parse(mydata)
        let final_Array=[]
        for(let i=0;i<data.length;i++)
        {
               if(data[i].recipe_type=="vegan")
               {
                       final_Array.push(data[i])
               }

        }
        res.send(final_Array)
})
app.get("/veg-recipe",(req,res)=>
{       
        let mydata=fs.readFileSync("JSON/recipe.json")
        let data=JSON.parse(mydata)
        let final_Array=[]
        for(let i=0;i<data.length;i++)
        {
               if(data[i].recipe_type=="vegetarien")
               {
                       final_Array.push(data[i])
               }

        }
        res.send(final_Array)

})
app.get("/nonveg-recipe",(req,res)=>
{       
        let mydata=fs.readFileSync("JSON/recipe.json")
        let data=JSON.parse(mydata)
        let final_Array=[]
        for(let i=0;i<data.length;i++)
        {
               if(data[i].recipe_type=="non-vegetarien")
               {
                       final_Array.push(data[i])
               }

        }
        res.send(final_Array)

})

app.post("/viewrecipe",(req,res)=>
{
        let recipe_name=req.body.recipe_name
        console.log(recipe_name)
        //Read the JSON File
        let mydata=fs.readFileSync('JSON/recipe.json')
        let data=JSON.parse(mydata)
        let final_Array=[]
        for(let i=0;i<data.length;i++)
        {
               if(data[i].recipe_name==recipe_name)
               {
                       final_Array.push(data[i])
               }
        }
        
        fs.writeFileSync('JSON/selectedRecipe.json',JSON.stringify(final_Array))
        res.send(null)
})
app.get("/current-recipe",(req,res)=>
{
        let mydata=fs.readFileSync("JSON/selectedRecipe.json")
        let data=JSON.parse(mydata)

        res.send(data)
})
app.get("/selectedrecipe",(req,res)=>
{
        res.sendFile(path.resolve(__dirname,"views/html/selectedRecipe.html"))
})
//recipe page ends here

//To load the admin home page
app.get("/admin",(req,res)=>
{
        res.sendFile(path.resolve(__dirname,"views/html/admin-home.html"))
})
app.post("/removeUser",(req,res)=>
{
        const email=req.body.user_email
        let sql='delete from register where email=?'
        connection.query(sql,[email],(err,res)=>
        {
                if(err)
                {
                        throw err;
                }
                console.log(res)
                res.send(null)
        })

})
app.get("/getAllUsers",(req,res)=>
{
        let sql=`select * from register where user_id>1`;
        connection.query(sql,(error,result)=>
        {
                if(error)
                {
                        throw error;
                }
                console.log(result)
                res.send(result)
        })
})

app.get("/adminuinfo",(req,res)=>
{
        res.sendFile(path.resolve(__dirname,'views/html/adminuinfo.html'))
})
app.get("/review-admin",(req,res)=>
{
        res.sendFile(path.resolve(__dirname,'views/html/review-admin.html'))
})
app.get("/review",authenticateToken,(req,res)=>
{
        res.sendFile(path.resolve(__dirname,"views/html/review.html"))
})
app.listen(7000,()=>
{
        console.log("The Server is running on port 7000");
})

//Home Page content starts Here
app.get("/home",(req,res)=>
{
        res.sendFile(path.resolve(__dirname,'views/html/hp.html'))
})


//Home Page content ends Here


///Authentication Temp code starts here
//Please note that this area of code is in testing phase

let refreshToken=[]
app.post("/create-token",(req,res)=>
{
        let email=req.body.email
        console.log(email)
        const user={"email":email}

        const accessToken=jwt.sign(user,"Mayank")
      


        fs.writeFileSync('JSON/token.json',JSON.stringify({"Authorization":"Bearer "+accessToken}))
        fs.writeFileSync('JSON/SignInToken.json',JSON.stringify({"Authorization":"Bearer "+accessToken}))
        res.send({
                "access_token":accessToken
        })


})

//middleware
//let authenticateToken=(req,res,next)=>
function authenticateToken(req,res,next)
{       
        console.log(refreshToken)
        let mydata=fs.readFileSync('JSON/token.json')
        let data=JSON.parse(mydata)
        console.log(data)
        const authHeader=data.Authorization
        const token=authHeader && authHeader.split(" ")[1]
        console.log(token)

        let mySignInToken=fs.readFileSync("JSON/SignInToken.json")
        let SignIndata=JSON.parse(mySignInToken)
        console.log(SignIndata)
        const SignInAuthHeader=SignIndata.Authorization
        const SignInToken=SignInAuthHeader && SignInAuthHeader.split(" ")[1]
        console.log(SignInToken)


        if(token==null)
        {
                return res.sendStatus(401)
        }
        else if(token!=SignInToken)
        {
                return res.send(401)
        }
        else{
               jwt.verify(token,"Mayank",(err,user)=>
               {
                       if(err) return res.sendStatus(403)
                       req.user=user
                       next()

               })
        }

        //Working on the Middleware
}
//To logout
app.get("/remove-token",(req,res)=>
{
        const accessToken=jwt.sign(
                "sasenaidpaagolEmpirejuna","Mayank"
        )
        fs.writeFileSync('JSON/token.json',JSON.stringify({"Authorization":"Bearer "+accessToken}))
        res.send({
                "access_token":accessToken        })
})
//just for testing


//Calorie Handling Starts Here

app.get("/calorie",authenticateToken,(req,res)=>
{
        res.sendFile(path.resolve(__dirname,'views/html/calorie.html'))
})//To Add Calories to the database
app.post("/add-cin-db",(req,res)=>
{               console.log(user_id)
        let user_date=req.body.user_date
        let user_time=req.body.user_time
        let user_food_item=req.body.user_food_item
        let user_calories=req.body.user_calories
        let user_calories_type=req.body.user_calories_type
        let mydata=fs.readFileSync("JSON/user_id.json")
        let data=JSON.parse(mydata)

        let u_id=data.user_id;
        console.log(user_date)
        console.log(u_id)
        console.log(user_time)
        console.log(user_food_item)
        console.log(user_calories)
        console.log(user_calories_type)

        let sql
        sql="select * from calorie where user_id=? and user_date=? and user_time =?";
        connection.query(sql,[u_id,user_date,user_time],(err,result)=>
        {
                if(err) throw err;
                if(result==""||result==null)
                {
                        sql='insert into calorie(user_id,user_date,user_time,user_calorie_type,user_calories,item_name) values(?,?,?,?,?,?)';
                        connection.query(sql,[u_id,user_date,user_time,user_calories_type,user_calories,user_food_item],
                                (er1,rs1)=>
                                {
                                        if(er1) throw er1;
                                        console.log(rs1);

                                })
                }
                else{
                        sql=`update calorie set 
                        user_id=?,user_date=?,user_time=?,user_calorie_type=?,user_calories=?,item_name=?
                        where user_id=? and user_date=? and user_time=?`

                        connection.query(sql,[u_id,user_date,user_time,user_calories_type,user_calories,user_food_item
                        ,u_id,user_date,user_time],(er2,rs2)=>
                        {
                                if(er2) throw er2;
                                console.log(rs2);

                        })

                }
        })

  res.sendStatus(201)
})

app.post("/add-cout-db",(req,res)=>
{       console.log("cout db called")

        let user_date=req.body.user_date
        let user_time=req.body.user_time
        let user_calorie_type=req.body.user_calorie_type
        let user_calories=req.body.user_calories
        let item_name=req.body.item_name
        console.log(user_date)
        console.log(user_time)
        console.log(user_calorie_type)
        console.log(user_calories)
        console.log(item_name)

        let mydata=fs.readFileSync("JSON/user_id.json")
        let data=JSON.parse(mydata)
        let u_id=data.user_id
        let sql;
        sql=`select * from calorie where user_id=? and user_date=? and user_time=? `;
        connection.query(sql,[u_id,user_date,user_time],(er,rs)=>
        {
                if(er) throw er;
                 if(rs==""||rs==null)
                 {
                        sql=`insert into calorie(user_id,user_date,user_time,user_calorie_type,user_calories,item_name)
                         values(?,?,?,?,?,?)`;
                         connection.query(sql,[u_id,user_date,user_time,user_calorie_type,user_calories,item_name],(er1,rs1)=>
                         {
                                 if(er1) throw er1;
                                 console.log(rs1)
                         })

                 }
                 else{
                         sql=`update calorie set user_id=?,user_date=?,user_time=?,user_calorie_type=?,user_calories=?,item,name=?
                          where user_id=? and user_date=? and user_time=?`
                          connection.query(sql,[u_id,user_date,user_time,user_calorie_type,user_calories,item_name,u_id,user_date,user_time],(er2,rs2)=>
                          {
                                  if(er2) throw er2;
                                  console.log(rs2)

                          })

                 }
        })
       res.sendStatus(201);
       
})
app.post("/get-calorie-info",(req,res)=>
{
        let user_date=req.body.user_date
        console.log(user_date)
        //
        let sql="select * from calorie where user_date=?"
        connection.query(sql,[user_date],(er1,rs1)=>
        {
                if(er1) throw er1;
                console.log(rs1)
                res.send(rs1)
                
                

        })
})


//Calorie handling ends Here

//Review Handling starts here
app.post("/submit-review",(req,res)=>
{
        let user_review=req.body.user_review
        console.log(user_review)
        let appData=fs.readFileSync('JSON/user_id.json')
        let data=JSON.parse(appData)
        let user_id=data.user_id
        console.log(user_id)

        //Date
        let today = new Date().toISOString().slice(0, 10)
        console.log(today)
        //Time
        let time=new Date().toLocaleTimeString()
        console.log(time)
        let sql=`insert into review(user_id,user_date,user_time,user_review) values(?,curdate(),current_time(),?);`
        connection.query(sql,[user_id,user_review],(er,rs)=>
        {
                if(er) throw er;
                console.log(rs)
        })
        res.sendStatus(200)
})

app.get("/get-review",(req,res)=>
{
        let sql=`select register.user_id,register.first_name,register.email,review.user_date,review.user_time,review.user_review from register inner join
          review where register.user_id=review.user_id;`
        connection.query(sql,(error,result)=>
        {
                if(error) throw error;
                console.log(result)
                res.send(result)
        })
})


app.get("/admin-review",(req,res)=>
{
        res.sendFile(path.resolve(__dirname,'views/html/admin-review.html'))
})
//Review HAndling ends here

app.get("/edit-recipe",(req,res)=>
{
        res.sendFile(path.resolve(__dirname,'views/html/admin-edit-recipe.html'))
})
app.get("/get-recipe-list",(req,res)=>
{
        let appData=fs.readFileSync('JSON/recipe.json')
        let data=JSON.parse(appData)
        res.send(data)

})
app.post("/current-recipe",(req,res)=>
{
        let current_recipe=req.body.recipe_name
        let appData=fs.readFileSync('JSON/recipe.json')
        let data=JSON.parse(appData)
        console.log(data)
        let final_Array=[]

        for(let i=0;i<data.length;i++)
        {
                if(data[i].recipe_name==current_recipe)
                {
                        final_Array.push(data[i])
                }
        }
        res.send(final_Array)
})
