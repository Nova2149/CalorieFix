function LogoutUser()
{
    $.ajax({
        url:"http://localhost:7000/remove-token",
        type:"GET",
        dataType:"json",
        success:function(response)
        {
            console.log(response)
        }
    })
    window.location.href="/home";
}