<template> 
    <div class="content bg">
        <div class="mx-5 rounded h-100 d-flex align-items-center justify-content-center">
            <div class="mt-3 container-fluid px-5 card">
                <div class="card-body">
                    <h2 class="mt-5 mb-4 d-flex justify-content-center">ลงทะเบียนผู้ป่วยใหม่</h2>
                    <form class="mt-4 mb-4" action="" form v-on:submit="registerPatient">
                            <div class="row ">
                                <div class="col-6">
                                    <label class="form-label">ชื่อ</label>
                                    <input class="form-control" type="text" id="name" placeholder="กรุณาป้อนชื่อ" required>
                                </div>
                                <div class="col-6">
                                    <label class="form-label">นามสกุล</label>
                                    <input class="form-control" type="text" id="surname" placeholder="กรุณาป้อนนามสกุล" required>
                                </div>
                                <div class="col-6">
                                    <label class="form-label">เบอร์โทรศัพท์</label>
                                    <input class="form-control" type="tel" id="phoneNO" placeholder="กรุณาป้อนเบอร์โทรศัพท์" required>
                                </div>
                                <div class="col-6">
                                    <label class="form-label">อีเมล</label>
                                    <input class="form-control" type="email" id="email" placeholder="กรุณาป้อนอีเมล" >
                                </div>
                                <div class="col-6">
                                    <label class="form-label">รหัสผ่าน</label>
                                    <input class="form-control" type="password" id="password" placeholder="กรุณาป้อนรหัสผ่าน" required>
                                </div>
                                <br>
                                <div class="col-6">
                                    <label class="form-label">ยืนยันรหัสผ่าน</label>
                                    <input class="form-control" type="password" id="repassword" placeholder="กรุณาป้อนรหัสผ่าน" >
                                </div>
                                <br>
                                <div class="col-6">
                                    <label class="form-label d-flex justify-content-start">แพทย์ผู้ดูแล</label>
                                    <input class="form-control disabled" type="text" id="doctorname" required readonly>
                                </div>
                                <div class="col-6">
                                </div>
                                <div class="mt-4">
                                    <button type="submit" class="btn bg-success text-white"  >บันทึกข้อมูล</button>
                                </div>
                            </div>
                    </form>
                </div>  
            </div>
        </div>
    </div>
</template>


<script>
import { createPatient } from '../firebase.js'


export default {
    name: "RegisterPatient",
    methods: {
        async registerPatient(e){
            e.preventDefault();
            const name = document.getElementById('name').value;
            const surname = document.getElementById('surname').value;
            const phoneNO = document.getElementById('phoneNO').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const repassword = document.getElementById('repassword').value;
            const dname = document.getElementById('doctorname').value;
            const dateTime = new Date(Date.now());

            if(password == repassword){
                await createPatient(name, surname, phoneNO, email, password, dateTime, dname)
            }else{
                alert("password mismatch");
            }
            // alert(name + " " + surname + " " + phoneNO + " " + email + " " + password + " " + repassword);
        },
    },
}
</script>

<style>

.card{
  border-radius: 25px;
}

</style>