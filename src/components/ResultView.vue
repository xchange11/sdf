<template>
  <div id="result-view">
    <div v-for="entry in filteredData" :key="entry.id">
      <h3>{{ header1(entry) }}</h3>
      <ul>
        <li v-for="entryKey in Object.keys(entry)" :key="entryKey">
          {{ entryKey }}: {{ entry[entryKey] }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    dataConfig: {
      type: Object,
      required: true
    },
    filteredData: {
      type: Array,
      required: true
    }
  },
  methods: {
    header1(entry) {
      let text = "";
      if (this.dataConfig.infoHeadings) {
        text = this.dataConfig.infoHeadings.h1;
      } else if (this.dataConfig.header1) {
        let propsForHeader = this.dataConfig.header1.selected;
        let valuesForHeader = [];
        propsForHeader.forEach(element => {
          let value = entry[element];
          valuesForHeader.push(value);
        });
        text = valuesForHeader.join(", ");
      }
      return text;
    }
  }
};
</script>
