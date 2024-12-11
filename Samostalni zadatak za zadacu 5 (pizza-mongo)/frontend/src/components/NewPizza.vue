<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter(); 

const newPizza = ref({
  naziv: '',
  cijena: '',
  sastojci: '',
  slika: ''
});

const addPizza = async () => {
  try {
    const pizzaPodaci = {
      naziv: newPizza.value.naziv,
      cijena: newPizza.value.cijena,
      sastojci: newPizza.value.sastojci.split(',').map(item => item.trim()),
      slika: newPizza.value.slika
    };

    await axios.post('http://localhost:3000/pizze', pizzaPodaci);

    alert('Pizza dodana!');
    newPizza.value = { naziv: '', cijena: '', sastojci: '', slika: '' };

    router.push('/pizze'); 

  } catch (error) {
    alert('Greška prilikom dodavanja pizze. Pokušajte ponovno!');
    console.error(error);
  }
};

const goBack = () => {
  router.push('/pizze'); 
};
</script>

<template>
    <div class="new-pizza-container">
      <h1>Dodajte novu pizzu</h1>
      <form @submit.prevent="addPizza" class="add-pizza-form">
        <div>
          <label for="naziv">Naziv:</label>
          <input id="naziv" v-model="newPizza.naziv" required />
        </div>
        <div>
          <label for="cijena">Cijena:</label>
          <input id="cijena" v-model="newPizza.cijena" type="number" required />
        </div>
        <div>
          <label for="sastojci">Sastojci (odvojeni zarezom):</label>
          <input id="sastojci" v-model="newPizza.sastojci" required />
        </div>
        <div>
          <label for="slika">URL slike:</label>
          <input id="slika" v-model="newPizza.slika" required />
        </div>
        <button type="submit" class="submit-btn">Dodaj pizzu</button>
      </form>
  
      <button @click="goBack" class="go-back-btn">Natrag</button>
    </div>
  </template>
  
  <style scoped>
  .new-pizza-container {
    margin: auto;
    max-width: 600px;
    padding: 20px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    font-family: Arial, sans-serif;
  }
  
  h1 {
    text-align: center;
    color: #333;
    margin-bottom: 20px;
  }
  
  .add-pizza-form {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .add-pizza-form div {
    display: flex;
    flex-direction: column;
  }
  
  .add-pizza-form label {
    font-weight: bold;
    margin-bottom: 5px;
    color: #444;
  }
  
  .add-pizza-form input {
    padding: 10px;
    font-size: 1em;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: border 0.2s ease-in-out;
  }
  
  .add-pizza-form input:focus {
    border-color: #ff6347;
    outline: none;
  }
  
  .submit-btn {
    margin-top: 20px;
    padding: 10px 15px;
    font-size: 1em;
    color: white;
    background-color: #ff6347;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .submit-btn:hover {
    background-color: #ff3c20;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  }
  
  .go-back-btn {
    display: block;
    margin: 20px auto;
    padding: 10px 20px;
    font-size: 1em;
    color: white;
    background-color: #aaa;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .go-back-btn:hover {
    background-color: #888;
  }
  </style>

