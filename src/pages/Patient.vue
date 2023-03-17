<!-- eslint-disable no-mixed-spaces-and-tabs -->
<template>
<section class="content bg">
    <div class="mx-5 rounded h-100 d-flex align-items-center justify-content-center">
      <div class="mt-3 container-fluid card">
          <div class="mx-2 card-body">
				<h2 class="mt-5 mb-4 d-flex justify-content-center">ข้อมูลผู้ป่วย</h2>
              <div class="mb-4">
                  <div>
					<table class=" table table-bordered  justify-content-center" id="patientTable">
						<thead class="bg-primary">
							<tr>
								<th class="text-white" >ชื่อ-สกุล</th>
								<th class="text-white" >เบอร์โทรศัพท์</th>
								<th class="text-white" >วันที่สร้างบัญชี</th>
								<th class="bg-primary text-white">การจัดการข้อมูล</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for=" patient in  this.patients" :key="patient.medID">
								<td >{{patient.name+" "+patient.surname}}</td>
								<td >{{patient.phoneNo}}</td>
								<td >{{patient.createTime}}</td>
								<td >
									<button class="btn btn-primary btn-sm " @click="patientDetail(patient)">
										ข้อมูลเพิ่มเติม
									</button>
									<!-- <button class="btn btn-danger btn-sm ms-5" @click="deletePatient(medicine.id)">
										ลบ
									</button> -->
								</td>
							</tr>
						</tbody>
					</table>
                  </div>
              </div>
          </div>
      </div>
    </div>
</section>
</template>

<script>
import LTable from 'src/components/Table.vue'
import Card from 'src/components/Cards/Card.vue'
import $ from 'jquery' ;
import 'datatables.net-buttons-bs5';
import 'datatables.net-responsive-bs5';
import { getPatient } from '../firebase.js'
export default {
	name: 'Patient',
	components: {
		LTable,
      	Card,
    },
	async mounted() {
		await getPatient(this.patients)
		this.setTable()
		localStorage.removeItem("patientData");
	},
	methods: {
		setTable(){ 
			$('#patientTable').DataTable({
				responsive: true,
				autoWidth: false,
				"columns": [
  				  { "width": "30%"},
  				  { "width": "30%"},
  				  { "width": "30%"},
  				  {},
  				]
			})
		},
		// setMedicineOption(){
		// 	var optionString = ""
		// 	if(this.medicines.option>1){
		// 	  for(var i = 0; i< medOption.length; i++){
		// 	    optionString += i+1+". " + this.medicines.option[i] + "\n"
		// 	  }
		// 	}else{
		// 		optionString = medOption.toString()
		// 	}
		// },
		patientDetail(patient){
			this.$router.push({ name: 'patientDetail', params: {data: patient , id:patient.docID}})
			localStorage.setItem('patientData', JSON.stringify(patient));
		},
	},
	data () {
		return {
			patients: [],
		}
	  }
	}

</script>

<style>
/* .action{
	width: 10%;
} */
</style>