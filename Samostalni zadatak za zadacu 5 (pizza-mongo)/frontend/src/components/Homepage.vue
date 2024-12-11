<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goToPizze = () => {
    router.push('/pizze');
}
</script>

<template>
    <div class="hero">
        <div class="left_side">
            <h1>Dobrodošli u pizzeriju Pizza-p</h1>
            <h2>Najbolja pizza u gradu!</h2>
            <p>Pogledaj svu našu ponudu:</p>
            <button @click="goToPizze">Klikni ovdje</button>
        </div>

        <div class="right_side">
            <img src="../assets/Fresh-delicious-pizza-on-transparent-background-PNG.png" alt="Pizza">
        </div>
    </div>
</template>

<style scoped>
h1 {
    text-align: center;
    color: #ff6347;
    
}

.hero {
    display: flex;
    justify-content: center; 
    align-items: center;  
    gap: 5%;  
    width: 100%;
    height: 100vh;  
}


.left_side {
    flex: 1;  
    padding: 20px;
    text-align: center;
}


.right_side {
    flex: 1;  
    padding: 20px;
}

img {
    width: 100%;
    height: auto;  
}
</style>
