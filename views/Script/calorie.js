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
            

        }
    })

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