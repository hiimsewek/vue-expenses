<script setup lang="ts"></script>

<template>
  <div>
    <h1>Expenses</h1>
  </div>
</template>

<style scoped>
div {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
h1 {
  color: var(--primary-color);
  font-size: 36px;
  padding: 20px 0;
}

@media (min-width: 1280px) {
  h1 {
    font-size: 42px;
  }
}
</style>
