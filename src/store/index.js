import { createStore } from 'vuex'
import db from "../firebase/firebaseInit"

export default createStore({
  state: {
    taskData: [],
    taskModal: null,
    modalActive: null,
    tasksLoaded: null,
    currentTaskArray: null,
    editTask: null,
  },
  mutations: {
    TOGGLE_TASK(state) {
      state.taskModal = !state.taskModal;
    },
    TOGGLE_MODAL(state) {
      state.modalActive = !state.modalActive;
    },
    SET_TASK_DATA(state, payload) {
      state.taskData.push(payload);
      
    },
    TASK_LOADED(state){
       state.tasksLoaded = true;
    },
    SET_CURRENT_TASK(state, payload) {
       state.currentTaskArray = state.taskData.filter((task) => {
         return task.taskId === payload;
       })
    },
    TOGGLE_EDIT_TASK(state) {
      state.editTask = !state.editTask;
    },
    DELETE_TASK(state, payload){
        state.taskData = state.taskData.filter((task) => task.docId !== payload)
    },
    UPDATE_STATUS_TO_COMPLETED(state, payload){
       state.taskData.forEach((task) => {
         if (task.docId === payload) {
            task.taskCompleted = true;
            task.taskPending = false;
         }
       });
    },
    UPDATE_STATUS_TO_PENDING(state, payload){
      state.taskData.forEach((task) => {
        if (task.docId === payload) {
           task.taskCompleted = false;
           task.taskPending = true;
           task.taskDraft = false;
        }
      });
   },

  },
  actions: {
    // get request to retrieve data from firestore database
    async GET_TASKS({commit, state}){
        const getData = db.collection('tasks');
        const results = await getData.get();
        results.forEach((doc) => {
          if (!state.taskData.some((task) => task.docId === doc.id)){
               const data = {
                docId: doc.id,
                taskId: doc.data().taskId,
                taskName: doc.data().taskName,
                employeeName: doc.data().employeeName,
                employeeEmail: doc.data().employeeEmail,
                department: doc.data().department,
                priority: doc.data().priority,
                taskDateUnix: doc.data().taskDateUnix,
                taskDate: doc.data().taskDate,
                taskTerms: doc.data().taskTerms,
                taskDueDateUnix: doc.data().taskDueDateUnix,
                taskDueDate: doc.data().taskDueDate,
                taskDescription: doc.data().taskDescription,
                taskPending: doc.data().taskPending,
                taskDraft: doc.data().taskDraft,
                taskCompleted: doc.data().taskCompleted,
                taskItemList: doc.data().taskItemList,

               };
              commit('SET_TASK_DATA', data);
          }

        });
        commit('TASK_LOADED')
    },

    // delete and update data in firestore database
     async UPDATE_TASK({commit, dispatch}, {docId, routeId}) {
        commit('DELETE_TASK', docId);
        await dispatch('GET_TASKS');
        commit("TOGGLE_TASK");
        commit("TOGGLE_EDIT_TASK");
        commit("SET_CURRENT_TASK", routeId);
     },

     // delete a task from firestore database
     async DELETE_TASK({commit}, docId){
         const getTask = db.collection('tasks').doc(docId);
         await getTask.delete();
         commit("DELETE_TASK", docId);
     },
     async UPDATE_STATUS_TO_COMPLETED({commit}, docId) {
      const getTask = db.collection('tasks').doc(docId);
      await getTask.update({
          taskCompleted : true,
          taskPending : false, 
      });
        commit("UPDATE_STATUS_TO_COMPLETED", docId);
     },
     async UPDATE_STATUS_TO_PENDING({commit}, docId) {
      const getTask = db.collection('tasks').doc(docId);
      await getTask.update({
          taskCompleted : false,
          taskPending : true,
          taskDraft : false, 
      });
        commit("UPDATE_STATUS_TO_PENDING", docId);
     },
  },
  modules: {},
})
