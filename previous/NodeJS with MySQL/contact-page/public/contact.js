window.onload=function(){
    let formContact=document.getElementById("myform");
    let yourName=document.getElementById("name");
    let yourEmail=document.getElementById("mail");
    let phoneNumber=document.getElementById("phone");
    let message=document.getElementById("message");
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
        
        const response = await  fetch('/', options);
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

    };

   
