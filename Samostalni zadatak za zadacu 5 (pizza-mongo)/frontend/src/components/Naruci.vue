<template>
    <div class="order-container">
      <h1>Naruči pizzu</h1>
      <form @submit.prevent="submitOrder" class="order-form">
        
        <div class="form-group">
          <label for="pizza">Izaberite pizzu:</label>
          <select v-model="currentPizza.naziv" id="pizza">
            <option value="" disabled>Odaberite pizzu</option>
            <option v-for="pizza in pizzas" :key="pizza._id" :value="pizza.naziv">
              {{ pizza.naziv }}
            </option>
          </select>
        </div>
  
       
        <div class="form-group">
          <label for="size">Izaberite veličinu:</label>
          <select v-model="currentPizza.veličina">
            <option value="mala">Mala</option>
            <option value="srednja">Srednja</option>
            <option value="velika">Velika</option>
          </select>
        </div>
  
        
        <div class="form-group">
          <label for="quantity">Količina:</label>
          <input type="number" v-model="currentPizza.količina" id="quantity" min="1" />
        </div>
  
        
        <button type="button" @click="addPizza" class="add-button">Dodaj pizzu</button>
  
        
        <ul class="pizza-list">
          <li v-for="(pizza, index) in pizzaStavke" :key="index" class="pizza-item">
            {{ pizza.količina }} x {{ pizza.naziv }} ({{ pizza.veličina }})
            <button type="button" @click="removePizza(index)" class="remove-button">Ukloni</button>
          </li>
        </ul>
  
        
        <div class="form-group">
          <label for="name">Ime:</label>
          <input type="text" v-model="name" id="name" placeholder="Unesite ime" required />
        </div>
        <div class="form-group">
          <label for="address">Adresa:</label>
          <input type="text" v-model="address" id="address" placeholder="Unesite adresu" required />
        </div>
        <div class="form-group">
          <label for="phone">Telefon:</label>
          <input type="text" v-model="phone" id="phone" placeholder="Unesite broj telefona" required />
        </div>
        
        
        <button type="submit" class="submit-button">Naruči</button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import axios from "axios";
  

  const pizzas = ref([]);
  const pizzaStavke = ref([]);
  const currentPizza = ref({ naziv: "", veličina: "mala", količina: 1 });
  const name = ref("");
  const address = ref("");
  const phone = ref("");
  
  // dohvaćanje podataka o pizzama
  onMounted(async () => {
    try {
      const response = await axios.get("http://localhost:3000/pizze");
      pizzas.value = response.data;
    } catch (error) {
      console.error("Greška pri dohvaćanju pizza podataka", error);
    }
  });
  
  
  const addPizza = () => {
    // provjera da su unešeni naziv i količina
    if (!currentPizza.value.naziv || currentPizza.value.količina <= 0) {
      alert("Molimo ispunite sve podatke za pizzu prije dodavanja.");
      return;
    }
  
    pizzaStavke.value.push({
      naziv: currentPizza.value.naziv,
      veličina: currentPizza.value.veličina,
      količina: currentPizza.value.količina,
    });
  
    currentPizza.value = { naziv: "", veličina: "mala", količina: 1 };
  };
  
  const removePizza = (index) => {
    pizzaStavke.value.splice(index, 1);
  };
  
  
  const submitOrder = async () => {
    if (pizzaStavke.value.length === 0) {
      alert("Molimo dodajte barem jednu pizzu u narudžbu.");
      return;
    }
  
    const order = {
      ime: name.value,
      adresa: address.value,
      telefon: phone.value,
      pizza_stavke: pizzaStavke.value,
    };
  
    
    try {
      const response = await axios.post("http://localhost:3000/narudzba", order);
      alert("Narudžba uspješno poslana!");
      
      pizzaStavke.value = [];
      name.value = "";
      address.value = "";
      phone.value = "";
    } catch (error) {
      console.error("Greška pri slanju narudžbe", error);
      alert("Neuspješno slanje narudžbe. Pokušajte ponovo.");
    }
  };
  </script>
  
  <style scoped>

  .order-container {
    max-width: 650px;
    margin: 50px auto;
    padding: 30px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    font-family: 'Arial', sans-serif;
  }
  
  h1 {
    text-align: center;
    font-size: 2.5rem;
    color: #FF6347; 
    margin-bottom: 25px;
  }
  
  .order-form {
    display: flex;
    flex-direction: column;
  }
  
  
  .form-group {
    margin-bottom: 20px;
  }
  
  label {
    font-size: 1rem;
    color: #333;
    margin-bottom: 5px;
  }
  
  input,
  select {
    width: 100%;
    padding: 12px;
    font-size: 1rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-sizing: border-box;
  }
  
  input::placeholder {
    color: #888; 
  }
  
  button {
    padding: 12px 20px;
    font-size: 1rem;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  button:hover {
    opacity: 0.9;
  }
  
  
  .add-button {
    background-color: #FF6347; 
    color: white;
    border: none;
    margin-top: 10px;
  }
  
  .add-button:hover {
    background-color: #FF4500;
  }
  
  
  .submit-button {
    background-color: #FF6347;
    color: black;
    border: none;
    margin-top: 20px;
  }
  
  .submit-button:hover {
    background-color: #f4bdb4;
  }
  
  .pizza-list {
    list-style: none;
    padding: 0;
    margin-top: 20px;
  }
  
  .pizza-list .pizza-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #f4bdb4; 
    color: black;
    padding: 12px;
    margin-bottom: 12px;
    border-radius: 8px;
  }
  
  .remove-button {
    background-color: #f44336; 
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 4px;
    font-size: 1rem;
  }
  
  .remove-button:hover {
    background-color: #FF6347;
  }
  </style>
  