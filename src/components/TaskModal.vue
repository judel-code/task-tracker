<template>
    <div @click="checkClick" ref="taskWrap" class="task-wrap flex flex-column">
        <!-- we will create a form in this div  -->
        <form @submit.prevent="submitForm" class="task-content">
            <Loading v-show="loading"/>
             <h1 v-if="!editTask">New Task</h1>
             <h1 v-else>Edit Task</h1>
             
             <!--task name-->
             <h4>Task Details</h4>
             <div class="task-name flex flex-column">
               <div class="input flex flex-column">
                    <label for="taskName">Task Name</label>
                    <input required type="text" id="taskName" v-model="taskName" />
               </div>
                <div class="task-details flex">
                    <div class="input flex flex-column">
                        <label for="priority">Priority</label>
                        <select required id= "priority" v-model="priority">
                            <option>Low</option>
                            <option>Medium</option>
                            <option>Important</option>
                            <option>Urgent</option>
                        </select> 
                    </div>
                    <div class="input flex flex-column">
                        <label for="department">Department</label>
                        <select required id= "department" v-model="department">
                            <option disabled value="">Please select one</option>
                            <option>IT</option>
                            <option>Sales</option>
                            <option>Marketing</option>
                        </select> 
                    </div>
                </div>
                 <!-- task details-->
                <div class="task-details flex">
                    <div class="input flex flex-column">
                        <label for="taskDate">Task Date</label>
                        <input disabled type="text" id="taskDate" v-model="taskDate" />  
                    </div>
                    <div class="input flex flex-column">
                        <label for="taskDueDate">Task Due</label>
                        <input disabled type="text" id="taskDueDate" v-model="taskDueDate" />  
                    </div>
                </div>
                <div class="input flex flex-column">
                    <label for="taskTerms">Task Estimated Time</label>
                    <select required type="text" id="taskTerms" v-model="taskTerms">
                    <option value="30">30 Minutes</option>
                    <option value="60"> 1 Hour</option>
                    <option value="1440"> 1 Day</option>
                    <option value="10080"> 1 Week</option>
                    <option value="43200"> 1 Month</option>
                    </select>
               </div>
               <div class="input flex flex-column">
                    <label for="taskDescription">Task Description</label>
                    <input required type="text" id="taskDescription" v-model="taskDescription" />
               </div>
               <div class="work-items">
                <h3>Check List</h3>
                <table class="item-list">
                    <tr class="table-heading flex">
                        <th class="item-name">Item Name</th>
                    </tr>
                    <tr class="table-items flex" v-for="(item, index) in taskItemList" :key="index">
                        <td class="item-name"><input type="text" v-model="item.itemName"></td>
                        <img @click="deleteTaskItem(item.id)" src="@/assets/icon-delete.png" alt="">
                    </tr>
                </table>
                   <div @click="addNewTask" class="flex button">
                    <img src="@/assets/icon-plus.png" alt="">
                    Add New Item
                   </div>
               </div>
             </div>

             <!--employee info-->
             <div class="task-info flex flex-column">
                <h4>Employee Information</h4>
                <div class="input flex flex-column">
                  <label for="employeeName">Employee Name</label>
                  <input required type="text" id="employeeName" v-model="employeeName" />  
                </div>
                <div class="input flex flex-column">
                  <label for="employeeEmail">Employee Email</label>
                  <input required type="text" id="employeeEmail" v-model="employeeEmail" />

                </div>
             </div>
             
             <!--Save/Exit-->
             <div class="save flex ">
               <div class="left">
                <button type="button" @click="closeTask" class="red">Cancel</button>
               </div> 
               <div class="right flex">
                <button v-if="!editTask" type="submit" @click="saveDraft" class="dark-purple">Save Draft</button>
                <button  v-if="!editTask" type="submit" @click="publishTask" class="purple">Create Task</button>
                <button v-if="editTask" type="submit" class="purple">Update Task</button>
               </div> 
             </div>
             
        </form>
    </div>
  
</template>

<script>
import db from '../firebase/firebaseInit'
import { mapActions, mapMutations, mapState } from 'vuex'
// to create a new id for each new task, we will import uid
import {uid} from 'uid'
import Loading from "../components/Loading.vue"
export default {
   name: "TaskModal",
//    import all the data that will be sent to firebase
data() {
       return{
            dateOptions: {year: "numeric", month: "short", day: "numeric", hour: "numeric", minute:"numeric"},
            docId: null,
            loading: null,
            taskName: null,
            employeeName: null,
            employeeEmail: null,
            department: null,
            priority: null,
            taskDateUnix: null,
            taskDate: null,
            taskTerms: null,
            taskDueDateUnix: null,
            taskDueDate: null,
            taskDescription: null,
            taskPending: null,
            taskDraft: null,
            taskItemList: [],
            

       };
   },
    components: {
     Loading,   
    },
   created() {
       // get current date for task date field
       if (!this.editTask) {
        this.taskDateUnix = Date.now();
        this.taskDate = new Date(this.taskDateUnix).toLocaleDateString('en-us',this.dateOptions);
       }

       if(this.editTask) {
         const currentTask = this.currentTaskArray[0];
            this.docId = currentTask.docId;
            this.taskName = currentTask.taskName;
            this.employeeName = currentTask.employeeName;
            this.employeeEmail = currentTask.employeeEmail;
            this.department = currentTask.department;
            this.priority = currentTask.priority;
            this.taskDateUnix = currentTask.taskDateUnix;
            this.taskDate = currentTask.taskDate;
            this.taskTerms = currentTask.taskTerms;
            this.taskDueDateUnix = currentTask.taskDueDateUnix;
            this.taskDueDate = currentTask.taskDueDate;
            this.taskDescription = currentTask.taskDescription;
            this.taskPending = currentTask.taskPending;
            this.taskDraft = currentTask.taskDraft;
            this.taskItemList = currentTask.taskItemList;

       }
      
       

   },
   methods: {
    ...mapMutations(["TOGGLE_TASK", "TOGGLE_MODAL", "TOGGLE_EDIT_TASK"]),

    ...mapActions(['UPDATE_TASK','GET_TASKS']),

    // function to check user clicks
    checkClick(e){
        if(e.target === this.$refs.taskWrap){
            this.TOGGLE_MODAL();
        }
    },

    // function to toggle the new task modal
    closeTask() {
     
        this.TOGGLE_TASK();
        if (this.editTask) {
            this.TOGGLE_EDIT_TASK();
        }
    },

    // function to add items to the check list 
    addNewTask()
    {
       this.taskItemList.push({
        id: uid(), // uid will generate a unique id
        itemName: "",
       })
    },

    // function to delete check list items
    deleteTaskItem(id){
       this.taskItemList = this.taskItemList.filter((item) => item.id !== id);
    },

    // function to publish task
    publishTask() {
      this.taskPending = true;  
    },

    // function to save task draft
    saveDraft() {
      this.taskDraft = true;  
    },
    
    async uploadTask() {
      
        // if (this.taskItemList.length <= 0) {
        //     alert('please ensure you filled out work items!');
        //     return;  
        // }
        
        // turn loading on
        this.loading = true;
        // connecting to the firebase database

         const dataBase = db.collection('tasks').doc();

         // sending all date to the firebase database
         await dataBase.set({
            taskId: uid(4),
            taskName: this.taskName,
            employeeName: this.employeeName,
            employeeEmail: this.employeeEmail,
            department: this.department,
            priority: this.priority,
            taskDateUnix: this.taskDateUnix,
            taskDate: this.taskDate,
            taskTerms: this.taskTerms,
            taskDueDateUnix: this.taskDueDateUnix,
            taskDueDate: this.taskDueDate,
            taskDescription: this.taskDescription,
            taskPending: this.taskPending,
            taskDraft: this.taskDraft,
            taskItemList: this.taskItemList,
            taskCompleted: null,
            
         });
        
         // turn loading off
        this.loading = false;

         // close the task modal after submitting task
         this.TOGGLE_TASK();

         this.GET_TASKS();

    },

    async updateTask() {
      
    //   if (this.taskItemList.length <= 0) {
    //       alert('please ensure you filled out work items!');
    //       return;  
    //   }
      
      // turn loading on
      this.loading = true;
      // connecting to the firebase database

       const dataBase = db.collection('tasks').doc( this.docId);

       // updating data on firebase database
       await dataBase.update({

          taskName: this.taskName,
          employeeName: this.employeeName,
          employeeEmail: this.employeeEmail,
          department: this.department,
          priority: this.priority,
          taskDateUnix: this.taskDateUnix,
          taskDate: this.taskDate,
          taskTerms: this.taskTerms,
          taskDueDateUnix: this.taskDueDateUnix,
          taskDueDate: this.taskDueDate,
          taskDescription: this.taskDescription,
          taskItemList: this.taskItemList,
          
       });
      
       // turn loading off
      this.loading = false;


      const data = {

         docId : this.docId,
         routeId: this.$route.params.taskId,
      };

       // update task content 
       this.UPDATE_TASK(data);

  },

    submitForm() {

      if (this.editTask) {
         this.updateTask();
         return;
      }

      this.uploadTask();  

    },
   },

   computed: {
    ...mapState(["editTask", "currentTaskArray"]),
   },
 // checking when user pick a task estimated time
   watch: {
    taskTerms() {
       
      // calculating in minutes
      const futureDate = new Date();
      this.taskDueDateUnix = futureDate.setMinutes(futureDate.getMinutes() + parseInt(this.taskTerms));
      this.taskDueDate = new Date(this.taskDueDateUnix).toLocaleDateString("en-us", this.dateOptions);

      // calculating in hours
    //   const futureDate = new Date();
    //   this.taskDueDateUnix = futureDate.setDate(futureDate.getDate() + parseInt(this.taskTerms));
    //   console.log(this.taskTerms);
    //   this.taskDueDate = new Date(this.taskDueDateUnix).toLocaleDateString("en-us", this.dateOptions);
       

    }
   },

  
};


</script>

<style lang="scss" scoped>
.task-wrap {
   position: fixed;
   top: 0;
   left: 0;
   background: transparent; 
   width: 100%;
   height: 100vh;
   overflow: scroll;
   &::-webkit-scrollbar{
    display: none;
   }
   @media (min-width: 900px) {
    left: 90px;
   }
   
   .task-content {
    position: relative;
    padding: 40px;
    max-width: 700px;
    width: 100%;
    background-color: #141625;
    color: #fff;
    box-shadow: 10px 4px 6px -1px rgba(0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.6);

    h1{
       margin-bottom: 38px; 
       color: #fff;
    }

    h3{
        margin-bottom: 16px; 
        font-size: 18px; 
        color:#777f98
    }
    h4{
        margin-bottom: 24px; 
        font-size: 12px; 
        color:#9CC3D5FF
    }

    // task-name / task-info
    .task-name,
    .task-info {
       margin-bottom: 16px;

       .task-details{
        gap: 16px;

        div{
            flex: 1;
        }
       }
    }

    //work-items
    .work-items{
        .item-list{
           width:100%; 

           //item table styling
           .table-heading,
           .table-items{
            gap: 16px;
            font-size: 12px;

            .item-name {
                flex-basis: 50%;
                
                
            }
           }

           .table-heading {
             margin-bottom: 16px;

             th{
                text-align: left;
             }
           }

           .table-items {
             position: relative;
             margin-bottom: 24px;

             img{
               position: relative;
               top: 15px;
               right: 0;
               width: 12px;
               height: 12px; 
             }
           }
        }

        .button {
            color: #fff;
            background: #252945;
            align-items: center;
            justify-content: center;
            width: 100%;

            img {
                margin-right: 4px;
                width: 12px;
                height: 12px;
            }
        }
    }
   }
   .save {
        margin-top:20px;
        
        div{
            flex: 1;
        }
        
        .right {
            justify-content: flex-end;
        }
       
    }

   .input {
     margin-bottom: 24px;
   }
   label {
    font-size: 12px;
    margin-bottom: 6px;
   }

   input,
   select {
    width: 100%;
    background: #1e2139;
    color: #fff;
    border-radius: 4px;
    padding: 12px 4px;
    border: none;


    &:focus {
        outline: none;
        
    }
   }
   select {
    background: #1e2139;;
    
   }
}
</style>

<!-- 3.43.50 -->