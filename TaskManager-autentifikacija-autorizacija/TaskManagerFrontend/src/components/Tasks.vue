<template>
  <div class="max-w-4xl mx-auto p-4">
    <!-- Header -->
    <header class="flex justify-between items-center bg-white p-4 shadow rounded-md mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Task Manager</h1>
      <div class="flex gap-4">
        <button
          class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          @click="editing = true"
          >
          Dodaj zadatak
        </button>
        <button
          class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          @click="logout"
        >
          Odjava
        </button>
      </div>
    </header>
  
    <!-- Input Section -->
    <div v-if="editing" class="bg-white p-4 shadow rounded-md mb-6">
      <div class="mb-4">
        <label class="block text-gray-700 font-medium mb-2" for="naslov">Naslov zadatka:</label>
        <input
          id="naslov"
          type="text"
          v-model="naslovZadatka"
          class="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
          placeholder="Unesite naslov zadatka"
        />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 font-medium mb-2" for="opis">Opis zadatka:</label>
        <textarea
          id="opis"
          v-model="opisZadatka"
          rows="3"
          class="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
          placeholder="Unesite opis zadatka"
        ></textarea>
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 font-medium mb-2" for="tags">Tagovi (odvojeni zarezom):</label>
        <input
          id="tags"
          type="text"
          v-model="taskTags"
          class="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
          placeholder="npr: hitno, faks, pomalo"
        />
      </div>
      <div class="flex space-x-4">
        <button
          class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          @click="dodajZadatak"
        >
          Spremi zadatak
        </button>
        <button
        class="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
        @click="editing = false"
        >
        Odustani
       </button>
      </div>
    </div>
    <!-- Task List -->
    <div class="bg-white p-4 shadow rounded-md">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Vaši zadaci</h2>
        <ul class="space-y-4">
          <li
          v-for="(task, index) in tasks"
          :key="task.id"
          :class="{
            'bg-green-100': task.zavrsen,
            'bg-gray-50': !task.zavrsen,
          }"
          class="flex justify-between items-center p-4 rounded-md shadow"
          >
      <div>
        <p class="text-lg font-medium text-gray-800">{{ task.naslov }}</p>
        <p class="text-sm text-gray-600">{{ task.opis }}</p>
         <div class="mt-2 flex space-x-2">
           <button
            v-for="tag in ['hitno', 'faks', 'pomalo']" 
            :key="tag"
            :class="{
             'bg-gray-300': !task.tags.includes(tag),
             'bg-red-500': tag === 'hitno' && task.tags.includes(tag),
             'bg-blue-500': tag === 'faks' && task.tags.includes(tag),
             'bg-green-600': tag === 'pomalo' && task.tags.includes(tag),
           }"
              class="text-white px-2 py-1 rounded-md hover:opacity-75"
              @click="oznaciTag(task, tag)"
              >
              {{ tag }}
           </button>
         </div>
        </div>
        <div class="flex space-x-2">
          <button
             v-if="!task.zavrsen"
              class="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
             @click="zavrsiZadatak(task, index)"
            >
           Dovršeno
         </button>
          <button
            class="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
              @click="obrisiZadatak(task.id, index)"
             > 
            Obriši
           </button>
         </div>
        </li>
      </ul>
    </div>
   </div>
</template>
  
<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
  
const router = useRouter();
const naslovZadatka = ref("");
const opisZadatka = ref("");
const editing = ref(false);
const taskTags = ref("");
const tasks = ref([]);
  
// axios
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    throw error;
  }
);
  
onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/tasks');
    tasks.value = response.data;
  } catch (error) {
    console.error("Greška pri dohvaćanju zadataka:", error);
    
    if (error.response?.status === 401) {
      router.push('/login');
    }
  }
});
  
async function oznaciTag(task, tag) {
  const tagPostoji = task.tags.includes(tag);
  if (tagPostoji) {
    task.tags = task.tags.filter((t) => t !== tag);
  } else {
    task.tags.push(tag);
  }
  
  try {
    await axios.put(`http://localhost:8000/api/tasks/${task.id}`, {
      tags: task.tags,
    });
  } catch (error) {
    console.error("Greška prilikom označavanja taga:", error);
  }
}
  
async function dodajZadatak() {
  if (naslovZadatka.value.trim() && opisZadatka.value.trim()) {
    const payload = {
      naslov: naslovZadatka.value,
      opis: opisZadatka.value,
      tags: taskTags.value.split(",").map((tag) => tag.trim()).filter(tag => tag),
    };

    try {
      const response = await axios.post('http://localhost:8000/api/tasks', payload);

      if (!Array.isArray(tasks.value)) {
        console.error("tasks.value is not an array:", tasks.value);
        tasks.value = [];
        }

        tasks.value.unshift(response.data);
        naslovZadatka.value = "";
        opisZadatka.value = "";
        taskTags.value = "";
        editing.value = false;
      } catch (error) {
        console.error("Greška pri dodavanju zadatka:", error.response?.data || error);
      }
  } else {
      alert('Naslov i opis su obavezni!');
  }
}
  
async function obrisiZadatak(taskId, index) {
  const potvrda = confirm('Jeste li sigurni da želite obrisati ovaj zadatak?');
    
  if (!potvrda) return;
    
  try {
    await axios.delete(`http://localhost:8000/api/tasks/${taskId}`);
    tasks.value.splice(index, 1);
  } catch (error) {
    console.error('Greška pri brisanju zadatka:', error);
  }
}
  
async function zavrsiZadatak(task, index) {
  try {
    await axios.put(`http://localhost:8000/api/tasks/${task.id}`);
    task.zavrsen = true;
  } catch (error) {
    console.error('Greška pri označavanju zadatka dovršenim:', error);
  }
}
  
function logout() {
  localStorage.removeItem('token');
  router.push('/login');
}
</script>
  
<style scoped>
button {
  transition: background-color 0.3s ease, opacity 0.3s ease;
}
button:hover {
  opacity: 0.8;
}
</style>
