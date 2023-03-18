<template> 
    <main >
        <Popup 
        v-if="isShowModal"
        @close="close"
        >
        <template #body>
            <div class="row ">
                <div class="col-6 from-body">
                    <div class="w-100">
                        <label class="form-label">ชื่อยา</label>
                        <Select2 
                                v-model="presription" 
                                :options="medicines" 
                                :settings="{ width: '100%' }" 
                                @select="SelectMedEvent($event)"
                                @change="ChangeMedEvent($event)"
                                class="medName"
                                />
                        <label class="form-label">วิธีการหยอด</label>
                        <Select2 
                                v-model="eyeSelect" 
                                :options="eyeOptions" 
                                :settings="{ width: '100%' }" 
                                @select="SelectEyesEvent($event)"
                                id="eyeOption"
                                />
                        <label class="form-label">วิธีการใช้ยา</label>
                        <Select2 
                                v-model="optionSelect" 
                                :options="optionList" 
                                :settings="{ width: '100%' }" 
                                @select="SelectOptionEvent($event)"
                                id="option"
                        />
                    </div>
                    <!-- <div class="d-flex justify-content-end mx-1 mt-2">
                        <button style="height:30px" class="btn btn-secondary " @click="toggleManualOption"><i class="nc-icon nc-settings-gear-64"></i></button>
                    </div> -->
                    <div v-if="manualConfig" class="mt-3">
                        <label class="form-label">เลือกวิธีการใช้ยาเอง</label>
                        <div class="py-1" id="option1 ">
                            <input type="checkbox" value="เช้า" id="sel-morning" class="checkbox text-start col-1">เช้า
                            <input type="checkbox" value="กลางวัน" id="sel-noon" class="checkbox col-1">กลางวัน
                            <input type="checkbox" value="เย็น" id="sel-evening" class="checkbox col-1">เย็น
                            <input type="checkbox" value="ก่อนนอน" id="sel-bedtime" class="checkbox col-1">ก่อนนอน
                        </div>
                        <div class="row mt-2">
                            <div class="col-6">
                                <label class="form-label">จำนวนครั้งต่อวัน</label>
                                <input type="text" id="times" class="form-control">
                            </div>
                            <div class="col-6">
                                <label class="form-label">ใช้ทุกๆ (ชั่วโมง)</label>
                                <input type="text" id="period" class="form-control">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-6 d-flex justify-content-center justify-item-center">
                    <img id="medImage" width="200px" height="200px">
                </div>
            </div>
        </template>
        <template #footer>
            <button class="add action" @click="addMedicine">เพิ่มยา</button>
        </template>
        </Popup>
        <div class="mx-5 rounded d-flex align-items-center justify-content-center">
            <div class="mt-3 container-fluid px-5 card">
                <div class="card-body">
                    <h2 class="mt-5 mb-4 d-flex justify-content-center">ระบบการจ่ายยา</h2>
                    <form class="mt-4 mb-4" >
                            <div class="d-flex justify-content-center" >
                                <div class="mb-2 w-100">
                                    <ul id="currentMed" class="list-group">
                                        <h5 class="mx-2">รายการยาปัจจุบัน ({{currentMedicines.length}})</h5>
                                        <li v-for=" (medicine, index) in  this.currentMedicines" :key="index" id="currentMedicine" class="list-group-item mx-2 pb-1 my-2">
                                            <span class="mx-2">ชื่อยา: {{medicine.medicineName}}</span>
                                            <br>
                                            <span class="mx-2">วิธีการหยอด: {{medicine.eyeOption}}</span>
                                            <span class="mx-2">จำนวนการใช้: {{medicine.useOption}}</span>
                                            <div class="btn-group">
                                                <!-- <button class="action btn-info btn-sm mr-1 ml-1" @click="editMed(medicine)">แก้ไข</button> -->
                                                <button class="action btn-danger btn-sm mr-1 ml-1" @click="deleteMed(index,medicine)">ลบ</button>
                                            </div>
                                        </li>
                                        <div class="my-2 d-flex justify-content-center">
                                            <button class="add action mx-2 " @click="callPopup">เพิ่มยา</button>
                                            <button class="btn bg-success text-white" @click="submitMedicineList" v-if="isEdited">บันทึกข้อมูล</button>
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
import { getMedicines, createPrescription, disableMedicine } from '../firebase.js'
import Popup from '../components/Popup.vue'
import $ from 'jquery' ;
export default {
    name: "EditMedincineList",
    components: {
        Popup,
    },
    created() {
        this.userID = this.$route.params.id;
        this.currentMedicines = this.$route.params.current;
        this.oldMedicines = this.$route.params.old;        
    },    
    async mounted(){
        await this.getMedicineList()
        this.history = JSON.parse(localStorage.getItem('patientData')).history;
    },
    data () {
        return {
            userID: [],
            oldMedicines: [],
            currentMedicines: [],
            addedMedicine: [],
            deletedMedicine: [],
            isShowModal: false,
            eyeOptions: ["ตาทั้ง 2 ข้าง","ตาข้างซ้าย","ตาข้างขวา"],
            presription: [],
            optionList: [],
            eyeSelect: "",
            optionSelect: "",
            manualConfig: true,
            medicines: [],
            history: [],
            isEdited: false,
        }
    },
    methods: {
        async getMedicineList(){
            if (localStorage.getItem("medicineList") === null) {
                await getMedicines(this.medicines)
                localStorage.setItem('medicineList', JSON.stringify(this.medicines));
                // alert('from firebase')
            }else{
                this.medicines = JSON.parse(localStorage.getItem('medicineList'));
                // alert('from local storage')
            }
        },
        getManualOption(){
            var checkboxes = document.querySelectorAll('.checkbox');
            const times = document.getElementById('times');
            const period = document.getElementById('period');  
            
            var checkboxexResult = [];
            var optionNo = 0;

            for(let i = 0; i < checkboxes.length; i++){
                if(checkboxes[i].checked == true){
                checkboxexResult.push(checkboxes[i].value);
                optionNo += 1
                }
            }

            if(checkboxexResult.length==0){
                if(times.value==""&&period.value==""){
                    throw new Error('กรุณากรอกวิธีการใช้ยา');
                } else if(times.value==""){
                    throw new Error('กรุณากรอกจำนวนครั้งการใช้ยา');
                } else if(period.value==""){
                    throw new Error('กรุณากรอกระยะเวลาในการเว้นการใช้ยา');
                } else {
                    const string = 'วันละ ' + times.value + ' ครั้ง (ทุก ' + period.value + ' ชั่วโมง)'
                    this.optionSelect = string;
                    console.log(this.optionSelect);
                }
            }else{
                if(period.value!=""&&times.value!=""){
                    throw new Error('กรุณาเลือกอย่างใดอย่างหนึ่ง');
                }else{
                    const string = 'วันละ ' + optionNo + ' ครั้ง ' + checkboxexResult.join(' ');
                    this.optionSelect = string;
                    console.log(this.optionSelect);
                }
            }
        },
        addMedicine(){
            try{
                if(this.optionSelect==""){
                    this.getManualOption()
                }
                this.presription.useOption = this.optionSelect
                this.presription.eyeOption = this.eyeSelect
                this.presription.createTime = new Date(Date.now());
                this.presription.lastModified = new Date(Date.now());
                this.currentMedicines.push(this.presription)
                this.addedMedicine.push(this.presription)
                this.close()
                this.isEdited = true
                // console.log(this.presription)
            }catch(error){
                alert(error)
            }
        },
        deleteMed(index,medicine){
            let text = "คุณแน่ใจไหมว่าต้องการลบยา " + medicine.medicineName + " ออกจากรายการยา " 
            if (confirm(text) == true) {
                // text = "You pressed OK!";
                this.currentMedicines.splice(index,1)
                this.isEdited = true
                this.deletedMedicine.push(medicine);
            } else {
                // text = "You canceled!";
            }
        },
        async submitMedicineList(e){
            e.preventDefault();
            try{
                if(this.deletedMedicine.length!=0){
                    this.deletedMedicine.forEach( (element) =>  {
                        if(this.addedMedicine.length>0){
                            if(this.addedMedicine.includes(element)){
                                // alert('delete added medicine name' + element.medicineName)
                                var index = this.addedMedicine.indexOf(element)
                                this.addedMedicine.splice(index,1)
                            }else{
                                disableMedicine(element.pid)
                            }
                        }else{
                            disableMedicine(element.pid)
                        }
                    })
                }
                if(this.addedMedicine.length!=0){
                    await createPrescription(this.addedMedicine,this.history)
                }
            }catch(error){
                alert(error)
            } finally {
                // alert("แก้ไขรายการยาสำเร็จแล้ว")
                // this.$router.push({ name: 'Patient'})
            }
        },
        close(){
            this.isShowModal = false
        },
        callPopup() {
             $("#medName").select2({
                placeholder: "Select a state",
                allowClear: true
            });
            this.isShowModal = true
        },
        myChangeEvent(val){
            console.log(val);
        },
        SelectMedEvent({data, id, imageURL, medID, option, text}){
            //reset manual option
            this.optionSelect="";
            let checkbox = document.querySelectorAll(".checkbox")
            checkbox.forEach((element) => element.disabled = false)
            document.getElementById("times").disabled = false;
            document.getElementById("period").disabled = false;

            console.log({id, text, imageURL, medID, option, data})
            this.presription = {
                createTime: "",
                eyeOption: "",
                imageURL: imageURL,
                lastModified: "",
                medicineName: text,
                medicineNameThai: data,
                online: true,
                pid: "",
                uid: this.userID,
                useOption: "",
            }
            this.optionList = option;
            document.getElementById('medImage').src = imageURL;
        },
        SelectOptionEvent({text}){
            //disable manual option
            let checkbox = document.querySelectorAll(".checkbox")
            checkbox.forEach((element) => element.disabled = true)
            document.getElementById("times").disabled = true;
            document.getElementById("period").disabled = true;

            //set option 
            this.optionSelect = text
        },
        SelectEyesEvent({text}){
            this.eyeSelect = text
        },
        toggleManualOption(){
            this.manualConfig = !this.manualConfig
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
.medImage{
    border: 2px solid #000;

}.from-body{
    justify-content: center;

}
</style>