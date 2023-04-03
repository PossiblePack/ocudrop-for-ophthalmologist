<template>
  <div>
    <!-- <notifications></notifications> -->
    <router-view v-if="logedIn" islogin="true" @show="logedOut"></router-view>
    <login-page islogin="false" v-else class="h-100" @show="loginSuccess" ></login-page>
  </div>
</template>

<script>
import LoginPage from './pages/Login.vue'
import { getAuth, onAuthStateChanged} from "firebase/auth";
  export default {
    components: {
      LoginPage
    },
    created() {
      this.checkLoginStatus()
    },
    data () {
        return {
            logedIn: true,
        }
    },
    methods: {
      checkLoginStatus(){
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
          if (user) {
            // localStorage.setItem('UID', user.uid);
            // localStorage.setItem('Email', user.email);
            // localStorage.setItem('Password', user.password);
            this.logedIn = true
            this.$router.push({ name: 'Patient'})
          } else {
            this.logedIn = false
          }
        });
      },
      loginSuccess(value){
        this.logedIn = value
      },
      logedOut(value){
        this.logedIn = value
      },
    }
  }
</script>
<style lang="scss">
  .vue-notifyjs.notifications{
    .list-move {
      transition: transform 0.3s, opacity 0.4s;
    }
    .list-item {
      display: inline-block;
      margin-right: 10px;

    }
    .list-enter-active {
      transition: transform 0.2s ease-in, opacity 0.4s ease-in;
    }
    .list-leave-active {
      transition: transform 1s ease-out, opacity 0.4s ease-out;
    }

    .list-enter {
      opacity: 0;
      transform: scale(1.1);

    }
    .list-leave-to {
      opacity: 0;
      transform: scale(1.2, 0.7);
    }
  }
</style>
