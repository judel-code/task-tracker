<template>
  <div v-if="currentTask" class="task-view container">
      <router-link class="nav-link flex" :to="{name: 'Home'}">
        <img src="@/assets/icon-arrow-left.png" alt="" /> Go Back

      </router-link> 
      <!-- Header -->
      <div class="header flex">
         <div class="left flex">
            <span>Status</span>
              <div class="status-button flex" 
                  :class="{
                    completed: currentTask.taskCompleted, draft: currentTask.taskDraft, pending: currentTask.taskPending
                    }">
              
                  <span v-if="currentTask.taskCompleted">Completed</span>
                  <span v-if="currentTask.taskDraft">Draft</span>
                  <span v-if="currentTask.taskPending">In Progress</span>
              </div>
         </div>
         <div class="right flex">
              <button @click="toggleEditTask" class="dark-purple">Edit</button>
              <button @click="deleteTask(currentTask.docId)" class="red">Delete</button>
              <button v-if="currentTask.taskPending" @click="updateStatusToCompleted(currentTask.docId)" class="green">Mark as Completed</button>
              <button v-if="currentTask.taskDraft || currentTask.taskCompleted " @click="updateStatusToPending(currentTask.docId)" class="orange">Mark as Pending</button>
         </div>
      </div> 

      <!-- Task Details -->
      <div class="task-details flex flex-column">
        <div class="top flex">
           <div class="left flex flex-column">
              <p><span>#</span>{{ currentTask.taskId }}</p>
              <p>{{ currentTask.taskName }}</p>
           </div>
           <div class="right flex flex-column">
               <h4>Task Priority</h4>
               <p>{{ currentTask.priority }}</p>
               
           </div>
        </div>
        <div class="middle flex">
            <div class="task-dates flex flex-column">
                  <h4>Task Date</h4>
                  <p>{{ currentTask.taskDate }}</p>
                  <h4>Task Due Date</h4>
                  <p>{{ currentTask.taskDueDate }}</p>
            </div>
            <div class="employee-details flex flex-column">
              <h4>Employee Details</h4>
               <p>{{ currentTask.employeeName }}</p>
               <p>{{ currentTask.employeeEmail }}</p>
               
            </div>
            <div class="Department flex flex-column">
              <h4> Department</h4>
              <p>{{ currentTask.department }}</p>
               
               
            </div>
        </div>
        <div class="bottom flex flex-column">
          <div class="description flex flex-column">
               <h4> Task Description</h4>
               <p>{{ currentTask.taskDescription }}</p>
          </div>
          <div class="list-items flex flex-column">
            <div class="headings flex">
               <p>Check List Items</p>
            </div>
            <div v-for="(item, index) in currentTask.taskItemList" :key="index" class="item flex">
                <p>{{ item.itemName }}</p>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';

export default {
  name: "taskView",
  data() {
     return {
      currentTask: null,
     };
  },

  created() {
    this.getCurrentTask();
  },
  methods: {
    ...mapMutations(["SET_CURRENT_TASK", "TOGGLE_EDIT_TASK", "TOGGLE_TASK"]),

    ...mapActions(["DELETE_TASK", "UPDATE_STATUS_TO_COMPLETED", "UPDATE_STATUS_TO_PENDING"]),

    getCurrentTask() {
       this.SET_CURRENT_TASK(this.$route.params.taskId);
       this.currentTask = this.currentTaskArray[0];
    },

    toggleEditTask() {
      this.TOGGLE_EDIT_TASK();
      this.TOGGLE_TASK();
    },

    async deleteTask(docId) {
        await this.DELETE_TASK(docId);
        this.$router.push({name: "Home"});
    },

    updateStatusToCompleted(docId) {
        this.UPDATE_STATUS_TO_COMPLETED(docId);
    },

    updateStatusToPending(docId) {
        this.UPDATE_STATUS_TO_PENDING(docId);
    },
  },
  computed: {
    ...mapState(["currentTaskArray", "editTask"]),
  },
  
  // // the watch will update data in real time, once a user makes any update to the task
  watch: {
    editTask() {
      if (!this.editTask) {
        this.currentTask = this.currentTaskArray[0];
      }
    },
  },
};

</script>

<style lang="scss" scoped>
   .task-view {
      .nav-link{
        margin-bottom: 32px;
        align-items: center;
        color: #fff;
        font-size: 12px;
        img {
          margin-right: 16px;
          width: 12px;
          height: 12px;
        }
      }

      .header,
      .task-details {
        background-color: #1e2139;
        border-radius:20px;
      }

      .header {
        align-items: center;
        padding: 24px 32px;
        font-size: 12px;

        .left {
          align-items: center;

          span {
            color: #dfe3fa;
            margin-right: 16px;
          }
        }

        .right {
          flex: 1;
          justify-content: flex-end;

          button {
            color: #fff;
          }
        }
      }
      .task-details {
        padding: 48px;
        margin-top: 24px;

        .top {
          div {
            color: #dfe3fa;
            flex: 1;
          }

          .left {
             font-size: 12px;
             p:first-child {
               font-size: 24px;
               text-transform: uppercase;
               color: #fff;
               margin-bottom: 8px;
             }

             p:nth-child(2) {
              font-size:16px;
             }

             span {
              color:#888eb0;
             }
          }

          .right {
            font-size: 14px;
            align-items: flex-end;
          }
        }

        .middle {
           margin-top: 50px;
           color: #dfe3fa;
           gap: 16px;

          h4 {
            font-size: 12px;
            font-weight: 400;
            margin-bottom: 12px;
          }

          p {
            font-size: 16px;
          }

          .employee-details,
          .task-dates {
            flex: 1;
          }

          .task-dates {
            h4:nth-child(3) {
              margin-top: 25px;
            }

            p {
              font-weight: 400;
            }
          }

          .employee-details,
          .Department {
            p{
               font-size: 12px;
            }
          }

          .Department {
            flex: 1;
          }

        }

        .bottom {
          margin-top: 40px;
          gap: 16px;

          .list-items {
            margin-top: 10px;
            //  padding: 32px;
            //  border-radius: 20px 20px 0 0;
            //  background: #251945;

             .headings {
              color:#dfe3fa;
              font-size: 14px;
              font-weight: 400;
              margin-bottom: 16px;

              p:first-child {
                flex: 3;
                text-align:left
              }
             }

             .item {
              
              font-size: 12px;
              color: #fff;
              

            }
          }

          .description{
            color: #dfe3fa;

            h4 {
            font-size: 14px;
            font-weight: 400;
            margin-bottom: 12px;
          }

          p {
            font-size: 12px;
            color: #fff;
          }
          }
        }
      }
   }
</style>

<!-- 3:18:58 -->

