<template>
  <v-navigation-drawer permanent>
    <v-list expand dense >
      <!-- top section -->
      <v-list-tile v-for="item in topSectionItems"
        :key="item.title"
        avatar
        :href="item.to"
        target="_blank"
      >
        <v-list-tile-content>
          <v-list-tile-title>
            {{ $t(item.title) }}
          </v-list-tile-title>
        </v-list-tile-content>

        <v-list-tile-avatar>
          <v-icon>open_in_new</v-icon>
        </v-list-tile-avatar>
      </v-list-tile>

      <!-- top level grouping -->
      <v-list-group
        v-for="item in items"
        :key="item.title"
        v-model="item.active"
        no-action
      >
        <template v-slot:activator>
          <v-list-tile :to="item.to">
            <v-list-tile-content>
              <v-list-tile-title>
                {{ item.title }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>

        <span
          v-for="subItem in item.items"
          :key="subItem.title"
        >
          <v-list-group
            v-if="subItem.isGrouped"
            sub-group
            no-action
            style="margin-left: -20px;"
            :avatar="subItem.isNew"
          >
            <template v-slot:activator>
              <v-list-tile :to="subItem.to">
                <v-list-tile-content>
                  <v-list-tile-title>{{ subItem.title }}</v-list-tile-title>
                </v-list-tile-content>

                <v-list-tile-avatar
                  tile
                  size="25"
                >
                  <v-img
                    :src="subItem.imageUrl"
                    class="grayscale"
                  />
                </v-list-tile-avatar>
              </v-list-tile>
            </template>

            <v-list-tile
              v-for="(sub, i) in subItem.items"
              :key="i"
              :to="sub.to"
              style="margin-left: 10px;"
            >
              <v-list-tile-content>
                <v-list-tile-title>{{ sub.title }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
          <v-list-tile
            v-else
            style="margin-left: -20px;"
            :to="subItem.to"
          >
            <v-list-tile-content>
              <v-list-tile-title>{{ subItem.title }}</v-list-tile-title>
            </v-list-tile-content>

            <v-list-tile-avatar
              tile
              size="25"
            >
              <v-img
                :src="subItem.imageUrl"
                class="grayscale"
              />
            </v-list-tile-avatar>
          </v-list-tile>
        </span>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component
export default class SideNavigation extends Vue {

  $t: any;
  appIcon: string = 'https://commander-development-images.s3-us-west-1.amazonaws.com/commandeer-logo.png';
  title: string = this.$t('commandeer');

  get items() {
    return [{
      title: `${this.$t('dashboard')}`,
      to: { 'name': 'homePage' },
      active: true,
    }, {
      title: `${this.$t('tanks')}`,
      to: { 'name': 'tanksPage' },
      active: true,
    }, {
      title: `${this.$t('battles')}`,
      to: { 'name': 'battlePage' },
      active: true,
    }];
  }

  get topSectionItems() {
    return [
      { title: 'docs', to: 'https://getcommandeer.com/docs' },
      { title: 'submit_a_service', to: 'https://getcommandeer.com/docs/submit-a-service' },
    ];
  }

  async mounted() {}

}
</script>

<style>
  .grayscale { filter: grayscale(100%); }
</style>