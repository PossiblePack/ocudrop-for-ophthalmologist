<!-- eslint-disable no-mixed-spaces-and-tabs -->
<template>
<section class="content bg">
    <div class="mx-5 rounded h-100 d-flex align-items-center justify-content-center">
      <div class="mt-3 container-fluid card">
          <div class="mx-2 card-body">
				<h2 class="mt-5 mb-4 d-flex justify-content-center">ข้อมูลยา</h2>
              <div class="mb-4">
                  <div>
					<router-link :to="`addmedicine`">
						<div class="d-flex justify-content-end">
							<button class="mb-4 btn bg-primary text-white"><i class='bx bx-plus-medical'></i> เพิ่มยา</button>
						</div>
					</router-link>
					<table class=" table table-bordered display justify-content-center" id="medicineTable">
						<thead class="bg-primary">
							<tr>
								<th class="text-white" >รหัส</th>
								<th class="text-white" >ชื่อยา</th>
								<th class="text-white" >รูปยา</th>
								<th class="text-white" >รายละเอียด</th>
								<th class="text-white" >วิธีการใช้ยา</th>
								<th class="text-white" ></th>
							</tr>
						</thead>
						<tbody>
							<tr v-for=" medicine in  this.medicines" :key="medicine.medID">
								<td style="width: 5%;">{{medicine.medID}}</td>
								<td style="width: 5%;">{{medicine.name}}</td>
								<td style="width: 20%;"><img v-bind:src="medicine.imageURL" width="250px" alt=""></td>
								<td style="width: 20%;">{{medicine.data}}</td>
								<td style="width: 20%;">{{medicine.option}}</td>
								<td >
									<button class="btn btn-success btn-sm " @click="editMedicine(medicine.id,medicine.medID,medicine.name,medicine.imageURL,medicine.data,medicine.option)">
										แก้ไข
									</button>
									<button class="btn btn-danger btn-sm ms-5" @click="deleteMedicine(medicine.id)">
										ลบ
									</button>
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
import { getMedicines, deleteMedicine } from '../firebase.js'
export default {
	name: 'Medicine',
	setup() {
		return { deleteMedicine }
	},
	components: {
		LTable,
      	Card,
    },
	async mounted() {
		await getMedicines(this.medicines)
		this.setTable()
	},
	methods: {
		setTable(){ 
			$('#medicineTable').DataTable({})
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
		editMedicine(id,medID,name,imageURL,data,option){
			var medicine = {
				medID: medID,
				imageURL: imageURL,
				name: name,
				data: data,
				option: option,
				id: id,
			};
			this.$router.push({ name: 'editMedicine', params: {data: medicine , id:id}})
		},
	},
	data () {
		return {
			medicines: []
		}
	  }
	}

</script>

<style>

</style>