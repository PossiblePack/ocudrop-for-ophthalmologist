<template>
  <div class="wrapper">
    <side-bar>
      <mobile-menu slot="content"></mobile-menu>
      <!-- <sidebar-link to="/admin/overview">
        <i class="nc-icon nc-chart-pie-35"></i>
        <p>แดชบอร์ด</p>
      </sidebar-link> -->
       <sidebar-link to="/admin/patient">
        <i class="nc-icon nc-notes"></i>
        <p>ข้อมูลผู้ป่วย</p>
      </sidebar-link>
      <sidebar-link to="/admin/medicine">
        <i class="nc-icon nc-notes"></i>
        <p>ข้อมูลยา</p>
      </sidebar-link>
      <sidebar-link to="/admin/registerpatient">
        <i class="nc-icon nc-single-02"></i>
        <p>ลงทะเบียนผู้ป่วยใหม่</p>
      </sidebar-link>
      
      <template slot="bottom-links">
        <div class="d-flex justify-content-center">
          <button style="width:90%" class="btn btn-danger rounded text-white" @click="logout">
            <i class="nc-icon nc-lock-circle-open icon-bold mx-1"></i>ออกจากระบบ
          </button>
        </div>
      </template>
    </side-bar>
    <div class="main-panel">
      <top-navbar ></top-navbar>

      <dashboard-content @click="toggleSidebar">

      </dashboard-content>

      <content-footer></content-footer>
    </div>
  </div>
</template>
<style lang="scss">

</style>
<script>
import { getAuth, signOut } from "firebase/auth";
import Swal from 'sweetalert2'
import TopNavbar from './TopNavbar.vue'
import ContentFooter from './ContentFooter.vue'
import DashboardContent from './Content.vue'
import MobileMenu from './MobileMenu.vue'
export default {
    components: {
      TopNavbar,
      ContentFooter,
      DashboardContent,
      MobileMenu
    },
    props: ["islogin"],
    methods: {
      toggleSidebar () {
        if (this.$sidebar.showSidebar) {
          this.$sidebar.displaySidebar(false)
        }
      },
      logout(){
        try{
          Swal.fire({
              title: 'ออกจากระบบ?',
              text: "แน่ใจหรือไม่ว่าต้องการออกจากระบบ?",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#d33',
              cancelButtonColor: '#808080',
              confirmButtonText: 'ใช่, ออก!',
              cancelButtonText: 'ยกเลิก'
            }).then(async (result) => {
              if (result.isConfirmed) {
                const auth = getAuth();
                signOut(auth).then(() => {
                  localStorage.clear();
                  this.$emit("show",false)
                  this.$router.push({ name: 'Login'})
                })
              }
            })
        }catch(err){
          Swal.fire({
                icon: 'error',
                title: 'มีปัญหาในการออกจากระบบ',
                text: err,
          })
        }
      }
    }
  }

</script>
