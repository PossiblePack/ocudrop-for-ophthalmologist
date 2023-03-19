import DashboardLayout from '../layout/DashboardLayout.vue'
// GeneralViews
import NotFound from '../pages/NotFoundPage.vue'

// Admin pages
import Overview from 'src/pages/Overview.vue'
import Medicine from "src/pages/Medicine.vue";
import Patient from "src/pages/Patient.vue";
import RegisterPatient from "src/pages/Registerpatient.vue";
import UserProfile from 'src/pages/UserProfile.vue'
import AddMedicine from 'src/pages/AddMedicine.vue'
import EditMedicine from 'src/pages/EditMedicine.vue'
import patientDetail from 'src/pages/patientDetail.vue'
import EditMedicineList from 'src/pages/EditMedicineList.vue'
import Icons from 'src/pages/Icons.vue'
import Maps from 'src/pages/Maps.vue'
import Notifications from 'src/pages/Notifications.vue'
import Upgrade from 'src/pages/Upgrade.vue'
import Login from 'src/pages/Login.vue'


const routes = [
  {
    path: '/',
    component: Login,
    redirect: '/admin/login'
  },
  {
    path: '/admin',
    component: DashboardLayout,
    redirect: '/admin/patient',
    children: [
      {
        path: '/patient/:id', 
        name: 'patientDetail', 
        component: patientDetail, 
        meta: {auth: true}
      }, 
      {
        path: 'patient', 
        name: 'Patient', 
        component: Patient,
        meta: {auth: true}
      }, 
      {
        path: 'registerpatient', 
        name: 'RegisterPatient', 
        component: RegisterPatient ,
        meta: {auth: true}
      }, 
      {
        path: 'medicine', 
        name: 'Medicine', 
        component: Medicine,
        meta: {auth: true}
      },
      {
        path: 'addmedicine', 
        name: 'AddMedicine', 
        component: AddMedicine,
        meta: {auth: true}
      },
      {
        path: '/medicine/:id', 
        name: 'editMedicine', 
        component: EditMedicine,
        meta: {auth: true}
      }, 
      {
        path: '/medicineList/:id', 
        name: 'editMedicineList', 
        component: EditMedicineList,
        meta: {auth: true}
      }, 
      {
        path: 'login',
        name: 'Login',
        component: Login,
        meta: {auth: false}
      },
      
    ]
  },
  { path: '*', component: NotFound }
]


/**
 * Asynchronously load view (Webpack Lazy loading compatible)
 * The specified component must be inside the Views folder
 * @param  {string} name  the filename (basename) of the view to load.
function view(name) {
   var res= require('../components/Dashboard/Views/' + name + '.vue');
   return res;
};**/

export default routes
