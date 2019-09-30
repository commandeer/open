<template>
  <v-app>
    <v-layout row wrap id="app">
      <v-flex xs2 color="grey darken-4">
        <side-navigation />
      </v-flex>

      <v-flex xs10 pl-2>
        <div>
          <breadcrumbs />
          <router-view :key="$route.fullPath" />
        </div>
      </v-flex>
    </v-layout>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import SideNavigation from '@/_base/SideNavigation.vue';

@Component({
  components: {
    SideNavigation,
  }
})
export default class App extends Vue {

}
</script>
