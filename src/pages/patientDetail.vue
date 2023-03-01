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
import { getlogdroptime, getPrescription } from '../firebase.js'

export default {
    name: "PatientDetail",
    async created(){
        this.patientData = this.$route.params.data
        this.id = this.patientData.id
        this.history = this.patientData.history
        await getPrescription(this.history, this.medicineList);
    },
    async mounted(){
        this.setupSwiper();
        this.setTable();
        // this.setMedicineList(this.medicineList);
        // await getlogdroptime(this.id, this.logdrops)
    },
    data () {
        return {
            patientData: [],
            medicineList: [],
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
        },
        setMedicineList(medicineList){
            console.log(medicineList);
            // Array.prototype.forEach.call(medicineList, medicine => {
            //   // ...
            //   console.log(medicine);
            // })
            // medicineList.forEach(medicine => {
            //     console.log(medicine['medicineName']);
            // });
            // medicineList.forEach(element => {
            //     // console.log(medicineList[element].medName);
            //     console.log(element);
            //     this.createMedicineCardList(medicineList[element].medName, medicineList[element].imgURL, medicineList[element].useOption);
            // });
        },
        createMedicineCardList(medName, imgURL, useOption){
            const wrapper = document.querySelector('.swiper-wrapper');

            const swiper = document.createElement("div");
            swiper.classList.add("swiper-slide");
            swiper.classList.add("card");
            swiper.classList.add("med-card");

            const row = document.createElement("div");
            row.classList.add("row");
            row.classList.add("px-3");
            row.classList.add("py-3");

            const imgContainer = document.createElement("div");
            imgContainer.classList.add("col-5");

            const img = document.createElement("img");
            img.id = 'image';
            if(!imgURL.startsWith("https")){
              changeLocationToURL(imgURL, img);
            }else{
              img.src = imgURL;
            }


            imgContainer.appendChild(img);

            const info = document.createElement("div");
            info.classList.add("info");
            info.classList.add("col-5");

            const labelName = document.createElement("LABEL");
            labelName.innerHTML = "ชื่อยา: ";
            const name = document.createElement("LABEL");
            name.innerHTML = medName;
            const br1 = document.createElement("br");
            const br2 = document.createElement("br");
            const labelUse = document.createElement("LABEL");
            labelUse.innerHTML = "วิธีการใช้ยา: ";
            const use = document.createElement("LABEL");
            use.innerHTML = useOption;

            info.appendChild(labelName);
            info.appendChild(name);
            info.appendChild(br1);
            info.appendChild(br2);
            info.appendChild(labelUse);
            info.appendChild(use);

            row.appendChild(imgContainer);
            row.appendChild(info);

            swiper.appendChild(row);

            wrapper.appendChild(swiper);
        },
    }
}
</script>

<style>



</style>