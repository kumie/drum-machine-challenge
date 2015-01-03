var capitalize = function(string) {
  return string.charAt(0).toUpperCase() + string.substring(1);
};

var toCamelCase = function(string) {
  return string.charAt(0).toLowerCase() + string.substring(1);
};