

function searchFood(){
    console.log("Search Food clicked")
    $.ajax({
        url:"http://localhost:7000/nutrition",
        type:"GET",
        dataType:"json",
        statusCode:{
            401:function(responseObject,textStatus,jqXHR)
            {   
                alert("Please Sign In")
                window.location.href="/register"
            },
            200:function(responseObject,textStatus,jqXHR)
            {
                window.location.href='/nutrition'
            }
        }
    })
    

}
function calculateFitness()
{
    console.log("Caluclate Fitness clicked")
    $.ajax({
        url:"http://localhost:7000/fitness",
        type:"GET",
        dataType:"json",
        statusCode:{
            401:function(responseObject,textStatus,jqXHR)
            {   
                alert("Please Sign In")
                window.location.href="/register"
            },
            200:function(responseObject,textStatus,jqXHR)
            {
                window.location.href='/fitness'
            }
        }
    })
}
function trackCalories()
{
    console.log("Track Calories clicked")
    $.ajax({
        url:"http://localhost:7000/calorie",
        type:"GET",
        dataType:"json",
        statusCode:{
            401:function(responseObject,textStatus,jqXHR)
            {   
                alert("Please Sign In")
                window.location.href="/register"
            },
            200:function(responseObject,textStatus,jqXHR)
            {
                window.location.href='/calorie'
            }
        }
    })
}
function recipes(){
    console.log("Recipes clicked successs")
    $.ajax({
        url:"http://localhost:7000/recipe",
        type:"GET",
        dataType:"json",
        statusCode:{
            401:function(responseObject,textStatus,jqXHR)
            {   
                alert("Please Sign In")
                window.location.href="/register"
            },
            200:function(responseObject,textStatus,jqXHR)
            {
                window.location.href='/recipe'
            }
        }
    })
}
function accountInfo(){
    console.log("Account Info clicked")
    $.ajax({
        url:"http://localhost:7000/account-info",
        type:"GET",
        dataType:"json",
        statusCode:{
            401:function(responseObject,textStatus,jqXHR)
            {   
                alert("Please Sign In")
                window.location.href="/register"
            },
            200:function(responseObject,textStatus,jqXHR)
            {
                window.location.href='/account-info'
            }
        }
    })
}
function workouts()
{
    $.ajax({
        url:"http://localhost:7000/workout",
        type:"GET",
        dataType:"json",
        statusCode:{
            401:function(responseObject,textStatus,jqXHR)
            {   
                alert("Please Sign In")
                window.location.href="/register"
            },
            200:function(responseObject,textStatus,jqXHR)
            {
                window.location.href='/workout'
            }
        }
    })

}
function review()
{
    console.log("Review Clicked Success")
    $.ajax({
        url:"http://localhost:7000/review",
        type:"GET",
        dataType:"json",
        statusCode:{
            401:function(responseObject,textStatus,jqXHR)
            {   
                alert("Please Sign In")
                window.location.href="/register"
            },
            200:function(responseObject,textStatus,jqXHR)
            {
                window.location.href='/review'
            }
        }
    })
}
$(function()
{

})