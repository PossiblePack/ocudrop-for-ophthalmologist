<template> 
    <div class="content bg">
        <div class="mx-5 rounded h-100 d-flex align-items-center justify-content-center">
            <div class="mt-3 container-fluid px-5 card">
                <div class="card-body">
                    <h2 class="mt-5 mb-4 d-flex justify-content-center">ข้อมูลผู้ป่วย</h2>
                    <div class="mb-1 mx-4">
                        <div class="mb-4 pb-4">
                            <h4  class="mb-2">ข้อมูลทั่วไป</h4>
                            <div class="mb-2">
                                <span class="form-label">ชื่อ-สกุล: </span>
                                <span id="fullname" >{{patientData.name}}  {{patientData.surname}}</span>
                            </div>
                            <div class="mb-2">
                                <span class="form-label">เบอร์โทรศัพท์: </span>
                                <span id="phoneNO" >{{patientData.phoneNO}}</span>
                            </div>
                            <!-- <div class="mb-2">
                                <span class="form-label">รหัสผ่าน: </span>
                                <span id="password" >{{patientData.password}}</span>
                            </div> -->
                            <div class="mb-2">
                                <span class="form-label">อีเมล: </span>
                                <span id="email" >{{patientData.email}}</span>
                            </div>
                            <div class="mb-2">
                                <span class="form-label">แพทย์ผู้ดูแล: </span>
                                <span id="doctor" >{{patientData.doctor}}</span>
                            </div>
                            <h4  class="mb-2 mt-5" id="medLabel">ยาที่ใช้อยู่</h4>
                            <div>
                                <div id="medicineList" class="swiper mySwiper">
                                    <div class="swiper-wrapper">
                                    </div>
                                    <div class="swiper-pagination"></div>  
                                </div>
                            </div>
                            <h4 class="mb-2 mt-5"> ข้อมูลการหยอดตา</h4>
                            <form>
                                <div>
                                    <table id="logdropdata" class="table table-bordered display justify-content-center" >
                                        <thead class="bg-primary">
                                            <tr>
                                                <th class="text-white">วันที่หยอด</th>
                                                <th class="text-white">เวลาที่หยอด</th>
                                                <th class="text-white">ชื่อยา</th>  
                                                <th class="text-white">เวลาที่ตั้งแจ้งเตือน</th>
                                                <th class="text-white">หมายเหตุ</th>
                                            </tr>
                                        </thead>
                                        <tbody id="t_logdropbody"></tbody>
                                    </table>
                                    <table  id="dropOption" class="mt-5 table table-bordered display justify-content-center" >
                                        <thead class="bg-primary">
                                            <tr>
                                                <th class="text-white" style="width: 33%;">หยอดตาตามแจ้งเตือน</th>
                                                <th class="text-white" style="width: 33%;">หยอดตาโดยไม่ผ่านการแจ้งเตือน</th>  
                                                <th class="text-white" >เลื่อนเวลาหยอด</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <th id="dropwithnoti"></th>
                                                <th id="dropwithoutnoti"></th>  
                                                <th id="dropwithother"></th>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>  
            </div>
        </div>
    </div>
</template>


<script>
// import Swiper bundle with all modules installed
import Swiper, { Navigation, Pagination } from 'swiper';
import $ from 'jquery' ;
// import styles bundle
// import 'swiper/css/bundle';
import { getlogdroptime} from '../firebase.js'

export default {
    name: "PatientDetail",
    created(){
        this.patientData = this.$route.params.data
        this.id = this.patientData.id
    },
    async mounted(){
        this.setupSwiper();
        this.setTable();
        // await getlogdroptime(this.id, this.logdrops)
    },
    data () {
        return {
            patientData: [],
            logdrops: [],
        }
    },
    methods: {
        setTable(){ 
			$('#logdropdata').DataTable({})
		},
        setupSwiper(){
            var swiper = new Swiper(".mySwiper", {
              slidesPerView: 2,
              spaceBetween: 20,
              pagination: {
                el: ".swiper-pagination",
                clickable: true,
              },
            });
        }
    }
}
</script>

<style>



</style>