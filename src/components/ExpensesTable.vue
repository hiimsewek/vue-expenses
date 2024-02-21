<script setup lang="ts">
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { storeToRefs } from "pinia";
import { ref, type Ref } from "vue";
import { useExpenses } from "@/stores/expenses";
import EditExpenseForm from "./EditExpenseForm.vue";

const expensesStore = useExpenses();
const { expenses, total } = storeToRefs(expensesStore);

const itemToEdit: Ref<string | null> = ref(null);

const setItemToEdit = (id: string) => {
  itemToEdit.value = id;
};

const closeEditHandler = () => {
  itemToEdit.value = null;
};
</script>

<template>
  <div>
    <div v-if="expenses.length > 0" class="expenseWrapper">
      <DataTable :value="expenses" scrollable stripedRows removableSort>
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
    </div>
    <span v-else>You don't have any expenses yet.</span>
  </div>
  <EditExpenseForm
    v-if="itemToEdit"
    :id="itemToEdit"
    :visible="!!itemToEdit"
    :on-close="closeEditHandler"
  />
</template>

<style scoped>
.expenseWrapper {
  width: 100%;
}
.p-datatable {
  width: 90%;
}

.p-datatable i {
  margin-right: 10px;
  cursor: pointer;
  transition: color 0.3s;
}

.p-datatable i:last-of-type {
  padding-right: 0;
}

.p-datatable i:hover {
  color: var(--text-color-secondary);
}

@media (min-width: 1280px) {
  .p-datatable {
    width: auto;
  }
}
</style>
