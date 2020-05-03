<template>
  <div class="drop-down">
    <label class="label-select">{{ labelName }} </label>
    <select
      @change="changedValue"
      @focus="focusBubble"
      v-model="selected"
      class="form-select"
    >
      <option value="" disabled>Select a value</option>
      <option v-for="option in options" :value="option" :key="option">
        {{ option }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  name: "MySelectBox",
  props: {
    labelName: {
      type: String,
      required: false,
      default: ""
    },
    options: {
      type: Array,
      required: true
    }
  },
  data: function() {
    return {
      selected: ""
    };
  },
  methods: {
    changedValue: function(e) {
      //no change event is fired when target is empty string
      if (e.target.value.length) {
        this.$emit("valueChanged", e.target.value);
        this.selected = "";
      }
    },
    focusBubble() {
      this.$emit("gotFocus");
    }
  }
};
</script>