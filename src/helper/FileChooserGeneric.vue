<template>
  <div>
    <div class="file-select">
      <label :for="id" :id="`label-for-${id}`">{{ labelText }} </label>
      <input type="file" :id="id" :name="name" @change="fileChanged($event)" />
      <p>{{ description }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    getText: {
      type: Boolean,
      required: false
    },
    id: {
      type: String,
      required: true
    },
    labelText: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },
  data: function() {
    return {
      description: "No file selected"
    };
  },
  methods: {
    fileChanged: function(e) {
      var files = e.target.files;
      var fileObj = files[0];
      //URL is often need for src attribute
      var fileURL = URL.createObjectURL(fileObj);
      var file = {
        obj: fileObj,
        URL: fileURL
      };
      this.$emit("filechange", file);
      //Sometimes text of file need to be sent
      if (this.getText === true) {
        this.sendText(fileObj);
      }
      this.description = fileObj.name;
    },
    sendText: function(fileObj) {
      //Using standard file reader API
      var reader = new FileReader();
      reader.onload = e => {
        var text = e.target.result;
        this.$emit("textSent", text);
      };
      reader.readAsText(fileObj);
    }
  }
};
</script>