<template>
    <div class="wrapper-lg">
        <div class="logo-lg">
            <img src="https://firebasestorage.googleapis.com/v0/b/dyeac-8fc86.appspot.com/o/assets%2FOcuDrop.png?alt=media&token=c838689e-a902-4479-9df5-62fb0bb52579" alt="">
        </div>
        <div class="text-center mt-4 name">
            OcuDrop
        </div>
        <div class="text-center mt-4 name">
            ระบบจัดการข้อมูลผู้ป่วยโรคตา
        </div>
        <form class="p-3 mt-3" form v-on:submit="login">
            <div class="form-field d-flex align-items-center">
                <span class="nc-icon nc-single-02"></span>
                <input class="form-control" id="inputEmail" type="email" placeholder="name@example.com" required/>
            </div>
            <div class="form-field d-flex align-items-center">
                <span class="nc-icon nc-key-25"></span>
                <input class="form-control" id="inputPassword" type="password" placeholder="Password" required/>
            </div>
            <div class="d-flex justify-content-center">
                <button class="btn mt-3" type="submit" >Login</button>
            </div>
        </form>
    </div>
</template>


<script>
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Swal from 'sweetalert2'
export default {
    name: "Login",
    methods: {
        async login(e){
            e.preventDefault();
            
            var email = document.getElementById('inputEmail').value
            var password = document.getElementById('inputPassword').value
            // alert(email+" "+password)

            const auth = getAuth();
            signInWithEmailAndPassword(auth, email, password)
              .then(async (userCredential) => {
                // Signed in 
                const user = userCredential.user;
                // localStorage.setItem('UID', user.uid);
                // localStorage.setItem('Email', email);
                // localStorage.setItem('Password', password);
                // alert(user.uid);

                this.$emit("show",true)
                this.$router.push({ name: 'Patient'})
              })
              .catch((error) => {
                Swal.fire({
                    icon: 'error',
                    title: 'มีปัญหาในการลงชื่อเข้าใช้',
                    text: error,
                })
            });
        },
        
    },
    props:["islogin"]
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Poppins', sans-serif;
}

body {
    background-color: #D4E8F7;
}

.wrapper-lg {
    max-width: 500px;
    min-height: 500px;
    margin: 80px auto;
    padding: 40px 30px 30px 30px;
    background-color: #f2f9fe;
    border-radius: 15px;
    box-shadow: 13px 13px 20px #cbced1, -13px -13px 20px #fff;
}

.logo-lg {
    width: 80px;
    margin: auto;
}

.logo-lg img {
    width: 100%;
    height: 80px;
    object-fit: cover;
    border-radius: 50%;
    box-shadow: 0px 0px 3px #5f5f5f,
        0px 0px 0px 5px #ecf0f3,
        8px 8px 15px #a7aaa7,
        -8px -8px 15px #fff;
}

.wrapper-lg .name {
    font-weight: 600;
    font-size: 1.4rem;
    letter-spacing: 1.3px;
    padding-left: 10px;
    color: #555;
}

.wrapper-lg .form-field input {
    width: 100%;
    display: block;
    border: none;
    outline: none;
    background: none;
    font-size: 1.2rem;
    color: #666;
    padding: 10px 15px 10px 10px;
    /* border: 1px solid red; */
}

.wrapper-lg .form-field {
    padding-left: 10px;
    margin-bottom: 20px;
    border-radius: 20px;
    box-shadow: inset 8px 8px 8px #cbced1, inset -8px -8px 8px #fff;
}

.wrapper-lg .form-field .fas {
    color: #555;
}

.wrapper-lg .btn {
    box-shadow: none;
    
    width: 50%;
    height: 40px;
    background-color: #03A9F4;
    color: #fff;
    border-radius: 25px;
    box-shadow: 3px 3px 3px #b1b1b1,
        -3px -3px 3px #fff;
    letter-spacing: 1.3px;
}

.wrapper-lg .btn:hover {
    background-color: #039BE5;
}

.wrapper-lg a {
    text-decoration: none;
    font-size: 0.8rem;
    color: #03A9F4;
}

.wrapper-lg a:hover {
    color: #039BE5;
}

@media(max-width: 380px) {
    .wrapper-lg {
        margin: 30px 20px;
        padding: 40px 15px 15px 15px;
    }
}
</style>