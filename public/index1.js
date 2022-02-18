///Registration page
window.onload=function(){
let registerform=document.getElementById("regform")
 
let regpassword=document.getElementById("regpassword")
let letter = document.getElementById("letter");
let capital = document.getElementById("capital");
let number = document.getElementById("number");
let length = document.getElementById("length");
let regmessage=document.getElementById("regmessage")
let special=document.getElementById("alpha")

regpassword.onfocus = function() {
  regmessage.style.display = "block";
}

regpassword.onblur = ()=> {
  regmessage.style.display = "none";
}
regpassword.onkeyup = ()=> {
    // Validate lowercase letters
    let lowerCaseLetters = /[a-z]/g;
    if(regpassword.value.match(lowerCaseLetters)) {  
      letter.classList.remove("invalid");
      letter.classList.add("valid");
      
    } else {
      letter.classList.remove("valid");
      letter.classList.add("invalid");
    }
    
    // Validate capital letters
    let upperCaseLetters = /[A-Z]/g;
    if(regpassword.value.match(upperCaseLetters)) {  
      capital.classList.remove("invalid");
      capital.classList.add("valid");
    } else {
      capital.classList.remove("valid");
      capital.classList.add("invalid");
    }
  
    // Validate numbers
    let numbers = /[0-9]/g;
    if(regpassword.value.match(numbers)) {  
      number.classList.remove("invalid");
      number.classList.add("valid");
    } else {
      number.classList.remove("valid");
      number.classList.add("invalid");
    }
    //Validate special characters 
    let alphaSpecial = /[!@#$%^&*]/g;
    if(regpassword.value.match(alphaSpecial)) {  
      special.classList.remove("invalid");
      special.classList.add("valid");
    } else {
      special.classList.remove("valid");
      special.classList.add("invalid");
    }
    
    // Validate length
    if(regpassword.value.length >= 8) {
      length.classList.remove("invalid");
      length.classList.add("valid");
    } else {
      length.classList.remove("valid");
      length.classList.add("invalid");
    }
  }


registerform.addEventListener("submit",async (e)=>{
 e.preventDefault();
 let email=document.getElementById("email")
 let regpassword=document.getElementById("regpassword")
 let passwordConfirmation=document.getElementById("passwordrepeat")

 let fname=document.getElementById("fname")
let lname=document.getElementById("lname")
let zipcode=document.getElementById("zipcode")
let regularExpression  = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
let zipcodeExpression=/^[a-zA-Z0-9\s]{0,7}$/;
// let successMsg=document.getElementById("success")
let errorMsg=document.getElementById("regerror")


if(fname.value==""  || lname.value==""||email.value=="" || regpassword.value=="" || passwordConfirmation.value=="" ){
    errorMsg.innerHTML="All fields are required"
    errorMsg.style.color="red";
    
//alert("All fields are required")
}else if(fname.value.length<5){
  errorMsg.textContent="Please check the length of the first name, should be only 15 characters"
  errorMsg.style.color="red";
}else if(lname.value.length<5){
  errorMsg.textContent="Please check the length of the last name, should be only 15 characters"
  errorMsg.style.color="red";
}else if(email.value.length>30){
    
     errorMsg.textContent="Must be length of 30 characters"
     errorMsg.style.color="red";
    //alert("Must be length of 30 characters")
}else if(regpassword.value!=passwordConfirmation.value){
     errorMsg.textContent="Password not matching"
     errorMsg.style.color="red";
   // alert("Password not matching")
}
 else if (!regularExpression.test(regpassword.value)){
   errorMsg.textContent="Password should contain atleast one number, one uppercase character, one special character and atleast 8 or more characters"
   errorMsg.style.color="red";
 }
else if(!zipcodeExpression.test(zipcode.value)){
    errorMsg.textContent = "Invalid Zip Code";
    errorMsg.style.color="red";
  }
  // else if(zipcode.value.length>6){
  //   errorMsg.textContent = "Please check the length of the Zip Code";
  //   errorMsg.style.color="red";
  // }
 

else{
    const data1={
      fname:fname.value,
      lname:lname.value,
      email:email.value,
      regpassword:regpassword.value,
      passwordConfirmation:passwordConfirmation.value,
      zipcode:zipcode.value
      };
      
      let options1={
        method:'POST',
       headers: { "Content-type": "application/json; charset=UTF-8"  },
        body:JSON.stringify(data1)
      };
      const response1 = await fetch('/register', options1);
      
      //console.log(response)
       //const id= await response.json();
   //console.log(id);
   if(response1.status==200){
     errorMsg.textContent="Thank you for signing up to the account"
     errorMsg.style.color="green";
    //alert("Success")
    
  }
   else{
     errorMsg.textContent=`${email.value} already Exists. Please check.`
     errorMsg.style.color="red";
    // alert("User already Exists. Please check.")
   }
    }  
})
///Contact page

    let formContact=document.getElementById("myform");
    let yourName=document.getElementById("name");
    let yourEmail=document.getElementById("mail");
    let phoneNumber=document.getElementById("phone");
    let message=document.getElementById("message-contact");
    let errorMessage=document.getElementById("error")
    // let successMessage=document.getElementById("success")
    
    formContact.addEventListener("submit", async (event)=>{
        event.preventDefault();
        if(yourName.value=== ""  || yourEmail.value=== "" || phoneNumber.value=== "" || message.value=== ""){
           errorMessage.textContent="Please fill all the fields";
    errorMessage.style.color="red";
            
        }else if(yourName.value.length>5) {
            
            errorMessage.textContent="Please check the length of the characters";
    errorMessage.style.color="red";
    
          }else if(phoneNumber.value.length!==10){
            
            errorMessage.textContent="Please check the length of the mobile number";
    errorMessage.style.color="red";
            
    
    
          }else if(isNaN(phoneNumber.value) ){
          
           errorMessage.textContent="Please check the number. It should be only number";
    errorMessage.style.color="red";
    
          }else if(message.value.length>200){
              
              errorMessage.textContent="Please check the maximum length of characters";
    errorMessage.style.color="red";

          }
        else{
           //window.alert(`Your Name: ${yourName.value} \n Your Email: ${yourEmail.value} \n Your Phone NUmber: ${phoneNumber.value} \n Your Message: ${message.value}`);
           const data2={
            yourName: yourName.value,
            yourEmail:yourEmail.value,
            phoneNumber:phoneNumber.value,
            message:message.value
               
           };
          
           let options={
             method:'POST',
            headers: { "Content-type": "application/json; charset=UTF-8"  },
             body:JSON.stringify(data2)
           };
        
        const response = await  fetch('/contact', options);
        console.log(response)
          //   const id= await  response.json();
          //  console.log(id);
           if(response.status==200){
            errorMessage.textContent="Thank you for contacting us.";
            errorMessage.style.color="green"
           }else{
            console.log("error")
           }
        
          }

        
    });
}
///Login page
window.onload=function(){
let loginform=document.getElementById("loginform")
//Username
//Password (case-sensitive):
//Enter the code above here
//submit
}