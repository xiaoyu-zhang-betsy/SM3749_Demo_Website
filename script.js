// var title = document.querySelector("h1");
// title.innerHTML = "This is another title from Javescript";

//fetch the button from the DOM
var button = document.querySelector("button");

//attach and event when the user clicks it
button.addEventListener("click", myfunction);

//create the function that will be called when the button is pressed
function myfunction()
{
	//this shows a popup window
	alert("Let me tell you more about me!");
}
