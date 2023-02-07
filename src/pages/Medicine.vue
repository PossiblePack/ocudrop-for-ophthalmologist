<!-- eslint-disable no-mixed-spaces-and-tabs -->
<template>
<section class="content bg">
    <div class="mx-5 rounded h-100 d-flex align-items-center justify-content-center">
      <div class="mt-3 container-fluid px-5 card">
          <div class="card-body">
              <h1 class="mt-4 mb-4">ข้อมูลยา</h1>
              <div class="mb-4">
                  <div>
						<div class="d-flex justify-content-end">
							<button class="mb-4 btn bg-primary"><a href="addmedicine.html" style="text-decoration: none" class="text-white"><i class='bx bx-plus-medical'></i> เพิ่มยา</a></button>
						</div>
						<DataTable :data="data" class="display">
    					    <thead>
    					        <tr>
    					            <th style="width: 5%;">รหัส</th>
                    	              <th style="width: 10%;">ชื่อยา</th>
                    	              <th style="width: 20%;">รูปยา</th>
                    	              <th style="width: 20%;">รายละเอียด</th>
                    	              <th style="width: 20%;">วิธีการใช้ยา</th>
                    	              <th style="width: 13%;">
									  </th>
    					        </tr>
    					    </thead>
    					</DataTable>
                  </div>
              </div>
          </div>
      </div>
    </div>
</section>
</template>

<script>


// // Your web app's Firebase configuration
// // eslint-disable-next-line no-unused-vars
// const firebaseConfig = {
//   apiKey: "AIzaSyD3cuKqdUz7--QTLZ7gZNOrAvRi0dxyhDc",
//   authDomain: "dyeac-dev.firebaseapp.com",
//   projectId: "dyeac-dev",
//   storageBucket: "dyeac-dev.appspot.com",
//   messagingSenderId: "675710346530",
//   appId: "1:675710346530:web:ddf3b0114948ae5668f17b"
// };

// // Initialize Firebase
// // const app = initializeApp(firebaseConfig);


export default {
	name: 'App',
    components: {
	},
    data() {
      return {}
    },
	methods() {
		
	},	
	mounted (){
	},
}

</script>

<style>

</style>