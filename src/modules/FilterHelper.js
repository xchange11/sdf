function FilterHelper() {}

var proto = {
  uniqueValuesOfProperty(objectArray, objectProperty, config) {
    var uniqueValues = [];
    for (var i = 0; i < objectArray.length; i++) {
      var currentObject = objectArray[i];
      var propertyValue = currentObject[objectProperty];
      if (Array.isArray(propertyValue)) {
        if (propertyValue.length > 0 && typeof propertyValue[0] !== "object") {
          propertyValue.forEach((element) => {
            if (!uniqueValues.includes(element)) {
              uniqueValues.push(element);
            }
          });
        } else {
          propertyValue.forEach((elementObject) => {
            if (config && config.selected[0]) {
              let field = config.selected[0];
              let stringValue = elementObject[field];
              if (stringValue && !uniqueValues.includes(stringValue)) {
                uniqueValues.push(stringValue);
              }
            }
          });
        }
      } else if (typeof propertyValue == "object") {
        if (config && config.selected[0]) {
          let field = config.selected[0];
          let stringValue = propertyValue[field];
          if (stringValue && !uniqueValues.includes(stringValue)) {
            uniqueValues.push(stringValue);
          }
        }
      } else if (propertyValue && !uniqueValues.includes(propertyValue)) {
        uniqueValues.push(propertyValue);
      }
    }
    return uniqueValues.sort();
  }
};

FilterHelper.prototype = proto;

export default FilterHelper;
