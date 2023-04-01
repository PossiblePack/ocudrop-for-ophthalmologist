<template> 
    <div class="content bg">
        <div class="mx-5 rounded h-100 d-flex align-items-center justify-content-center">
            <div class="mt-3 container-fluid px-5 card">
                <div class="card-body">
                    <h2 class="mt-5 mb-4 d-flex justify-content-center">ระบบการเพิ่มยา</h2>
                    <form class="px-4" action="">
                        <div class="mb-4">
                            <div class="md-4 w-50 pb-4">
                                <label class="form-label">ชื่อยา</label>
                                <input class="form-control" type="text" id="medicineName" placeholder="กรุณาป้อนชื่อยา">
                            </div>
                            <div class="mb-4 w-75">
                                <label class="form-label">ข้อมูลยา</label>
                                <textarea class="form-control" id="data" cols="50" rows="3" placeholder="กรุณาป้อนข้อมูลยา" ></textarea>
                            </div>
                            <div class="mb-sm-4 w-100">
                                <label class="form-label">วิธีใช้ยา</label>
                                <form id="" class="card">
                                    <div class="text-start">
                                        <div class="form-option mx-5">
                                            <div class="py-3" id="option1">
                                                <input type="checkbox" name="" value="เช้า" id="sel-morning" class="checkbox text-start col-1">เช้า
                                                <input type="checkbox" name="" value="กลางวัน" id="sel-noon" class="checkbox col-2">กลางวัน
                                                <input type="checkbox" name="" value="เย็น" id="sel-evening" class="checkbox col-2">เย็น
                                                <input type="checkbox" name="" value="ก่อนนอน" id="sel-bedtime" class="checkbox col-2">ก่อนนอน
                                            </div>
                                            <div class="d-flex justify-content-end ">
                                                <button @click="addOption()" style="width: 50px;" class="btn bg-primary text-white justify-content-end">+</button>
                                            </div>
                                            <div class="pb-3 ps-3 group" id="option2">
                                                <label class="text-start text-label">วันละ</label>
                                                <input type="number" name="" id="times" class="col-sm-2">
                                                <label for="" class="col-sm-2 text-label">ครั้ง</label>
                                                <label for="" class="text-label">ทุกๆ</label>
                                                <input type="number" name="" id="period" class="col-sm-2">
                                                <label class="col-sm-2 text-label">ชั่วโมง</label>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div id="list_option"></div>
                            <div class="mb-4 w-75">
                                <label class="form-label">รูปยา</label>
                                <br>
                                <img class="mb-2 border border-dark" id="img" style="width: 75%;">
                                <div class="mb-4">
                                    <label class="form-label">อัพโหลดรูปยา</label>
                                    <div class="row">
                                        <input class="col-6 " type="file" name="selectImage" id="selectImage" @change="showPhoto($event)" >
                                    </div>
                                </div>
                            </div>
                            <div class="d-flex justify-content-center">
                                <button type="button" class="text-center btn bg-success text-white w-25 " @click="CreateNewMedicine()">บันทึกข้อมูล</button>
                            </div>
                            
                        </div>
                        </form>
                    </div> 
            </div>
        </div>
    </div>
</template>


<script>
import { addNewMedicineData, getLatestMedicineID, uploadProcess } from '../firebase.js'
export default {
    name: 'AddMedicine',
    async mounted() {
        this.latestID = await getLatestMedicineID();
        this.imgUrl = "";
    },
    methods: {
        addOption(){
            // alert("add")
            var checkboxes = document.querySelectorAll('.checkbox');
            const morning = document.getElementById('sel-morning');
            const noon = document.getElementById('sel-noon');
            const evening = document.getElementById('sel-evening');
            const bedtime = document.getElementById('sel-bedtime');
            const times = document.getElementById('times');
            const period = document.getElementById('period');  
            
            var checkboxexResult = [];
            var optionNo = 0;
            var stringResult = "";

            event.preventDefault();
            for(let i = 0; i < checkboxes.length; i++){
                if(checkboxes[i].checked == true){
                checkboxexResult.push(checkboxes[i].value);
                optionNo += 1
                }
            }

            if(morning.checked==false&&noon.checked==false&&evening.checked==false&&bedtime.checked==false){
                if(times.value==""&&period.value==""){
                alert('กรุณากรอกวิธีการใช้ยา');
                } else if(times.value==""){
                alert('กรุณากรอกจำนวนครั้งการใช้ยา');
                } else if(period.value==""){
                alert('กรุณากรอกระยะเวลาในการเว้นการใช้ยา');
                } else {
                const string = 'วันละ ' + times.value + ' ครั้ง (ทุก ' + period.value + ' ชั่วโมง)'
                stringResult = string
                this.listStringOption.push(stringResult)
                console.log(this.listStringOption)
                this.createElement(stringResult);
                }
            }else{
                const string = 'วันละ ' + optionNo + ' ครั้ง ' + checkboxexResult.join(' ');
                stringResult = string
                this.listStringOption.push(stringResult)
                console.log(this.listStringOption)
                this.createElement(stringResult);
            }
            this.resetForm()
        },
        createElement(stringResult){
            const list_el = document.getElementById('list_option');

            const option_card = document.createElement("div");
            option_card.classList.add("card");
            option_card.classList.add("mb-3");
            option_card.classList.add("w-75");

            const option_el = document.createElement("div");
            option_el.classList.add("task");
            option_el.classList.add("card-body");

            option_card.appendChild(option_el)

            const option_row_el = document.createElement("div");
            option_row_el.classList.add("row");

            option_el.appendChild(option_row_el)

            const option_content_el = document.createElement("div");
            option_content_el.classList.add("content");
            option_content_el.classList.add("col-sm-11");

            option_row_el.appendChild(option_content_el)

            const option_input_el = document.createElement("p");
            option_input_el.classList.add("text");
            option_input_el.innerHTML = stringResult;

            option_content_el.appendChild(option_input_el);

            const option_action_el = document.createElement("div");
            option_action_el.classList.add("col-sm-1");

            const option_delete_el = document.createElement("button");
            option_delete_el.classList.add("delete");
            option_delete_el.classList.add("btn");
            option_delete_el.classList.add("bg-danger");
            option_delete_el.classList.add("text-white");
            option_delete_el.innerHTML = "X";


            option_action_el.appendChild(option_delete_el);

            option_row_el.appendChild(option_action_el);

            list_el.appendChild(option_card);

            option_delete_el.addEventListener('click', () => {
                list_el.removeChild(option_card);
                let index = -1
                for(let i = 0; i<this.listStringOption.length ; i++){
                if(this.listStringOption[i] == option_input_el.innerHTML){
                    index = i
                }
                }
                this.listStringOption.splice(index,1)
                console.log(this.listStringOption)
            })
        },
        resetForm(){
            document.getElementById('sel-morning').checked=false
            document.getElementById('sel-noon').checked=false
            document.getElementById('sel-evening').checked=false
            document.getElementById('sel-morning').checked=false
            times.value = ""
            period.value = ""
        },
        showPhoto(event){
            // var extention, fileName
            var reader = new FileReader();
            this.files = event.target.files;

            let ext = this.GetExtName(this.files[0]);
            let name = this.GetName(this.files[0]);

            this.extention = ext
            this.fileName = name

            reader.readAsDataURL(this.files[0]);
            reader.onload = function(){
                document.getElementById('img').src = reader.result;
            }
        },
        GetExtName(file) {
            let temp = file.name.split(".");
            let ext = temp.slice((temp.length-1),(temp.length));
            return '.' + ext[0];
        },
        GetName(file){
            let temp = file.name.split('.');
            let name = temp.slice(0,-1).join('.');
            return name;
        },
        async CreateNewMedicine(){
            this.medicineName = document.getElementById("medicineName").value;
            this.data = document.getElementById("data").value;
            // alert('create')
            if(document.getElementById('selectImage').value == ''){
                var url = 'https://firebasestorage.googleapis.com/v0/b/dyeac-8fc86.appspot.com/o/medicineIMG%2Fno_image.png?alt=media&token=dc6fcead-7734-4c27-aac8-7b7e312db70e';
                addNewMedicineData(this.medicineName, this.data , url, this.listStringOption, this.latestID);
            }else{
                uploadProcess(this.files, this.fileName, this.extention, this.medicineName, this.data , this.listStringOption, this.latestID, "");
            }
        },
    },
    data () {
        return {
            listStringOption : [],
            files : [],
            extention: "", 
            fileName: "",
            medicineName: "",
            data:"",
            latestID: 0,
            imgUrl: ""
        }
    }
}
</script>

<style>
.text-label{
    font-size: 10px;
    color: black,
}
</style>