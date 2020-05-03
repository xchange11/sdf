<template>
  <div>
    <button @click="clickedOnButton">
      {{ buttonName }}
    </button>
  </div>
</template>

<script>
export default {
  name: "MyButton",
  props: {
    buttonName: {
      type: String,
      required: false,
      default: "MyButton"
    },
    fieldName: String
  },
  methods: {
    clickedOnButton() {
      this.$emit("itClicked", this.fieldName);
    }
  }
};
</script>