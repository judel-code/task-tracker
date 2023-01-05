<template>
  <router-link class="task flex" :to="{name: 'Task', params: { taskId: task.taskId } }">
     <div class="left flex ">
        <span class="tracking-number">#{{ task.taskId }}</span>
        <span class="person">{{ task.taskName }}</span>
        <span class="due-date">{{ task.taskDueDate }}</span>  
     </div>
     <div class="right flex">
        <span class="name">{{ task.employeeName }}</span>
        <div class="status-button flex" :class="{completed: task.taskCompleted, draft: task.taskDraft, pending: task.taskPending}">
        
            <span v-if="task.taskCompleted">Completed</span>
            <span v-if="task.taskDraft">Draft</span>
            <span v-if="task.taskPending">In Progress</span>
        </div>
        <div class="icon">
           <img src="@/assets/icon-arrow-right.png" alt="" />  
        </div>
     </div>
  </router-link>
</template>

<script>
export default {
    name: "task",
    props: ["task"]
};
</script>

<style lang="scss" scoped>
    .task {
      text-decoration: none;
      cursor: pointer;
      gap:10px;
      margin-bottom: 16px;
      color: #fff;
      border-radius: 20px;
      padding: 20px 32px;
      background: #1e2139;
      align-items: center;

      span {
         font-size: 13px;
      }

      .left {
         align-items: center;
         flex-basis: 60%;
         gap: 15px;

         span {
            flex: 1;
            
            
         }

         .tracking-number {
            text-transform: uppercase ;
         }
      }

      .right {
          gap:16px;
          flex-basis: 40%;
          align-items: center;
         
          .name {
            flex: 1;
            font-size: 13px;
            font-weight: 200;
          }
      }

      .icon {
         img {
            height: 12px;
         width: 12px;
         }
        
      }
    }
</style>

