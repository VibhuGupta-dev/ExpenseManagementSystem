const switcherToggle = document.querySelector(".switcherToggle");
const styleSwitcher = document.querySelector(".style-switcher");

switcherToggle.addEventListener("click", () => {
    styleSwitcher.classList.toggle("open");
});

const alternateStyles=document.querySelectorAll(".alternate")
let arr=Array.from(alternateStyles)
console.log(arr)
arr[0].removeAttribute("disabled")
function setColor(color){
    alternateStyles.forEach((styles)=>{
        if(color===styles.getAttribute("title"))
        {
            styles.removeAttribute("disabled")
        }
        else{
            styles.setAttribute("disabled","true")
        }
    })
}

const Moon=document.querySelector(".icon2")

Moon.addEventListener('click',function(){
   Moon.classList.toggle("fa-sun")
   Moon.classList.toggle("fa-moon")
   document.body.classList.toggle("dark")
})

Moon.addEventListener('load',function(){
    if(document.body.classList.contains("dark")){
        Moon.classList.add("fa-sun")
    }
    else{
         Moon.classList.add("fa-moon")
    }
})

var type=new Typed(".typing",{
    strings:["","Web Designer","Web Developer","Graphic Designer"],
    typeSpeed:100,
    backspeed:100,
    loop:true
})
