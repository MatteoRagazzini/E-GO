<template>
  <div id="mappa" class="map"><slot></slot></div>
</template>

<script>
export default {
  name: "google-map",
  data() {
    return {
      map: null
    };
  },
  mounted() {
    this.map = new google.maps.Map(this.$el, {
      center: {lat: 48.137154, lng: 11.576124},
      zoom: 13,
      mapId: "16c023e99af33056",
    });
  },
  methods: {
    getMap: function (found) {
      var vm = this;

      function checkForMap() {
        if (vm.map) {
          found(vm.map);
        } else {
          setTimeout(checkForMap, 50);
        }
      }
      checkForMap();
    }
  }
}

</script>

<style scoped>
#mappa{
  height: 100%;
}
</style>
