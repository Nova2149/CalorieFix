function submit_review()
{
    var review=document.getElementById("review_input").value
    console.log(review)

    if(review.trim()=='')
    {
        alert("Please write review before submitting")
    }


}