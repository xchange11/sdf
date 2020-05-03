<template>
  <div class="filter">
    <div>
      <MySelectBox
        :options="fieldValues"
        :labelName="labelOfFilter"
        @valueChanged="addValue"
      />
    </div>
    <div class="value-buttons">
      <MyButton
        v-for="filterValue in activeFilters[field]"
        :key="filterValue"
        :buttonName="filterValue"
        :fieldName="filterValue"
        @itClicked="removeValue"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import MyButton from "./MyButton.vue";
import MySelectBox from "./MyDropDown.vue";

export default {
  components: {
    MyButton,
    MySelectBox
  },
  props: {
    field: {
      type: String,
      required: true
    }
  },
  computed: {
    fieldValues() {
      return this.helper.uniqueValuesOfProperty(
        this.currentData,
        this.field,
        this.dataConfig[this.field]
      );
    },
    labelOfFilter() {
      return this.field;
    },
    ...mapState(["activeFilters", "dataConfig", "helper"]),
    ...mapGetters(["currentData"])
  },
  methods: {
    addValue(value) {
      this.addFieldValueToFilters({
        field: this.field,
        getIn: value
      });
    },
    removeValue(value) {
      this.removeFieldValueFromFilters({
        field: this.field,
        getOut: value
      });
    },
    ...mapActions(["addFieldValueToFilters", "removeFieldValueFromFilters"])
  }
};
</script>
<style>
.drop-down {
  display: flex;
  padding: 5px;
  margin: 10px;
}

.filter {
  font-size: 1.2rem;
  text-align: left;
  margin-bottom: 1.5rem;
}

.form-select {
  flex: 2;
  padding: 10px;
}

.label-select {
  flex: 1;
  padding: 10px;
}

.value-buttons {
  display: flex;
  justify-content: flex-start;
  flex-flow: row wrap;
}

.value-buttons button {
  flex: 1;
  min-width: 44px;
  min-height: 44px;
  font-size: 1.2rem;
  margin: 5px;
}
</style>