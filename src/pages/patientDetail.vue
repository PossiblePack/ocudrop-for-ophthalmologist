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
                            <!-- <div class="mb-2">
                                <span class="form-label">แพทย์ผู้ดูแล: </span>
                                <span id="doctor" >{{patientData.doctor}}</span>
                            </div> -->
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
import $ from 'jquery' ;
import Swiper from 'swiper';

// Import Swiper styles
import 'swiper/swiper.min.css'

import { getlogdroptime, getPrescription, changeLocationToURL } from '../firebase.js'

export default {
    name: "PatientDetail",
    async created(){
        try{
            this.patientData = this.$route.params.data;
            await this.getMedicineList(this.patientData.history, this.medicineList)
        }
        catch(err){
            alert("error cause: " + err)
        }
    },
    async mounted(){
        this.setTable(); 
        setTimeout(()=> {
            this.setupSwiper();
        },800);
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
        async getMedicineList(history){
            try{
                history.forEach(async element => {
                var data = await getPrescription(element);
                if(data != undefined){
                  if(data.online == true){
                      this.createMedicineCardList(data);
                      console.log(data);
                  };
                }
              });
            }catch(err){
                alert("error cause: "+ err);
            }finally{
                this.setupSwiper();
            }
        },
        createMedicineCardList(med){
            const wrapper = document.querySelector('.swiper-wrapper');

            const swiper = document.createElement("div");
            swiper.classList.add("swiper-slide");
            // swiper.classList.add("card");
            swiper.classList.add("med-card");

            const row = document.createElement("div");
            row.classList.add("row");
            // row.classList.add("px-3");
            row.classList.add("py-3");

            const imgContainer = document.createElement("div");
            imgContainer.classList.add("col-5");

            const img = document.createElement("img");
            img.id = 'image';
            if(!med.imageURL.startsWith("https")){
              changeLocationToURL(med.imageURL, img);
            }else{
              img.src = med.imageURL;
            }


            imgContainer.appendChild(img);

            const info = document.createElement("div");
            info.classList.add("info");
            info.classList.add("text-black");
            info.classList.add("col-5");

            const labelName = document.createElement("p");
            labelName.innerHTML = "ชื่อยา: ";
            const name = document.createElement("p");
            name.innerHTML = med.medicineName;
            // const br1 = document.createElement("br");
            // const br2 = document.createElement("br");
            const labelUse = document.createElement("p");
            labelUse.innerHTML = "วิธีการใช้ยา: ";
            const use = document.createElement("p");
            use.innerHTML = med.useOption;

            info.appendChild(labelName);
            info.appendChild(name);
            // info.appendChild(br1);
            // info.appendChild(br2);
            info.appendChild(labelUse);
            info.appendChild(use);

            row.appendChild(imgContainer);
            row.appendChild(info);

            swiper.appendChild(row);

            wrapper.appendChild(swiper);
        },
    },
    
}
</script>

<style>

.swiper {
  width: 100%;
  height: 300px;
  overflow: hidden;
}

.swiper-wrapper {
  width: 90%;
  margin-right: 10px;
  margin-bottom: 20px;
}

.swiper-slide {
  font-size: 16px;
  background: #ffffff;

  display: -webkit-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;
}

.card{
  border-radius: 25px;
}

.med-card{
  background-color: #F1F9FF;
  border: 1px solid #358CED;
  width: 200px;
  height: 250px;
  overflow: hidden;
  border-radius: 30px;
} 

.med-card p{
  color: #000;
} 

.med-card img{
  align-self: center;
  width: 160px;
  height: 200px;
  border: 2px solid #000;
  object-fit: cover;
} 

.info{
  margin-left: 10px;
  height: 100%;
  width: 100%;
  overflow: hidden;
};

</style>
