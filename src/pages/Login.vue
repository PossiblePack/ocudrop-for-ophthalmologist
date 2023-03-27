<template> 
    <div class="content">
        <div class="row justify-content-center">
            <div class="col-lg-5">
                <div class="card shadow-lg border-0 rounded-lg mt-5">
                    <div class="card-header"><h3 class="text-center font-weight-light my-4">ลงชื่อเข้าใช้</h3></div>
                    <div class="card-body">
                        <form id="form" form v-on:submit="login">
                            <div class="form-floating mb-4 mx-3">
                                <label for="inputEmail">อีเมล</label>
                                <input class="form-control" id="inputEmail" type="email" placeholder="name@example.com" />
                            </div>
                            <div class="form-floating mb-4 mx-3">
                                <label for="inputPassword">รหัสผ่าน</label>
                                <input class="form-control" id="inputPassword" type="password" placeholder="Password" />
                            </div>
                            <!-- <div class="form-check mb-3">
                                <input class="form-check-input" id="inputRememberPassword" type="checkbox" value="" />
                                <label class="form-check-label" for="inputRememberPassword">จำรหัสผ่าน</label>
                            </div> -->
                            <div class="d-flex align-items-center justify-content-center mt-4 mb-0">
                                <button class="btn btn-primary" id="login" type="submit" @click="login">เข้าสู่ระบบ</button>
                            </div>
                        </form>
                    </div>
                    <div class="card-footer d-flex align-items-center text-center justify-content-between py-3">
                        <!-- <div class="small"><a href="register.html">ต้องการลงทะเบียนผู้ใช้ใหม่</a></div>
                        <a class="small" href="password.html">ลืมรหัสผ่าน?</a> -->
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
export default {
    name: "Login",
    methods: {
        async login(e){
            e.preventDefault();
            
        },
    },
}
</script>

<style>

.card{
  border-radius: 25px;
}
.sidebar{
  display: block ;
  /* height: 0%;
  width: 0%; */
  background-color: #D4E8F7;
}
/* .nav-link {
    pointer-events: none;
    display: none;
} */
</style>