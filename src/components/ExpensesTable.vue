<script setup lang="ts">
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { storeToRefs } from "pinia";
import { ref, type Ref } from "vue";
import { useExpenses } from "@/stores/expenses";
import EditExpenseForm from "./EditExpenseForm.vue";
import ExpensesFilters from "./ExpensesFilters.vue";
import Button from "primevue/button";

const expensesStore = useExpenses();
const { filteredExpenses, total } = storeToRefs(expensesStore);

const itemToEdit: Ref<string | null> = ref(null);

const setItemToEdit = (id: string) => {
  itemToEdit.value = id;
};

const closeEditHandler = () => {
  itemToEdit.value = null;
};

const filtersActive = ref(false);

const toggleFilters = () => {
  filtersActive.value = !filtersActive.value;
};
</script>

<template>
  <div class="outerContainer">
    <div v-if="filteredExpenses.length > 0" class="tableContainer">
      <DataTable :value="filteredExpenses" scrollable stripedRows removableSort>
        <template #header>
          <i class="pi pi-filter" aria-label="Filter" @click="toggleFilters" />
        </template>
        <Column header="Date" field="date" sortable></Column>
        <Column header="Category" field="category" sortable></Column>
        <Column header="Amount" field="amount" sortable></Column>
        <Column header="Actions">
          <template #body="{ data }">
            <i
              class="pi pi-pencil"
              aria-label="Edit"
              @click="setItemToEdit(data.id)"
            />
            <i
              class="pi pi-trash"
              aria-label="Delete"
              @click="expensesStore.deleteExpense(data.id)"
            />
          </template>
        </Column>
        <template #footer>Total: {{ total }}</template>
      </DataTable>
      <Button
        label="Generate Summary"
        class="generateBtn"
        @click="expensesStore.generateSummary()"
      />
    </div>
    <span v-else>You don't have any expenses yet.</span>
  </div>
  <ExpensesFilters :visible="filtersActive" :on-close="toggleFilters" />
  <EditExpenseForm
    v-if="itemToEdit"
    :id="itemToEdit"
    :visible="!!itemToEdit"
    :on-close="closeEditHandler"
  />
</template>

<style scoped>
.outerContainer {
  width: 100%;
  padding: 20px;
}

.p-datatable i {
  cursor: pointer;
  transition: color 0.3s;
}

.p-datatable tbody i {
  margin-right: 10px;
}

.p-datatable tbody i:last-of-type {
  padding-right: 0;
}

.p-datatable i:hover {
  color: var(--text-color-secondary);
}

.tableContainer {
  display: flex;
  flex-direction: column;
}

.generateBtn {
  margin-top: 10px;
  align-self: center;
}

@media (min-width: 1280px) {
  .outerContainer {
    width: auto;
    margin: 0 auto;
  }
}
</style>
