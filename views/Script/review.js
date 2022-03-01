function submit_review()
{
    var review=document.getElementById("review_input").value
    console.log(review)

    if(review.trim()=='')
    {
        alert("Please write review before submitting")
    }
    else
    {
        $.ajax({
            url:"http://localhost:7000/submit-review",
            type:"POST",
            dataType:"json",
            data:{
                "user_review":review
            },
            async:false,
            success:function(response)
            {
                console.log(response)
                alert("Review Submit Successfully")
            }
            
        })
    }


}