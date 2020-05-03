<template>
  <div id="app">
    <h1>{{ appTitle }}</h1>

    <p v-if="appConfig.debug">Active Filters: {{ activeFilters }}</p>
    <p v-if="appConfig.debug">User-Configuration: {{ appConfig }}</p>

    <div id="wrapper">
      <div id="choose-data">
        <FileChooserGeneric
          :name="'dataSetFile'"
          :id="'data-file'"
          :getText="true"
          :labelText="'Choose Dataset'"
          @textSent="changeDataset"
        />
      </div>
      <div id="choose-file">
        <FileChooserGeneric
          :name="'configFile'"
          :id="'config-file'"
          :getText="true"
          :labelText="'Choose Configfile'"
          @textSent="changeConfig"
        />
      </div>

      <div id="config">
        <button
          v-on:click="toggleShowConfig()"
          type="button"
          id="config-button"
        >
          {{ showConfig ? "Hide Configuration" : "Configuration" }}
        </button>

        <transition name="fade">
          <div v-show="showConfig">
            <MyConfiguration @respectDependency="maintainDependency" />
          </div>
        </transition>
      </div>

      <div id="all-filter">
        <h2>Filter</h2>
        <MyFilter
          v-for="filterField in displayedFilterFields"
          :key="filterField"
          :field="filterField"
        />
        <MyButton
          :buttonName="'Reset Filter'"
          @itClicked="resetFilter()"
          id="reset-filter-button"
        />
      </div>
      <ResultView :filteredData="filteredData" :dataConfig="dataConfig" />
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import FileChooserGeneric from "./helper/FileChooserGeneric.vue";
import MyButton from "./components/MyButton.vue";
import MyConfiguration from "./components/MyConfiguration.vue";
import MyFilter from "./components/MyFilter.vue";

export default {
  components: {
    FileChooserGeneric,
    MyButton,
    MyConfiguration,
    MyFilter,
    ResultView: () =>
      import(
        `${
          process.env.VUE_APP_ENTRY_CUSTOM == "true"
            ? "./custom/components/CustomResultView.vue"
            : "./components/ResultView.vue"
        }`
      )
  },
  computed: {
    ...mapState([
      "activeFilters",
      "appConfig",
      "appTitle",
      "dataConfig",
      "showConfig"
    ]),
    ...mapGetters(["displayedFilterFields", "filteredData"])
  },
  methods: {
    changeConfig(text) {
      try {
        var configData = JSON.parse(text);
        if (configData.activeFilters == undefined) {
          throw "Data can not be processed. No active filters present";
        }
      } catch (error) {
        return;
      }
      this.setConfig({ config: configData });
      this.setActiveFilters({ activeFilters: configData.activeFilters });
    },
    changeDataset(text) {
      let container = JSON.parse(text);
      this.setMyData({ data: container });
      //this.setActiveFilters({ activeFilters: container.activeFilters });
    },
    //Aditional actions to be called when configurations changes
    maintainDependency(obj) {
      var name = obj.name;
      var value = obj.value;
      var type = obj.actionType;
      switch (name) {
        case "displayableFilterFields":
          if (type == "add" && !this.activeFilters[value]) {
            this.addFieldToActiveFilters(value);
            break;
          }
      }
    },
    ...mapMutations([
      "addFieldToActiveFilters",
      "setActiveFilters",
      "setConfig",
      "setMyData"
    ]),
    ...mapActions(["resetFilter", "toggleShowConfig"])
  }
};
</script>

<style>
h1 {
  font-size: 6rem;
}

h2 {
  font-size: 2rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.file-select {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  padding: 5px;
}

.file-select input {
  font-size: 1.2rem;
}

.file-select label {
  font-size: 1.2rem;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

#all-filter {
  grid-column-start: 1;
  grid-column-end: 2;
}

#choose-data {
  font-size: 1.2rem;
  grid-column-start: 1;
  grid-column-end: 2;
}

#choose-file {
  font-size: 1.2rem;
  grid-column-start: 2;
  grid-column-end: 3;
}

#config {
  grid-column-start: 3;
  grid-column-end: 5;
  display: flex;
  flex-direction: column;
}

#config > button {
  width: 25%;
}

#config-button {
  padding: 5px;
  border: 2px solid #ffa94d;
  border-radius: 5px;
  cursor: pointer;
  min-height: 44px;
  min-width: 44px;
  font-size: 1.2rem;
}

#config-file,
#data-file {
  display: none;
}

#label-for-config-file,
#label-for-data-file {
  cursor: pointer;
  display: block;
  text-align: center;
  border: 1px solid black;
  background-color: grey;
  color: white;
  border-radius: 5px;
  padding: 10px;
}

#reset-filter-button button {
  min-width: 44px;
  min-height: 44px;
  width: 80%;
  font-size: 1rem;
  background-color: white;
}

#result-view {
  grid-column-start: 2;
  grid-column-end: 5;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: 10px;
  row-gap: 10px;
}

#result-view > div {
  border: #ffa94d 2px solid;
  border-radius: 5px;
  background-color: #ffd8a8;
  padding: 0.5em;
  overflow: hidden;
  text-align: left;
  padding: 1.5rem;
  padding-top: 0.5rem;
}

#wrapper {
  display: grid;
  grid-template-columns: 20% 20% 60%;
  border: 2px solid #f76707;
  border-radius: 5px;
  background-color: #fff4e6;
}

#wrapper > div {
  border: #ffa94d 2px solid;
  border-radius: 5px;
  background-color: #ffd8a8;
  padding: 0.5em;
  overflow: hidden;
}
</style>