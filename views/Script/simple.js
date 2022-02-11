$(function()
{
    console.log("Hello W")

})
function submitDate()
{
    console.log("clicked")
    let my_d =$("#user_date").val()
    let d=new Date(my_d)
    let year=d.getFullYear()
    let month=d.getMonth()+1
    let date=d.getDate()+1
    let final_date=[year,month,date].join("-")
    console.log(final_date)

    console.log(d.getFullYear())
    console.log(d.getDate()+1)
    console.log(d.getMonth()+1)
    console.log(d.toDateString())
   


}