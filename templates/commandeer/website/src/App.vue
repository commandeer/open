<template>
  <v-app :dark="isDarkMode">
    <app-header
      @darkModeChanged="onDarkModeChanged"
     />

    <v-layout row wrap id="app">
      <v-flex xs2 color="grey darken-4">
        <side-navigation />
      </v-flex>

      <v-flex xs10 pl-2>
        <div class="mt-2">
          <router-view :key="$route.fullPath" />
        </div>
      </v-flex>
    </v-layout>

    <app-footer />
  </v-app>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import AppFooter from '@/_base/AppFooter.vue';
import AppHeader from '@/_base/AppHeader.vue';
import SideNavigation from '@/_base/SideNavigation.vue';

@Component({
  components: {
    AppFooter,
    AppHeader,
    SideNavigation,
  }
})
export default class App extends Vue {

  isDarkMode: boolean = false;

  @Watch('isDarkMode')
  onDarkModeChanged(mode: boolean) {
    this.isDarkMode = mode;
  }

  mounted() {
    const mode = localStorage.getItem('isDarkMode');
    this.isDarkMode = (!mode || mode === "true");
  }

}
</script>
