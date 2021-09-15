
const registerButton = document.querySelector('#register-button')



registerButton.addEventListener('click', () => {
    //hit the add end point
    console.log('register event Trriggered');
    alert("sucessfully registered");
    const payload ={
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            first_name : document.querySelector('#signupFirstname').value,
            last_name : document.querySelector('#signupLastname').value,
            email : document.querySelector('#signupEmail').value,
            password : document.querySelector('#signupPwd').value
        })
    }
    fetch('/register',payload)
    .then(async (res) => { 
        if(res.ok) {
            const resobj = await res.json();
            localStorage.setItem("token", resobj.token);
        }
    })
    .catch(err=>{console.log(err)});

})