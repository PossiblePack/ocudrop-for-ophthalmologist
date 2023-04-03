<template> 
    <main >
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
                                                <button class="btn bg-danger text-white " @click.prevent="deleteMed(index,medicine)">ลบ</button>
                                                
                                            </div>
                                        </li>
                                        <div class="my-2 d-flex justify-content-center">
                                            <button class="add action mx-2 " @click.prevent="addNewMedicine">เพิ่มยา</button>
                                            <button class="btn bg-success text-white" @click.prevent="submitMedicineList" v-if="isEdited">บันทึกข้อมูล</button>
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
import Swal from 'sweetalert2'
import { getMedicines, createPrescription, disableMedicine } from '../firebase.js'
export default {
    name: "EditMedincineList",
    created() {
        this.userID = this.$route.params.id;
        this.currentMedicines = this.$route.params.current;
        this.oldMedicines = this.$route.params.old;
        this.addedMedicine = this.$route.params.addedMedicine;
        this.deletedMedicine = this.$route.params.deletedMedicine;
        this.isEdited = this.$route.params.isEdited;
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
            eyeOptions: ["ตาทั้ง 2 ข้าง","ตาข้างซ้าย","ตาข้างขวา"],
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
        deleteMed(index,medicine){
            let text = "คุณแน่ใจไหมว่าต้องการลบยา " + medicine.medicineName + " ออกจากรายการยา " 
            Swal.fire({
              title: 'ลบ?',
              text: text,
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#d33',
              cancelButtonColor: '#808080',
              confirmButtonText: 'ใช่, ลบ!',
              cancelButtonText: 'ยกเลิก'
            }).then(async (result) => {
              if (result.isConfirmed) {
                this.currentMedicines.splice(index,1)
                this.isEdited = true
                this.deletedMedicine.push(medicine);
                this.oldMedicines.push(medicine);
              }
            })
        },
        async submitMedicineList(e){
            e.preventDefault();
            Swal.fire({
              title: 'ยืนยันการเปลี่ยนแปลง?',
              text: "แน่ใจหรือไม่ว่าต้องการทำการบันทึกการเปลี่ยนแปลงรายการยา?",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#509a21',
              cancelButtonColor: '#808080',
              confirmButtonText: 'ใช่, บันทึก!',
              cancelButtonText: `ยกเลิก`
            }).then(async (result) => {
              if (result.isConfirmed) {
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
                    // alert(error)
                    Swal.fire({
                      icon: 'error',
                      title: 'มีปัญหาในการแก้ไขรายการยา',
                      text: error,
                    })
                }
              }
            })
        },
        addNewMedicine() {
            this.$router.push({ name: 'AddMedicineToList', params: { old: this.oldMedicines , id:this.userID, addedMedicine: this.addedMedicine,deletedMedicine: this.deletedMedicine, medicines: this.medicines, currentMedicines: this.currentMedicines }})
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

}
.from-body{
    justify-content: center;

}
</style>