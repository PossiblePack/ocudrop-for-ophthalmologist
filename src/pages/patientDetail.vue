<template> 
    <div class="content bg">
        <div class="mx-5 rounded h-100 d-flex align-items-center justify-content-center">
            <div class="mt-3 container-fluid px-5 card">
                <div class="card-body">
                    <h2 class="mt-5 mb-4 d-flex justify-content-center">ข้อมูลผู้ป่วย</h2>
                    <div class="mb-1">
                        <div class="mb-4 pb-4">
                            <h4  class="mb-2">ข้อมูลทั่วไป</h4>
                            <div class="mb-2">
                                <span class="form-label">ชื่อ-สกุล: </span>
                                <span id="fullname" >{{patientData.name}}  {{patientData.surname}}</span>
                            </div>
                            <div class="mb-2">
                                <span class="form-label">เบอร์โทรศัพท์: </span>
                                <span id="phoneNO" >{{patientData.phoneNo}}</span>
                            </div>
                            <div class="mb-2">
                                <span class="form-label">อีเมล: </span>
                                <span id="email" >{{patientData.email}}</span>
                            </div>
                            <h4  class="mb-2 mt-5" id="medLabel" v-if="haveMedicine">ยาที่ใช้อยู่</h4>
                            
                            <div v-if="haveMedicine">
                                <div id="medicineList" class="swiper mySwiper" v-if="haveMedicine">
                                    <div class="swiper-wrapper">
                                    </div>
                                    <div class="swiper-pagination"></div>  
                                </div>
                                <div class="d-flex justify-content-end pe-5">
                                    <button class="btn btn-link" @click="this.editMedicineList">แก้ไขรายการยา</button>
                                </div>
                            </div>
                            <h4 class="mb-2 mt-5" v-else>ยังไม่ได้จ่ายยา <button class="btn btn-link" @click="this.editMedicineList">จ่ายยา</button></h4>
                            <div v-if="logdrops.length!=0">
                                <h4 class="mb-2 mt-5"> ข้อมูลการหยอดตา</h4>
                                <form>
                                    <table class="table table-bordered display justify-content-center" >
                                        <thead class="bg-primary">
                                            <tr>
                                                <th class="text-white" style="width:25%">หยอดตาตามแจ้งเตือน (ครั้ง)</th>
                                                <th class="text-white" style="width:25%">หยอดตาโดยไม่ผ่านการแจ้งเตือน (ครั้ง)</th>  
                                                <th class="text-white" style="width:25%">เลื่อนเวลาหยอด (ครั้ง)</th>
                                                <th class="text-white" style="width:100%">รวมทั้งหมด (ครั้ง)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <th>{{notiCount}}</th>
                                                <th>{{withoutnotiCount}}</th>  
                                                <th>{{other}}</th>
                                                <th>{{notiCount+withoutnotiCount+other}}</th>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div>
                                        <table id="logdropdata" class="table table-bordered display justify-content-center" >
                                            <thead class="bg-primary">
                                                <tr>
                                                    <th class="text-white">วันที่หยอด</th>
                                                    <th class="text-white">ชื่อยา</th> 
                                                    <th class="text-white">เวลาที่ตั้งแจ้งเตือน</th>
                                                    <th class="text-white">เวลาที่หยอด</th>
                                                    <th class="text-white">หมายเหตุ</th>
                                                    <th class="text-white"></th>
                                                </tr>
                                            </thead>
                                        </table>
                                    </div>
                                </form>
                            </div>
                            <div v-else>
                                <h4 class="mb-2 mt-5">ยังไม่มีประวัติการหยอดตา</h4>
                            </div>
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
import Swal from 'sweetalert2'

// Import Swiper styles
import 'swiper/swiper.min.css'

import { getlogdroptimes, getPrescription, changeLocationToURL, getMedcineName } from '../firebase.js'
export default {
    name: "PatientDetail",
    async created(){
        try{
            this.getPatientData()
            if(this.patientData.history.length !== 0){
                this.haveMedicine = true;
                await this.getMedicineList(this.patientData.history, this.medicineList);
                // this.logdrops = await this.getlogdropList()
                this.logdrops = await getlogdroptimes(this.patientData.history, this.logdrops)
            }
        }
        catch(err){
            // alert("error cause: " + err)
            Swal.fire({
                icon: 'error',
                title: 'มีปัญหาในการโหลดข้อมูลผู้ป่วย',
                text: err,
            })
        }
    },
    async mounted(){
        setTimeout(()=> {
            this.setupSwiper();
        },2000);
    },
    data () {
        return {
            patientData: [],
            currentMedicine: [],
            oldMedicine: [],
            logdrops: [],
            haveMedicine: false,
            notiCount: 0, 
            withoutnotiCount: 0,
            other: 0,
        }
    },
    watch: {
        logdrops(val){
            this.addLogDropRow(val)
        },
    },
    methods: {
        addLogDropRow(val){
            // console.log(val)
            $('#logdropdata').DataTable()
                .destroy()
            $('#logdropdata').DataTable
            var table = $('#logdropdata').DataTable({
                columnDefs: [
                    {
                        target: 5,
                        visible: false,
                    },
                    { "width": "20%", "targets": 1 }
                ],
            });
            this.getLogdropOption(val);
            val.forEach(async element => {
                var name = await getMedcineName(element.pid);
                // console.log(element)
                table
                .row.add( [ element.realdate, name, element.scheduleTime, element.time, element.mark, element.date] )
                .draw()
                .order( [ 5, 'desc' ] )
                .node();
            });
        },
        getLogdropOption(logdrops){
            this.notiCount = 0
            this.withoutnotiCount=0
            this.other=0
            if(logdrops.length!==0){
                logdrops.forEach(element => {
                if(element.mark == "complete"){
                  this.notiCount+=1;
                //   console.log(this.notiCount)
                }else if(element.mark == "complete (without notification)"){
                  this.withoutnotiCount+=1;
                }else{
                  this.other+=1;
                }
            });
            }
        },
        getPatientData(){
            if(this.$route.params.data == null){
                this.patientData = JSON.parse(localStorage.getItem('patientData'));
            }else{
                this.patientData = this.$route.params.data;
            }
        },
        setupSwiper(){
            var swiper = new Swiper(".mySwiper", {
              slidesPerView: 2.5,
              spaceBetween: 20,
              pagination: {
                el: ".swiper-pagination",
                clickable: true,
              },
            });
        },
        editMedicineList(){
			this.$router.push({ name: 'editMedicineList', params: {current: this.currentMedicine, old: this.oldMedicine , id:this.patientData.docID, isEdited:false, addedMedicine: [], deletedMedicine: []}})
		},
        async getMedicineList(history){
            try{
                history.forEach(async element => {
                var data = await getPrescription(element);
                if(data != undefined){
                  if(data.online == true){
                      this.createMedicineCardList(data);
                      this.currentMedicine.push(data);
                    //   console.log(data);
                  }else{
                    this.oldMedicine.push(data);
                  }
                }
              });
            }catch(err){
                // alert("error cause: "+ err);
                Swal.fire({
                    icon: 'error',
                    title: 'มีปัญหาในโหลดข้อมูลรายการยา',
                    text: err,
                })
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
            // row.classList.add("ps-2");
            row.classList.add("pt-3");

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
            info.classList.add("col-6");

            const labelName = document.createElement("p");
            labelName.innerHTML = "ชื่อยา: ";
            const name = document.createElement("p");
            name.innerHTML = med.medicineName;
            const labelUse = document.createElement("p");
            labelUse.innerHTML = "วิธีการใช้ยา: ";
            const use = document.createElement("p");
            use.innerHTML = med.useOption;

            info.appendChild(labelName);
            info.appendChild(name);
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
  width: 90%;
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

.med-card img{
  align-self: center;
  width: 160px;
  height: 160px;
  border: 1px solid #000;
  object-fit: cover;
} 

.info{
  margin-left: 10px;
  height: 90%;
  width: 90%;
  overflow: hidden;
};

</style>
