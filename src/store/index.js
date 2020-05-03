import FilterHelper from "../modules/FilterHelper.js";
import Vue from "vue";
import Vuex from "vuex";

var appConfigFile;

if (process.env.VUE_APP_APPCONFIG_CUSTOM == "true") {
  appConfigFile = require("../custom/config/customAppConfig.json");
} else {
  appConfigFile = require("../../defaultAppConfig.json");
}

var dataConfigFile;

if (process.env.VUE_APP_DATACONFIG_CUSTOM == "true") {
  dataConfigFile = require("../custom/config/customDataConfig.json");
} else {
  dataConfigFile = require("../defaultDataConfig.json");
}

var dataFile;

if (process.env.VUE_APP_DATA_CUSTOM == "true") {
  dataFile = require("../custom/data/customData.json");
} else {
  dataFile = require("../defaultData.json");
}

Vue.use(Vuex);

export const state = {
  activeFilters: dataConfigFile.activeFilters,
  appConfig: appConfigFile,
  appTitle: "Simple Data Filter",
  dataConfig: dataConfigFile,
  helper: new FilterHelper(),
  myData: dataFile,
  showConfig: false
};

export const getters = {
  currentData(state, getters) {
    /* 
      Returns either the complete data or
      data after all filters have been applied.
      Although this may not only be relevant for
      the filtering of the displayed filter criteria
      this is bound at the moment to the property where
      you can configure if the display of filter options
      should be dependent on other selected 
      filter criteria.
    */

    if (getters.dependencyOfFilters) {
      return getters.filteredData;
    } else {
      return state.myData;
    }
  },
  /*
    Option to dataConfigure if the list of available filters criteria
    should be be dependent of the filtered data (i.e. the selection 
    of other filters).
    */
  dependencyOfFilters(state) {
    var selected = state.dataConfig.dependencyOfFilters.selected;
    if (selected.includes("dependent")) {
      return true;
    } else {
      return false;
    }
  },
  displayedFilterFields(state) {
    return state.dataConfig.displayableFilterFields.selected;
  },
  filteredData(state) {
    var myArray = [];
    for (var i = 0; i < state.myData.length; i++) {
      var myObject = state.myData[i];
      var addToResult = true;
      //go through each of the different properties that
      //are set up for filtering
      for (const prop in state.activeFilters) {
        //only filter if at least one value present
        if (state.activeFilters[prop].length) {
          //property is in object?
          //it could be that the prop to be filtered is not present
          if (Object.prototype.hasOwnProperty.call(myObject, prop)) {
            var myObjectPropValue = myObject[prop];
            /*if the object value of the filtered property
                          doesn't match one of the values that are filtered
                          for that property, it doesn't 
                          get added to the result array
                        */
            if (Array.isArray(myObjectPropValue)) {
              addToResult = false;
              if (
                myObjectPropValue.length > 0 &&
                typeof myObjectPropValue[0] !== "object"
              ) {
                myObjectPropValue.forEach((element) => {
                  if (state.activeFilters[prop].includes(element)) {
                    addToResult = true;
                  }
                });
              } else {
                //TODO: Use for loop instead of foreach as
                //we should stop if a filter match on ONE
                //Object in the list of objects
                myObjectPropValue.forEach((elementObj) => {
                  if (
                    state.dataConfig[prop] &&
                    state.dataConfig[prop].selected[0]
                  ) {
                    let field = state.dataConfig[prop].selected[0];
                    let value = elementObj[field];
                    if (state.activeFilters[prop].includes(value)) {
                      addToResult = true;
                    }
                  }
                });
              }
            } else if (typeof myObjectPropValue == "object") {
              if (
                state.dataConfig[prop] &&
                state.dataConfig[prop].selected[0]
              ) {
                let field = state.dataConfig[prop].selected[0];
                let value = myObjectPropValue[field];
                if (!state.activeFilters[prop].includes(value)) {
                  addToResult = false;
                  break;
                }
              }
            } else if (!state.activeFilters[prop].includes(myObjectPropValue)) {
              addToResult = false;
              break;
            }
          } else {
            addToResult = false;
            break;
          }
        }
      }
      if (addToResult) myArray.push(myObject);
    }
    return myArray;
  }
};

export const mutations = {
  addFieldToActiveFilters: function(state, fieldName) {
    state.activeFilters[fieldName] = [];
  },
  addFilterValue: function(state, payload) {
    var filterName = payload.name;
    var filterValue = payload.value;
    var filterArray = state.activeFilters[filterName];
    filterArray.push(filterValue);
    state.activeFilters = { ...state.activeFilters }; // we have to reassign for reactivity
  },
  resetActiveFilter(state, filterName) {
    state.activeFilters[filterName] = [];
  },
  setActiveFilters: function(state, payload) {
    state.activeFilters = payload.activeFilters;
  },
  setConfig: function(state, payload) {
    state.dataConfig = payload.config;
  },
  setMyData: function(state, payload) {
    state.myData = payload.data;
  },
  removeFilterValue: function(state, payload) {
    var filterName = payload.name;
    var valueIndex = payload.index;
    state.activeFilters[filterName].splice(valueIndex, 1);
  },
  setShowConfig(state, val) {
    state.showConfig = val;
  }
};

export const actions = {
  addFieldValueToFilters({ state, commit }, payload) {
    var valueToAdd = payload.getIn;
    var field = payload.field;
    var filterArray = state.activeFilters[field];
    if (filterArray) {
      var indexAlreadyExists = filterArray.indexOf(valueToAdd);
      if (indexAlreadyExists === -1) {
        commit("addFilterValue", { name: field, value: valueToAdd });
      }
    }
  },
  removeFieldValueFromFilters({ state, commit }, payload) {
    var valueToGo = payload.getOut;
    var field = payload.field;
    var searchIndex = state.activeFilters[field].indexOf(valueToGo);
    if (searchIndex >= 0) {
      commit("removeFilterValue", { name: field, index: searchIndex });
    }
  },
  resetFilter({ state, commit }) {
    for (const prop in state.activeFilters) {
      commit("resetActiveFilter", prop);
    }
  },
  toggleShowConfig({ state, commit }) {
    let showFlag = state.showConfig ? false : true;
    commit("setShowConfig", showFlag);
  }
};

export const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions
});
