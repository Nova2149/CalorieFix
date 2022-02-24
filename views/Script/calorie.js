function showDailyTracker()
{
    console.log("Daily Tracker clicked Successfully")
    document.getElementById("c_in").style.display="none"
    document.getElementById("c_out").style.display="none"
    $("#daily_tracker").show()

}
function showCalorieIn()
{
    console.log("Calorie In clicked Successfully")
    $("#c_in").show()
    $("#c_out").hide()
    $("#daily_tracker").hide()
}
function showCalorieOut()
{
    console.log("Calorie Out Clicked Successfully")
    $("#c_out").show()
    $("#c_in").hide()
    $("#daily_tracker").hide()
}
$(function()
{
    $("#daily_tracker").show()
    $("#c_in").hide()
    $("#c_out").hide()

    $.ajax({
        url:"http://localhost:7000/get-workout",
        type:"GET",
        dataType:"json",
        success:function(response)
        {
            console.log(response)
            buildGetWorkout(response)
        }
    })
})
function caloriesIn()
{   
    let user_c_in_calories=0;
    console.log("Calories In Clicked")
   
    let my_d=$("#user_c_in_date").val()
    let d =new Date(my_d)
    let year=d.getFullYear()
    let month=d.getMonth()+1
    let date=d.getDate()+1
    let final_date=[year,month,date].join("-")
    console.log(final_date)
    console.log(year)
    console.log(month)
    console.log(date)




    let user_time_period=$("#user_time").val();

    let user_food_item=document.getElementById("user_food_item").value
    let user_serving_size=$("#user_serving_size").val()
    let user_serving_size_int=parseInt(user_serving_size)
    
    console.log(my_d)
    console.log(user_time_period)
    console.log(user_food_item)
    console.log(user_serving_size)
    let counter=0
    if(!my_d)
    {
        alert("Missing Fields")
        console.log("Date is Missing")
        counter=1
    }
    else if(user_food_item===""||user_food_item==null)
    {
        alert("Missing Fields")
        counter=1
    }
    else if(counter==0)
    {   
        //AJAX call for getting the nutritional info about that product
        $.ajax({
            url:"http://localhost:7000/nutrition",
            type:"POST",
            data:{
                "food_name":user_food_item
            },
            dataType:"json",
            success:function(response)
            {
                if(response.items===""||response.items==null)
                {
                    alert("Sorry,We cant give you info for this product")
                }
                else if(response.items.length===0)
                {
                    alert("Sorry we cannot give you info for this product")
                }
                else{



                    console.log(response.items[0].calories)
                    let temp_calories=response.items[0].calories

                    if(user_serving_size_int==100)
                    {
                        user_c_in_calories=1*parseInt(temp_calories)
                        console.log("Final Amount of Calories",user_c_in_calories)
                        build_c_in_calorie_output(user_c_in_calories)

                    }
                    else if(user_serving_size_int==200){
                        user_c_in_calories=2*parseInt(temp_calories)
                        console.log("Final Amount of Calories",user_c_in_calories)
                        build_c_in_calorie_output(user_c_in_calories)
                    }
                    else if(user_serving_size_int==300)
                    {
                        user_c_in_calories=3*parseInt(temp_calories)
                        console.log("Final Amount of Calories",user_c_in_calories)
                        build_c_in_calorie_output(user_c_in_calories)
                    }
                    else if(user_serving_size_int==400)
                    {
                        user_c_in_calories=4*parseInt(temp_calories)
                        console.log("Final Amount of Calories",user_c_in_calories)
                        build_c_in_calorie_output(user_c_in_calories)
                    }
                    else if(user_serving_size_int==500)
                    {
                        user_c_in_calories=5*parseInt(temp_calories)
                        console.log("Final Amount of Calories",user_c_in_calories)
                        build_c_in_calorie_output(user_c_in_calories)
                    }
                    else{
                        //Do Nothing
                    }

                  


                }
            }
        })
        
        //AJAX Call for calculating the calories in about the system
        /*
        $.ajax({
            url:"http://localhost:7000/calorie-in",
            type:"POST",
            dataType:"json",
            data:{
                "user_date":user_date,
                "user_time_period":user_time_period,
                "user_food_item":user_food_item,
                "user_serving_size":user_serving_size

            },
            success:function(response)
            {
                console.log(response)

            }
        })
        */
    

    //date
    let user_date=final_date;
    let user_time=user_time_period;
    
   
    
    setTimeout(function(){
        let user_calories=user_c_in_calories
        console.log("User details needed to add to cv")
        console.log(user_date)
        console.log(user_time)
        console.log(user_calories)
        console.log(user_food_item)
        
        $.ajax({
            url:"http://localhost:7000/add-cin-db",
            type:"POST",
            dataType:"json",
            data:{
                "user_date":user_date,
                "user_time":user_time,
                "user_calories":user_calories,
                "user_food_item":user_food_item,
                "user_calories_type":"cin",
                
            },
            success:function(response)
            {
                console.log(response)

            }
        })
        

    },3000)

 
}

}

function caloriesOut()
{
    console.log("Calories Out clicked")
    let my_d=$("#user_c_out_date").val()
    let d =new Date(my_d)
    console.log(d)
    let year=d.getFullYear()
    let month=d.getMonth()+1
    let date=d.getDate()+1
    let final_date=[year,month,date].join("-")
    console.log(final_date)
    let counter=0;


    //User time period
    let user_time_period=$("#user_time_period").val()
    console.log(user_time_period)

    //Workout Duration

    let workout_duration=$("#user_duration").val()
    console.log(workout_duration)

    //Workout Name

    let workout_name=$("#user_workout").val()
    console.log(workout_name)


    if(!year)
    {
        console.log("Not a valid Date provided")
        alert("Missing Fields")
        counter=1;

    }


    let user_calories_burned;

    //To return the amount calories burned by doing a specific exercise
    $.ajax({
        url:"http://localhost:7000/getcout",
        type:"POST",
        dataType:"json",
        data:{
            "Workout_Name":workout_name,
            "Workout_Time":workout_duration,
        },
        success:function(response)
        {
            console.log(response)
            buildBurnedCalories(response)
            user_calories_burned=response.calories_burned
            console.log("Calories burned by the user ",user_calories_burned)

            

        }
    })
    setTimeout(function()
    {
        $.ajax({
            url:"http://localhost:7000/add-cout-db",
            type:"POST",
            dataType:"json",
            data:{
                "user_date":final_date,
                "user_time":user_time_period,
                "user_calorie_type":"cout",
                "user_calories":user_calories_burned,
                "item_name":workout_name
            },
            success:function(response)
            {
                console.log(response)
            }
        })

    },3000)



    function saveCoutDb()
    {

    }


}
function buildBurnedCalories(data)
{
    let table=document.getElementById("cout_amount")
    table.innerHTML=``;
    let row=`
    <div class="col-xs-4">

    <label>Calories Burned </label>
    </div>
    <br>
    <div class="col-xs-4">
    <input type="text" class="form-control" value=${data.calories_burned} disabled>

    </div>
    
    `
    table.innerHTML+=row;
}


function buildGetWorkout(data)
{
    console.log("Inside buildGetWorkout")
   // let table=document.getElementById("workout_list")
    //let row=``
    
    
    
    
    for(let i=0;i<data.length;i++)
    {
       let select_workout= document.getElementById("user_workout")
       let option_workout=document.createElement("option");
       option_workout.value=data[i]
       option_workout.text=data[i]
       select_workout.add(option_workout)
    }

}

//Write to input
function build_c_in_calorie_output(c)
{
    let table=document.getElementById("c_in_calories")
    table.innerHTML=``
    let row =``;
    row+=`<div class="col-xs-4">
    <label for="user_calorie_output">Calories: </label>
    </div>
    <div class="col-xs-4">
    <input type="text" class="form-control" value=${c}  disabled >
    </div>`
    table.innerHTML+=row
}


//Add the Calories In  Data to the Data Base
function addCInToDb()
{
   // console.log("Calories In To Db clicked successfully")
    setTimeout(function(){
        console.log("Calories In To Db clicked Successfully")

    },3000)
}

//Daily Tracker Logic starts here
function getDate()
{
    console.log("Get Date clicked Successfully");
    let user_d=$("#user_daily_tracker_date").val()
    let d =new Date(user_d)
    console.log(d)
    let year=d.getFullYear()
    let month=d.getMonth()+1
    let date=d.getDate()+1
    let final_date=[year,month,date].join("-")
    console.log(final_date)
    console.log(user_d)
    if(!user_d)
    {
        alert("Missing Fields")
    }
    else{
        console.log("Inside Else")
        $.ajax({
            url:"http://localhost:7000/get-calorie-info",
            type:"POST",
            dataType:"json",
            data:{
                "user_date":final_date
            },
            success:function(response)
            {
                console.log(response)
                buildCalorieTotal(response)
            }

        })
    }

}
function buildCalorieTotal(data)
{      
    //This will store the Calorie Intake Values for Afternoon,Morning and Evening
    let c_in=[]
    //This will store the Calorie Output Values for Morning,Afternoon and Evening
    let c_out=[]
    
    c_in=[0,0,0]
    c_out=[0,0,0]

    if(data.length==0)
    {
        let table=document.getElementById("calorie_output")
        table.innerHTML=''
        let row=`<div class="daily_tracker_error">
        <p>No Record Found!!!</p>
        
        </div>`
        table.innerHTML+=row;

    }
    else{
        let table=document.getElementById("calorie_output")
        table.innerHTML=''
        let row=`<table class="table">
        <tr>
        <th>S.NO</th>
        <th>Item Name/Workout Name</th>
        <th>Calorie Intake/Calorie Burned</th>
        <th>Time Stamp</th>
    
    
        </tr>
        
        `
            
        for(let i=0;i<data.length;i++)
        {
            if(data[i].user_calorie_type==="cin")
            {       
                //Pushing the values to the c_in Array
                if(data[i].user_time==="morning")
                {
                    c_in[0]=data[i].user_calories
                }
                if(data[i].user_time==="afternoon")
                {
                    c_in[1]=data[i].user_calories
                }
                if(data[i].user_time=="evening")
                {
                    c_in[2]=data[i].user_calories
                }
          
                //c_in[i]=data[i].user_calories
                row+=`<tr class="calorie_in_daily">
                <td>${i}</td>
                <td>${data[i].item_name}</td>
                <td>${data[i].user_calories}</td>
                <td>${data[i].user_time}</td>
                
                </tr>`
            }
            if(data[i].user_calorie_type==="cout")
            {   
                //Pushing the Values to the Cout Array
                if(data[i].user_time==="morning")
                {
                    c_out[0]=data[i].user_calories
                }
                if(data[i].user_time==="afternoon")
                {
                    c_out[1]=data[i].user_calories
                }
                if(data[i].user_time=="evening")
                {
                    c_out[2]=data[i].user_calories
                }
        
                //c_out[i]=data[i].user_calories

                row+=`<tr class="calorie_out_daily">
                <td>${i}</td>
                <td>${data[i].item_name}</td>
                <td>${data[i].user_calories}</td>
                <td>${data[i].user_time}</td>
                
                </tr>`
            }
          
        }
        row+=`</table>`
        table.innerHTML+=row;
      
        buildChart(c_in,c_out)
    }

    

    

}
let myChart;
function buildChart(c_in,c_out)
{   

    document.getElementById('mychart').innerHTML='  <canvas id="chart" width="400" height="400"></canvas>'
    var  ctx = document.getElementById('chart').getContext('2d');

  myChart = new Chart(ctx, {
        type: 'line',
        data: {
           labels:['Morning','Afternoon','Evening'],
            datasets: [{
                label: 'Calories Consumed',
                data: [c_in[0],c_in[1],c_in[2]],
                backgroundColor: ["#99C68E"
                   
                ],
                borderColor: [
                    "#99C68E"
                   
                 
                ],
                borderWidth: 1
            },
            
        {
            label: 'Calories Burned',
                data: [c_out[0],c_out[1],c_out[2]],
                backgroundColor: [
                    "rgb(255, 204, 203)"
                ],
                borderColor: [
                    "rgb(255, 204, 203)"
    
                ],
                borderWidth: 1
            
        
            }]
        },
     
    
    });
    


 

   
  
}
