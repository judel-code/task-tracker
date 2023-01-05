<template>
   <div v-if="tasksLoaded">
      <div v-if="!mobile" class="app flex flex-column">
        <Navigation /> 
        <div class="app-content flex flex-column">
          <CancelModal v-if="modalActive" />
          <transition name="task">
            <TaskModal v-if="taskModal" /> 
          </transition>
          <router-view />
        </div>
      </div>
      <div v-else class="mobile-message flex flex-column">
        <h2>Sorry, this app is not supported on Mobile Devices</h2>
      <p>To use this app, please use a computer or Tablet</p>
      </div>
</div> 
</template>

<!-- we need to have script tags in order to import different components -->

<script>
import {mapState, mapActions} from 'vuex'
import Navigation from "./components/Navigation.vue";
import TaskModal from "./components/TaskModal.vue";
import CancelModal from "./components/CancelModal.vue";
export default {
  data() {
     return {
      mobile: null,
     };
  },
   components: {
    Navigation,
    TaskModal,
    CancelModal,
   },

   created () {
    this.GET_TASKS();
    this.checkScreen();
    window.addEventListener("resize", this.checkScreen);
   },

   methods: {

    ...mapActions(['GET_TASKS']),


    // this method will constantly check the screen size, if the screen size is ever lower the 750 pixel, a message will pop up to inform the user "this web app is not supported on mobile"
    checkScreen() {
       const windowWidth =window.innerWidth;
       if(windowWidth <= 500) {
          this. mobile = true;
          return;
       }
       this.mobile = false;
    }
   },
   computed: {
      ...mapState(["taskModal", "modalActive", "tasksLoaded"])
   }
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap");

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
}

.app{
  background-color: #141625;
  min-height: 100vh;
  @media (min-width: 900px) {
    flex-direction: row !important;;
  }

  .app-content {
    padding: 0 20px;
    flex: 1;
    position: relative;
  }
}

.mobile-message {
   text-align: center;
   justify-content: center;
   align-items: center;
   height: 100vh;
   background-color: #141625;
   color: #fff;

   p {
    margin: top 16px;
   }
}

// animation
.task-enter-active,
.task-leave-active {
  transition: 0.8s ease all;
}

.task-enter-from,
.task-leave-to {
  transform: translateX(-700px);
}


button,
.button {
  cursor: pointer;
  padding: 16px 24px;
  border-radius: 30px;
  border: none;
  font-size: 12px;
  margin-right: 8px;
  color: #fff;
}

.dark-purple {
  background-color: #252945;
}

.red {
  background-color: #ec5757;
}

.purple {
  background-color: #9CC3D5FF;
}

.green {
  background-color: #33d69f;
}

.orange {
  background-color: #ff8f00;
}

// utility classes

.flex {
  display: flex;
}

.flex-column {
  flex-direction: column;
}

.container {
  width: 100%;
  padding: 40px 10px;
  max-width: 850px;
  margin: 0 auto;

  @media (min-width: 900px) {
    padding-top: 72px;
  }
}

.nav-link {
  text-decoration: none;
  color: initial;
}

// Status Button Styling

.status-button {
  &::before {
    content: "";
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 8px;
  }
  font-size: 12px;
  margin-right: 30px;
  align-items: center;
  padding: 8px 30px;
  border-radius: 10px;
}

.completed {
  &::before {
    background-color: #33d69f;
  }
  color: #33d69f;
  background-color: rgba(51, 214, 160, 0.1);
}

.pending {
  &::before {
    background-color: #ff8f00;
  }
  color: #ff8f00;
  background-color: rgba(255, 145, 0, 0.1);
}

.draft {
  &::before {
    background-color: #dfe3fa;
  }
  color: #dfe3fa;
  background-color: rgba(223, 227, 250, 0.1);
}
</style>
