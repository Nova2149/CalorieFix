$(function()
{
    $.ajax({
        url:"http://localhost:7000/getusername",
        type:"GET",
        dataType:"json",
        success:function(response)
        {
            console.log(response)
            let first_name=response[0].first_name
            let last_name=response[0].last_name
            buildUserName(first_name,last_name)

        }
    })
})
function buildUserName(fname,lname)
{
    let table=document.getElementById("p_logout");
    table.innerHTML=''
    let row=`
    <span id="span_username">Welcome&nbsp;&nbsp;${fname}&nbsp;&nbsp;${lname}</span>`
    table.innerHTML+=row
    

}