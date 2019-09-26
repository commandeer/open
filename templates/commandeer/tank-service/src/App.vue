<template>
  <v-app>
    <v-layout>
      <v-flex xs12>
        <router-view :key="$route.fullPath" />
      </v-flex>
    </v-layout>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class App extends Vue {

}
</script>