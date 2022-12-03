<template>
</template>

<script>
export default {
  name: "google-map-marker",
  props: ["stations"],
  created: function() {
    var vm = this;
    vm.$parent.getMap(function(map) {
      vm.stations.forEach(function(station) {
        new google.maps.Marker({
          position: new google.maps.LatLng(station.latitude, station.longitude),
          map: map
        })
      });
    });
  },
  render(h) {
    return null;
  }
}
</script>


<style scoped>

</style>
