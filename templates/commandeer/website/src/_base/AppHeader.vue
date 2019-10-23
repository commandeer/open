<template>
  <v-toolbar :color="backgroundColor">
    <v-toolbar-title
      class="font-weight-thin"
    >
      <v-layout row align-center>
        <v-img width="50" :src="appIcon" @click="gotoHome" class="appIcon" />

        <h2 class="mt-3 ml-1" v-if="$vuetify.breakpoint.mdAndUp">{{ $t('commandeer_open_source_demo_title') }}</h2>
        <p class="mt-5 ml-1 subtitle" v-if="$vuetify.breakpoint.mdAndUp">-  {{ $t('commandeer_open_source_demo_description') }}</p>
      </v-layout>
    </v-toolbar-title>

    <v-spacer />

    <!-- Medium and up navigation -->
    <v-flex 
      v-if="$vuetify.breakpoint.mdAndUp"
      shrink v-for="item of items"
    >
      <v-btn color="primary" flat
        :to="{ name: item.to }"
      >
        {{ $t(item.name) }}</span>
      </v-btn>
    </v-flex>

    <v-flex
      v-if="$vuetify.breakpoint.mdAndUp"
      shrink class="mt-3 ml-2"
    >
      <v-switch
        color="primary"
        v-model="isDarkMode"
        :label="$t('dark_mode')"
      />
    </v-flex>

    <!-- Small and down menu navigation -->
    <v-menu
      v-if="$vuetify.breakpoint.smAndDown"
      offset-y
      :close-on-content-click=false
    >
      <template v-slot:activator="{ on }">
        <v-btn color="primary" dark icon flat
          v-on="on"
        >
          <v-icon>menu</v-icon>
        </v-btn>
      </template>

      <v-card min-width="300px">
        <v-list>
          <v-subheader>{{ $t('site_navigation')}}</v-subheader>

          <v-list-tile v-for="item of items"
            :to="{ name: item.to }"
          >
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>

            <v-list-tile-title>
              {{ $t(item.name) }}
            </v-list-tile-title>
          </v-list-tile>

          <v-subheader>{{ $t('settings')}}</v-subheader>

          <!-- dark mode -->
          <v-list-tile>
            <v-list-tile-action>
              <v-tooltip max-width=200 bottom>
                <template v-slot:activator="{ on }">
                  <v-icon v-on="on">info</v-icon>
                </template>
                {{ $t('dark_mode_description') }}
              </v-tooltip>
            </v-list-tile-action>

            <v-list-tile-title>{{ $t('dark_mode') }}</v-list-tile-title>

            <v-list-tile-action>
              <v-switch v-model="isDarkMode" color="primary" />
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-card>
    </v-menu>
  </v-toolbar>
</template>

<script lang="ts">
import { Component, Emit, Vue, Watch } from 'vue-property-decorator';

@Component
export default class AppHeader extends Vue {

  appIcon: string = 'https://commander-development-images.s3-us-west-1.amazonaws.com/commandeer-logo.png';
  isDarkMode: boolean = false;

  get backgroundColor() {
    return (this.$vuetify.dark) ? 'black' : 'white';
  }

  get items(): any[] {
    const items: any[] = [
      /*{ icon: 'library_books', name: 'docs', to: 'docsPage' },*/
    ];

    return items;
  }

  gotoHome() {
    this.$router.push({ name: 'homePage' });
  }

  @Emit('darkModeChanged')
  @Watch('isDarkMode')
  onDarkModeChanged() {
    localStorage.setItem('isDarkMode', String(this.isDarkMode));

    return this.isDarkMode;
  }

  mounted() {
    const mode = localStorage.getItem('isDarkMode');
    this.isDarkMode = (!mode || mode === "true");
  }

}
</script>

<style lang="stylus" scoped>
.appIcon
  cursor: pointer;

.pointer
  cursor: pointer;

.subtitle
  font-size: 18px;
  font-weight: medium;
  padding-left: 9px;
</style>
