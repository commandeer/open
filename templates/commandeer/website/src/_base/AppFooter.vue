<template>
  <v-footer v-if="$vuetify.breakpoint.mdAndUp"style="height: 320px;">
    <v-layout justify-center row>
      <v-flex xs12 md2>
        <h3 class="mb-2">{{ $t('general_information') }}</h3>

        <!-- internal links -->
        <ul class="version" v-for="item of items">
          <li>
            <router-link :to="{ 'name': item.to }">{{ $t(item.name) }}</router-link>
          </li>
        </ul>
      </v-flex>

      <v-flex md2>
        <h3 class="mb-2">{{ $t('more_links') }}</h3>

        <!-- social links -->
        <ul class="version" v-for="item of links">
          <li>
            <a :href="item.to" target="_blank">{{ $t(item.name) }}</a>
          </li>
        </ul>
      </v-flex>
    </v-layout>
  </v-footer>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class AppFooter extends Vue {

  get items(): any[] {
    const items = [
      { name: 'home', to: 'homePage' },
      { name: 'docs', to: 'docsPage' },
    ];

    return items;
  }

  get links(): any[] {
    const items = [
      { name: 'github_repo', to: 'https://github.com/commandeer/open/tree/development/templates/commandeer/tank-service' },
    ];

    return items;
  }
}
</script>

<style lang="stylus" scoped>
.version
  list-style-type: none;
  margin-left: -14px;
  li
    margin-bottom: 6px;
  a
    font-size: 16px !important;
    text-decoration: none !important;
</style>
