<script setup lang="ts">
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { storeToRefs } from "pinia";
import { ref, computed, type Ref } from "vue";
import { useExpenses } from "@/stores/expenses";
import EditExpenseForm from "./EditExpenseForm.vue";
import ExpensesFilters from "./ExpensesFilters.vue";
import Button from "primevue/button";

const expensesStore = useExpenses();
const { filteredExpenses, total, appliedFilters } = storeToRefs(expensesStore);

const itemToEdit: Ref<string | null> = ref(null);

const setItemToEdit = (id: string) => {
  itemToEdit.value = id;
};

const closeEditHandler = () => {
  itemToEdit.value = null;
};

const showFiltersBtn = computed(() => filteredExpenses.value.length > 1);

const filtersActive = ref(false);

const toggleFilters = () => {
  filtersActive.value = !filtersActive.value;
};

const emptyExpenseMessage = computed(() => {
  return filteredExpenses.value.length === 0 && appliedFilters.value
    ? "No expenses match the criteria"
    : "You don't have any expenses yet";
});
</script>

<template>
  <div class="outerContainer">
    <div
      v-if="filteredExpenses.length > 0"
      class="tableContainer"
      data-test="expensesTableContainer"
    >
      <DataTable
        :value="filteredExpenses"
        scrollable
        stripedRows
        removableSort
        data-test="expensesTable"
      >
        <template #header v-if="showFiltersBtn">
          <i
            class="pi pi-filter"
            aria-label="Filter"
            @click="toggleFilters"
            data-test="showFiltersBtn"
          />
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
              data-test="toggleEditExpense"
            />
            <i
              class="pi pi-trash"
              aria-label="Delete"
              @click="expensesStore.deleteExpense(data.id)"
              data-test="deleteExpense"
            />
          </template>
        </Column>
        <template #footer
          ><span data-test="expensesTotal">Total: {{ total }}</span></template
        >
      </DataTable>
      <Button
        label="Generate Summary"
        class="generateBtn"
        aria-label="Generate summary"
        @click="expensesStore.generateSummary()"
        data-test="generateSummaryBtn"
      />
    </div>
    <span v-else data-test="emptyExpensesMessage">{{
      emptyExpenseMessage
    }}</span>
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
  text-align: center;
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
