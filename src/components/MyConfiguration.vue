<template>
  <div>
    <div v-for="(optionProperties, optionName) in dataConfig" :key="optionName">
      <div class="config" v-if="optionProperties.ui != false">
        <legend>{{ optionName }}</legend>
        <div v-for="value in optionProperties.available" :key="value">
          <input
            type="checkbox"
            :id="value"
            :name="optionName"
            :value="value"
            :checked="optionProperties.selected.includes(value)"
            @change="changeAction"
          />
          <label :for="value">{{ value }}</label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  computed: {
    ...mapState(["dataConfig"])
  },
  methods: {
    changeAction(e) {
      var property = e.target.attributes.getNamedItem("name").nodeValue;
      var value = e.target.value;
      var actionType;
      var selectedArray = this.dataConfig[property].selected;
      if (selectedArray.includes(value)) {
        var i = selectedArray.indexOf(value);
        selectedArray.splice(i, 1);
        actionType = "remove";
      } else {
        selectedArray.push(value);
        actionType = "add";
      }
      this.resetFilter();
      this.$emit("respectDependency", {
        name: property,
        value: value,
        actionType: actionType
      });
    },
    ...mapActions(["resetFilter"])
  }
};
</script>

<style scoped>
.config {
  text-align: left;
}
</style>
