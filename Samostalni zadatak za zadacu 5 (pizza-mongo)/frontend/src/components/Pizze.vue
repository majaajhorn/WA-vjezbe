<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import axios from 'axios';

const router = useRouter();

const goBack = () => {
    router.push('/');
}

const pizze = ref([]); // referenca za spremanje pizza
const košarica = ref([]); // referenca za spremanje naručenih pizza
const ukupnaCijena = ref(0); // ukupna cijena

const fetchPizze = async () => {
    try {
        const response = await axios.get('http://localhost:3000/pizze');
        pizze.value = response.data; // spremamo info pizze
    } catch (error) {
        console.error('Error fetching pizzas:', error);
    }
};

const goToAddPizza = () => {
  router.push('/new-pizza'); 
};

const orderPizza = (pizza) => {
    const pizzaPostoji  = košarica.value.find(item => item._id === pizza._id);

    if(pizzaPostoji) {
        pizzaPostoji.quantity++;
    } else {
        košarica.value.push({
            _id: pizza._id,      
            naziv: pizza.naziv,  
            cijena: pizza.cijena, 
            slika: pizza.slika,  
            sastojci: pizza.sastojci, 
            quantity: 1          
        });
    }

    updateTotalPrice();
}

const updateTotalPrice = () => {
    ukupnaCijena.value = košarica.value.reduce((sum, pizza) => sum + (pizza.cijena * pizza.quantity), 0);
};

const goToKošarica = () => {
    router.push('/kosarica');
}

const goToOrderPage = () => {
  router.push({ name: 'naruci' });
};

onMounted(() => {
    fetchPizze();
})


</script>

<template>
    <div class="pizze-page">
      <div class="logo" @click="router.push('/')">
        <img src="../assets/pizza (1).png" alt="Pizza Logo"/>
      </div>
  
      <div class="navbar">
        <button @click="goToAddPizza" class="add-pizza-btn">Dodaj novu pizzu</button>
        <button @click="goToOrderPage">Naruči pizzu</button>
        <button @click="goBack" class="go-back-btn">Natrag</button>
        <button @click="goToKošarica" class="cart-btn">Košarica ({{  košarica.length }}) - {{  ukupnaCijena.toFixed(2) }} €</button>
      </div>
  
      <h1>Naša ponuda pizza</h1>
      <p>Ovdje možete pronaći sve naše pizze.</p>
      
      <div v-if="pizze.length" class="pizza-cards-container">
        <div v-for="pizza in pizze" :key="pizza._id" class="pizza-card">
          <img :src="pizza.slika" alt="Pizza image" />
          <h3 class="pizza-title">{{ pizza.naziv }}</h3>
          <ul>
            <li v-for="ingredient in pizza.sastojci" :key="ingredient">{{ ingredient }}</li>
          </ul>

          <div class="price_button">
          <p><span class="price">Cijena: {{ pizza.cijena }} €</span></p>

        <button @click="orderPizza(pizza)" class="order-pizza-btn">Naruči pizzu</button>
    </div>
        </div>
      </div>
  
      <div v-else>
        <p>Učitavam pizze...</p>
      </div>
    </div>
</template>
  
<style scoped>
h1 {
    margin-top: 2em;
}

p {
    font-size: 1.4em;
}

.pizze-page {
    padding: 20px;
    position: relative;
}
  
.logo {
    font-size: 1.8em;
    font-weight: bold;
    color: #FF6347;  
    cursor: pointer;
    position: absolute;
    top: 20px;
    left: 20px;
}

.logo img {
  width: 50px; 
  height: 50px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.logo img:hover {
  transform: scale(1.1); 
}
  
.navbar {
    display: flex;
    justify-content: flex-end;
    gap: 20px; 
    position: absolute;
    top: 20px;
    right: 20px;
}
  
.add-pizza-btn {
    font-size: 1.2em;
    padding: 10px 20px;
    background-color: #FF6347; 
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}
  
.add-pizza-btn:hover {
    background-color: #FF4500; 
}
  
.go-back-btn {
    font-size: 1.2em;
    padding: 10px 20px;
    background-color: #aaa;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}
  
.go-back-btn:hover {
    background-color: #888;
}
  
.pizza-cards-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: space-between;
    margin-top: 80px; 
    margin: 0, auto;
}
  
.pizza-card {
    border: 1px solid #ccc;
    padding: 15px;
    margin: 10px;
    border-radius: 8px;
    width: calc(25% - 20px);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
}
  
.pizza-card img {
    width: 100%;
    height: 200px;
    object-fit: cover;
}
  
.pizza-card ul {
    list-style-type: none;
    padding-left: 0;
    
}
  
.pizza-card li {
    margin-bottom: 5px;
}
  
.price {
    font-weight: bold;
    font-size: 1.2em;
    color: #FF6347;
}
  
.pizza-title {
    font-weight: bold;
    font-size: 1.5em;
    color: #FF6347;
    margin-top: 10px;
    margin-bottom: 10px;
}


.order-pizza-btn {
  font-size: 1.1em;
  padding: 10px 15px;
  background-color: white;  
  color: black;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: auto;
}

.order-pizza-btn:hover {
  background-color: #FF6347; 
}

.price_button {
    margin-top: auto;
}
</style>

