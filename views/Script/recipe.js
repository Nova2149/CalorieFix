function vegan()
{
    console.log("vegan clicked")
    $(".vegan_user").show()
    $(".veg_user").hide()
    $(".nonveg_user").hide()

}
function veg()
{
    console.log("Veg Clicked")
    $(".vegan_user").hide()
    $(".veg_user").show()
    $(".nonveg_user").hide()
    $.ajax({
        url:"http://localhost:7000/veg-recipe",
        type:"GET",
        dataType:"json",
        success:function(response)
        {
            console.log(response)
            buildVegTable(response)

            
        }
    
    })

}
function nonveg()
{
    console.log("Non Veg clicked")
    $(".vegan_user").hide()
    $(".veg_user").hide()
    $(".nonveg_user").show()
    $.ajax({
        url:"http://localhost:7000/nonveg-recipe",
        type:"GET",
        dataType:"json",
        success:function(response)
        {
            console.log(response)
            buildNonVegTable(response)

        }
    })
}

$(function()
{
    $(".vegan_user").show()
    $(".veg_user").hide()
    $(".nonveg_user").hide()
    $.ajax({
        url:"http://localhost:7000/vegan-recipe",
        type:"GET",
        dataType:"json",
        success:function(response)
        {
            console.log(response)
            buildVeganTable(response)

        }
    })


})
function buildVeganTable(data)
{
    let table=document.getElementById("vegan_diet");

    for(let i=0;i<data.length;i++)
    {
        let row=`
        <div>
    
            <div>
            <p class="item">${data[i].recipe_name}</p>
            
            </div>
            <div class="image_div">
            <img src=${data[i].recipe_image_url} width="200px" height="200px">
            </div>
            <br>
            <div class="btn_div">
            <button class="btn btn-info" type="button" onclick="ViewRecipe('${data[i].recipe_name}')">View</button>
            </div>
            <br>
            </div>
       `;
        table.innerHTML+=row;

    }

}
function ViewRecipe1(data)
{
    console.log("Clicked ")
    console.log(data)
}
function buildVegTable(data)
{
    let table=document.getElementById("veg_diet")
    table.innerHTML=''

    for(let i=0;i<data.length;i++)
    {
        let row=`
        <div>
        <div>
        <p class="item">${data[i].recipe_name}</p>
        
        </div>
        <div class="image_div">
        <img src=${data[i].recipe_image_url} width="200px" height="200px">
        </div>
        <br>
        <div class="btn_div">
        <button class="btn btn-info" type="button" onclick="ViewRecipe('${data[i].recipe_name}')">View</button>
        </div>
        <br>
    
        </div>`
        table.innerHTML+=row;
    }

}
function buildNonVegTable(data)
{
    let table=document.getElementById("nonveg_diet");
    table.innerHTML=''
    for(let i=0;i<data.length;i++)
    {
        let row=`
        <div>
        <div>
        <p class="item">${data[i].recipe_name}</p>
        
        </div>
        <div class="image_div">
        <img src=${data[i].recipe_image_url} width="200px" height="200px">
        </div>
        <br>
        <div class="btn_div">
        <button class="btn btn-info" type="button" onclick="ViewRecipe('${data[i].recipe_name}')">View</button>
        </div>
        <br>
        
        </div>
        `
        table.innerHTML+=row;
    }

}

function ViewRecipe(data)
{
    $.ajax({
        url:"http://localhost:7000/viewrecipe",
        type:"POST",
        dataType:"json",
        data:{
            "recipe_name":data
        },success:function(response)
        {
            console.log(response)
           
        }

    })
    window.location.href="/selectedrecipe"
}
function buildRecipeTable(data)
{
    let table=document.getElementById("describe")
    table.innerHTML=''
    let row=`
    <div class="col-xs-12">
    <div class="col-xs-8">
       <div class="row">
           <div class="col-xs-4">
               <label for="recipe_name">Recipe Name</label>
           </div>
           <div class="col-xs-4">
               <input type="text" disabled value='${data[0].recipe_name}'>
           </div>
       </div>
      <br>
       <div class="row">
           <div class="col-xs-4">
           <label for="recipe_name">Calories</label>
           </div>
           <div class="col-xs-4">
           <input type="text" disabled value='${data[0].recipe_calories}'>
           </div>
       <br>
           <div class="row">
               <div class="col-xs-4">
               <label for="recipe_name">Serving Size</label>
               </div>
               <div class="col-xs-4">
               <input type="text" disabled value='${data[0].recipe_serving_size}'>
               </div>
           </div>
       <br>
           <div class="row">
               <div class="col-xs-4">
               <label for="recipe_name">Description</label>
               </div>
               <div class="col-xs-4">
               <p>${data[0].description}</p>
               </div>
           </div>
       </div>
    
     
     

  
  <div class="col-xs-4">
      <img src="${data[0].recipe_image_url}" alt="" width="200px" height="200px">
  </div>
  
    </div>`
    table.innerHTML+=row;
}

