<template> 
    <div class="content bg">
        <div class="mx-5 rounded h-100 d-flex align-items-center justify-content-center">
            <div class="mt-3 container-fluid px-5 card">
                <div class="card-body">
                    <h2 class="W-75 mt-5 mb-4 d-flex justify-content-center">ระบบการจ่ายยา</h2>
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
                        <div class="mt-3">
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
                        <div class="mb-5 col-6 d-flex justify-content-center justify-item-center">
                            <img id="medImage" width="350" height="300">
                        </div>
                    </div>
                    <footer class="modal-footer d-flex justify-content-center">
                        <button class="add action" @click="addMedicine">เพิ่มยา</button>
                    </footer>
                </div>  
            </div>
        </div>
    </div>
</template>


<script>
import $ from 'jquery' ;
import Swal from 'sweetalert2'
export default {
    name: "AddMedicineToList",
    created() {
        this.medicines = this.$route.params.medicines;
        this.currentMedicines = this.$route.params.currentMedicines;
        this.addedMedicine = this.$route.params.addedMedicine;
        this.deletedMedicine = this.$route.params.deletedMedicine;
        this.userID = this.$route.params.id;
        this.oldMedicines = this.$route.params.old; 
        $("#medName").select2({
            placeholder: "Select a state",
            allowClear: true
        });
    },
    methods: {
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
                currentMedicine: [],
                oldMedicines: [],
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
                this.isEdited = true
                this.$router.push({ name: 'editMedicineList', params: {current: this.currentMedicines, old: this.oldMedicines, id:this.userID, isEdited: true,addedMedicine: this.addedMedicine}})
                // console.log(this.presription)
            }catch(error){
                // alert(error)
                Swal.fire({
                      icon: 'error',
                      title: 'มีปัญหาในการเพิ่มยา',
                      text: error,
                      })
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
    },
    data () {
        return {
            isEdited: false,
            userID: [],
            oldMedicines: [],
            currentMedicines: [],
            medicines: [],
            presription: [],
            eyeOptions: ["ตาทั้ง 2 ข้าง","ตาข้างซ้าย","ตาข้างขวา"],
            optionSelect: "",
            optionList: [],
            eyeSelect: "",
            addedMedicine: [],
            deletedMedicine: [],
        }
    },
}
</script>

<style>

.card{
  border-radius: 25px;
}
.medImage{
    border: 2px solid #000;
    height: 100%;
}
</style>