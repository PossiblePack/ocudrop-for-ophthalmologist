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
                                <!-- <br> -->
                                <div class="col-6">
                                    <label class="form-label d-flex justify-content-start">แพทย์ผู้ดูแล</label>
                                    <input class="form-control disabled" type="text" id="doctorname" required readonly>
                                </div>
                                <!-- <div class="col-6">
                                </div> -->
                                <div class="mt-4 d-flex justify-content-center col-12">
                                    <button type="submit" class="btn bg-success text-white"  >บันทึกข้อมูล</button>
                                    <!-- <button class="btn bg-success text-white" @click="hashPassword">hash password</button> -->
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
import { sha256 } from 'js-sha256';
import Swal from 'sweetalert2'

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
            Swal.fire({
              title: 'บันทึกการเปลี่ยนแปลง?',
              text: "แน่ใจหรือไม่ว่าต้องการลงทะเบียนผู้ป่วยคนนี้?",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#509a21',
              cancelButtonColor: '#808080',
              confirmButtonText: 'ใช่, ลงทะเบียน!',
              cancelButtonText: 'ยกเลิก'
            }).then(async (result) => {
              if (result.isConfirmed) {
                try{
                    if(password == repassword){
                        const hashPassword = this.hashPassword(password);
                        await createPatient(name, surname, phoneNO, email, hashPassword, dateTime, dname)
                    }else{
                        throw new Error("รหัสผ่านไม่ตรงกัน");
                    }
                }catch(error){
                    // alert(error)
                    Swal.fire({
                      icon: 'error',
                      title: 'มีปัญหาในการลงทะเบียนผู้ป่วย',
                      text: error,
                    })
                }
              }
            })
        },
        hashPassword(password){
            // const password = document.getElementById('password').value;
            var salt = 'ophthalmic_patient'
            var saltpass = salt+password;
            // console.log(saltpass)
            
            var enbytes = new TextEncoder().encode(saltpass);
            // console.log(enbytes)
            var hash = sha256.update(enbytes).toString();
            for (let i = 0; i < 411; i++) {
                enbytes = new TextEncoder().encode(hash);
                hash = sha256.update(enbytes).toString();
                // console.log(hash)
            }
            return hash.toString()
        },
        // decryptPassword(){
        //     // var debytes = new TextDecoder("utf-8").decode(enbytes);
        //     // for (let i = 0; i < 411; i++) {
        //     //     debytes = new TextEncoder("utf-8").decode(hash);
        //     //     hash = sha256.update(debytes).toString();
        //     //     // console.log(hash)
        //     // }
        //     // console.log(hash.toString())
        // }
    },
}
</script>

<style>

.card{
  border-radius: 25px;
}

</style>