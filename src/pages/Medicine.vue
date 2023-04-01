<!-- eslint-disable no-mixed-spaces-and-tabs -->
<template>
<section class="content bg">
    <div class="mx-5 d-flex align-items-center justify-content-center">
      <div class="mt-3 container-fluid card">
          <div class="mx-2 card-body">
				<h2 class="mt-5 mb-4 d-flex justify-content-center">ข้อมูลยา</h2>
              <div class="mb-4">
                  <div>
					<div class="d-flex justify-content-end">
						<router-link :to="`addmedicine`">
							<button class="mb-4 btn bg-primary text-white"><i class='bx bx-plus-medical'></i> เพิ่มยา</button>
						</router-link>
					</div>
					<table class=" table table-bordered display justify-content-center" id="medicineTable">
						<thead >
							<tr>
								<th style="width: 10%" class="bg-primary text-white" >รหัส</th>
								<th style="width: 10%" class="bg-primary text-white" >ชื่อยา</th>
								<th style="width: 20%" class="bg-primary text-white" >รูปยา</th>
								<th style="width: 20%" class="bg-primary text-white" >รายละเอียด</th>
								<!-- <th style="width: 20%" class="bg-primary text-white" >วิธีการใช้ยา</th> -->
								<th class="bg-primary text-white">การจัดการข้อมูล</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for=" medicine in  this.medicines" :key="medicine.medID">
								<td >{{medicine.medID}}</td>
								<td >{{medicine.name}}</td>
								<td ><img v-bind:src="medicine.imageURL" height="150px" alt=""></td>
								<td >{{medicine.data}}</td>
								<!-- <td >{{medicine.option}}</td> -->
								<td style="height: 150px;width: 100%;">
									<button class="btn bg-success text-white btn-sm h-25" @click="editMedicine(medicine.id,medicine.medID,medicine.name,medicine.imageURL,medicine.data,medicine.option)">
										แก้ไข
									</button>
									<!-- <button class="btn btn-danger btn-sm ms-5 h-25" @click="deleteMedicine(medicine.id)">
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
	async created() {
		await getMedicines(this.medicines).then( () => {
			setTimeout(()=> {
        	    this.setTable()
				localStorage.setItem('medicineList', JSON.stringify(this.medicines));
				// console.log(JSON.stringify(this.medicines))
        	},800);
		})
	},
	async mounted() {
		
		
	},
	methods: {
		setTable(){ 
			$('#medicineTable').DataTable({
				autoWidth: false,
				"columns": [
  				  { "width": "10%" , "height": "100%"},
  				  { "width": "10%" , "height": "100%"},
  				  { "width": "30%" , "height": "100%"},
  				  { "width": "30%" , "height": "100%"},
  				//   { "width": "30%" , "height": "100%"},
				  { "height": "100%"},
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
		editMedicine(id,medID,name,imageURL,data,option){
			var medicine = {
				medID: medID,
				imageURL: imageURL,
				name: name,
				data: data,
				option: option,
				id: id,
			};
			localStorage.setItem('medicineData', JSON.stringify(medicine));
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
.card{
	overflow: auto;	
}
</style>