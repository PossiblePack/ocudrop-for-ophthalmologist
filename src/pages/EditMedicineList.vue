<template> 
    <main >
        <Popup 
        v-if="isShowModal"
        @close="close"
        >
        <template #body>
            <div class="row">
                <div class="col-6">
                    <label class="form-label">ชื่อยา</label>
                    <input type="text" class="form-control">
                    <div class="row mt-2">
                        <div class="col-6">
                            <label class="form-label">จำนวนครั้งต่อวัน</label>
                            <input type="text" class="form-control">
                        </div>
                        <div class="col-6">
                            <label class="form-label">ใช้ทุกๆ (ชั่วโมง)</label>
                            <input type="text" class="form-control">
                        </div>
                    </div>
                </div>
                <div class="col-6 d-flex justify-content-center justify-item-center">
                    <img  width="200px" height="200px">
                </div>
            </div>
        </template>
        <template #footer>
            <button class="add action ">เพิ่มยา</button>
        </template>
        </Popup>
        <div class="mx-5 rounded h-100 d-flex align-items-center justify-content-center">
            <div class="mt-3 container-fluid px-5 card">
                <div class="card-body">
                    <h2 class="mt-5 mb-4 d-flex justify-content-center">ระบบการจ่ายยา</h2>
                    <form class="mt-4 mb-4" action="">
                            <div class="d-flex justify-content-center">
                                <div class="mb-2 w-100">
                                    <ul id="currentMed" class="list-group">
                                        <h5 class="mx-2">รายการยาปัจจุบัน ({{currentMedicines.length}})</h5>
                                        <li v-for=" medicine in  this.currentMedicines" :key="medicine.pid" id="currentMedicine" class="list-group-item mx-2 pb-1 my-2">
                                            <span class="mx-2">ชื่อยา: {{medicine.medicineName}}</span>
                                            <br>
                                            <span class="mx-2">วิธีการหยอด: {{medicine.eyeOption}}</span>
                                            <span class="mx-2">จำนวนการใช้: {{medicine.useOption}}</span>
                                            <div class="btn-group">
                                                <button class="action btn-info btn-sm mr-1 ml-1">แก้ไข</button>
                                                <button class="action btn-danger btn-sm mr-1 ml-1">ลบ</button>
                                            </div>
                                        </li>
                                        <div class="btn-add my-2 d-flex justify-content-center">
                                            <button class="add action" @click="callPopup">เพิ่มยา</button>
                                        </div>
                                        
                                    </ul>
                                    <ul id="oldMed" class="list-group">
                                        <h5 class="mx-2">รายการยาที่เคยจ่าย ({{oldMedicines.length}})</h5>
                                        <li v-for=" medicine in  this.oldMedicines" :key="medicine.pid" id="oldMedicine" class="list-group-item mx-2 pb-1 ">
                                            <div class="myDIV justify-content-between">
                                                <span>ชื่อยา: {{medicine.medicineName}}</span>
                                                <span>วิธีการหยอด: {{medicine.eyeOption}}</span>
                                                <span>จำนวนการใช้: {{medicine.useOption}}</span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                    </form>
                </div>  
            </div>
        </div>
    </main>
</template>


<script>

// import { getlogdroptime, getPrescription, changeLocationToURL } from '../firebase.js'

import Popup from '../components/Popup.vue'

import Swiper from 'swiper';

// Import Swiper styles
import 'swiper/swiper.min.css'

export default {
    name: "EditMedincineList",
    components: {
        Popup,
    },
    created() {
        this.currentMedicines = this.$route.params.current;
        this.oldMedicines = this.$route.params.old;        
    },
    mounted(){
    },
    data () {
        return {
            oldMedicines: [],
            currentMedicines: [],
            isShowModal: false,
            modalTitle: "",
        }
    },
    methods: {
        getMedicineList(medicineList){
            try{
                medicineList.forEach(async element => {
                if(element != undefined){
                  if(element.online == true){
                      await this.createMedicineCardList(element);
                    //   this.medicineList.push(data);
                    //   console.log(element);
                  };
                }
              });
            }catch(err){
                alert("error cause: "+ err);
            }finally{
                this.setupSwiper();
            }
        },
        close(){
            this.isShowModal = false
        },
        callPopup() {
            this.isShowModal = true
        },
    },
}
</script>

<style lang="scss">

.list-group{
    margin: 10px;
    /* background-color: #88cbff; */
} 

.list-group-item{
    margin: 5px;
    background-color: #F1F9FF;
    
    overflow: auto;
    border-radius: 10px;
}

.action{
    border-radius: 10px;
}

.btn-group{
    float: right;
}

.add{
    border: 1px solid #cecece;
    border-radius: 10px;
    width: 10%;
    background: #F1F9FF;
}

.myDIV{
  display: flex;
  justify-content: space-evenly;
  border-radius: 25px;
}

ul#oldMed li 
{
    background-color: rgb(246, 240, 240);
    border: 1px solid #cecece;
    /* color: #fff; */
}

ul#currentMed li 
{
     border: 1px solid #358CED;
    /* color: #fff; */
}



</style>