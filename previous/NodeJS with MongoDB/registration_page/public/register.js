window.onload=function(){
  let form=document.getElementById("myform")
 
 let password=document.getElementById("password")
let letter = document.getElementById("letter");
let capital = document.getElementById("capital");
let number = document.getElementById("number");
let length = document.getElementById("length");
let message=document.getElementById("message")
let special=document.getElementById("alpha")

password.onfocus = function() {
  message.style.display = "block";
  
  
}
password.onblur = ()=> {
 message.style.display = "none";
}
  password.onkeyup = ()=> {
    // Validate lowercase letters
    let lowerCaseLetters = /[a-z]/g;
    if(password.value.match(lowerCaseLetters)) {  
      letter.classList.remove("invalid");
      letter.classList.add("valid");
      
    } else {
      letter.classList.remove("valid");
      letter.classList.add("invalid");
    }
    
    // Validate capital letters
    let upperCaseLetters = /[A-Z]/g;
    if(password.value.match(upperCaseLetters)) {  
      capital.classList.remove("invalid");
      capital.classList.add("valid");
    } else {
      capital.classList.remove("valid");
      capital.classList.add("invalid");
    }
  
    // Validate numbers
    let numbers = /[0-9]/g;
    if(password.value.match(numbers)) {  
      number.classList.remove("invalid");
      number.classList.add("valid");
    } else {
      number.classList.remove("valid");
      number.classList.add("invalid");
    }
    //Validate special characters 
    let alphaSpecial = /[!@#$%^&*]/g;
    if(password.value.match(alphaSpecial)) {  
      special.classList.remove("invalid");
      special.classList.add("valid");
    } else {
      special.classList.remove("valid");
      special.classList.add("invalid");
    }
    
    // Validate length
    if(password.value.length >= 8) {
      length.classList.remove("invalid");
      length.classList.add("valid");
    } else {
      length.classList.remove("valid");
      length.classList.add("invalid");
    }
  }


form.addEventListener("submit",async (e)=>{
    e.preventDefault();
    let email=document.getElementById("email")
let password=document.getElementById("password")
let passwordConfirmation=document.getElementById("passwordrepeat")
let fname=document.getElementById("fname")
let lname=document.getElementById("lname")
let zipcode=document.getElementById("zipcode")
//let regularExpression  = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
let zipcodeExpression=/^[a-zA-Z0-9\s]{0,7}$/;
// let successMsg=document.getElementById("success")
let errorMsg=document.getElementById("error")


if(fname.value==""  || lname.value==""||email.value=="" || password.value=="" || passwordConfirmation.value=="" ){
    errorMsg.innerHTML="All fields are required"
    errorMsg.style.color="red";
    
//alert("All fields are required")
}else if(fname.value.length>5){
  errorMsg.textContent="Please check the length of the first name, should be only 15 characters"
  errorMsg.style.color="red";
}else if(lname.value.length>5){
  errorMsg.textContent="Please check the length of the last name, should be only 15 characters"
  errorMsg.style.color="red";
}else if(email.value.length>30){
    
     errorMsg.textContent="Must be length of 30 characters"
     errorMsg.style.color="red";
    //alert("Must be length of 30 characters")
}else if(password.value!=passwordConfirmation.value){
     errorMsg.textContent="Password not matching"
     errorMsg.style.color="red";
   // alert("Password not matching")
}
// }else if (!regularExpression.test(password.value)){
//   errorMsg.textContent="Password should contain atleast one number and one special character and atleast 8 or more characters"
//   errorMsg.style.color="red";
// }
else if(!zipcodeExpression.test(zipcode.value)){
    errorMsg.textContent = "Invalid Zip Code";
    errorMsg.style.color="red";
  }
  // else if(zipcode.value.length>6){
  //   errorMsg.textContent = "Please check the length of the Zip Code";
  //   errorMsg.style.color="red";
  // }
 

else{
    const data={
      fname:fname.value,
      lname:lname.value,
        email:email.value ,
      password:password.value,
      passwordConfirmation:passwordConfirmation.value,
      zipcode:zipcode.value
      
      
      };
      
      let options={
        method:'POST',
       headers: { "Content-type": "application/json; charset=UTF-8"  },
        body:JSON.stringify(data)
      };
      const response = await fetch('/', options);
      const id= await response.json();
   //console.log(id);
   if(response.status==200){
     errorMsg.textContent="Thank you for signing up to the account"
     errorMsg.style.color="green";
    //alert("Success")
    
    
   }else{
     errorMsg.textContent="User already Exists. Please check."
     errorMsg.style.color="red";
   // alert("User already Exists. Please check.")
   }
    }  
})   
}
