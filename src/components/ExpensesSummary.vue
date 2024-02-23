<script setup>
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import { useExpenses } from "@/stores/expenses";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import jsPDF from "jspdf";

const expensesStore = useExpenses();
const { expensesSummary, total } = storeToRefs(expensesStore);

const dateRowspan = computed(() => {
  if (!expensesSummary.value) return 0;

  return expensesSummary.value.map((item) => {
    let rowsCount = 1;

    Object.values(item.categories).forEach((category) => {
      rowsCount += category.expenses.length + 1;
    });

    return rowsCount;
  });
});

const exportSummary = () => {
  const summaryTable = document.getElementById("summaryTable-id");
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "px",
    format: "a4",
    hotfixes: ["px_scaling"],
  });

  doc.html(summaryTable, {
    callback: function (doc) {
      doc.save("summary.pdf");
    },
  });
};
</script>

<template>
  <Dialog
    :visible="!!expensesSummary"
    @update:visible="expensesStore.clearSummary()"
    header="Expenses Summary"
    modal
    :draggable="false"
    dismissableMask
  >
    <div class="tableWrapper">
      <Button label="Export to PDF" @click="exportSummary" class="exportBtn" />
      <table id="summaryTable-id">
        <thead>
          <tr>
            <th>Date</th>
            <th>Category<br />Day</th>
            <th>Expenses</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(item, idx) of expensesSummary" :key="idx">
            <tr>
              <td :rowspan="dateRowspan[idx]">{{ item.date }}</td>
              <td></td>
              <td class="dateTotal">Total: {{ item.total }}</td>
            </tr>
            <template
              v-for="(categoryData, category) in item.categories"
              :key="category"
            >
              <tr>
                <td>{{ category }}</td>
                <td>Total: {{ categoryData.total }}</td>
              </tr>
              <tr
                v-for="(expenseData, idx) of categoryData.expenses"
                :key="idx"
              >
                <td>{{ idx + 1 }}</td>
                <td>{{ expenseData }}</td>
              </tr>
            </template>
          </template>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3">Total: {{ total }}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  </Dialog>
</template>

<style scoped>
.tableWrapper {
  display: flex;
  flex-direction: column;
}

.exportBtn {
  margin: 10px 0;
  align-self: center;
}

table {
  width: 100%;
  border-collapse: collapse;
}

table thead {
  font-weight: bold;
  color: white;
}

table th,
table td {
  border: 1px solid #27272a;
  padding: 8px;
  vertical-align: top;
}

thead,
th,
tfoot {
  text-align: center;
  background-color: #18181b;
}

table tr:nth-child(even) {
  background-color: #1f1f22;
}
table tr:nth-child(odd) {
  background-color: #18181b;
}
.dateTotal {
  border-left-style: hidden;
}
</style>
