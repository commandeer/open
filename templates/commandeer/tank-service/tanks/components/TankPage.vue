<template>
  <v-layout row wrap>
    <v-flex xs12>
      <h1>
        <v-layout row wrap>
          {{ $t('tanks') }}

          <v-flex shrink>
            <v-btn small icon flat color="primary"
              :loading="isLoading"
              @click="refreshClicked"
            >
              <v-icon>refresh</v-icon>
            </v-btn>
          </v-flex>

          <v-flex shrink>
            <v-btn color="primary" outline small
              @click="openDocs"
            >
              <v-icon class="mr-2">library_books</v-icon>
              {{ $t('docs') }}
            </v-btn>
          </v-flex>
        </v-layout>
      </h1>
    </v-flex>

    <v-flex xs12 pr-2>
      <v-layout row wrap>
        <v-flex shrink>
          <v-text-field
            :label="$t('filter_with_dots')"
            append-icon="search"
            :hint="searchHint"
            :persistent-hint="true"
            v-model="filter"
          />
        </v-flex>
      </v-layout>

      <v-layout row wrap>
        <v-flex :class="{ 'md7': tankViewMode, 'md12': !tankViewMode }" pr-2>
          <v-card>
            <v-data-table
              :loading="isLoading"
              :headers="headers"
              :items="filteredTanks"
              :no-data-text="$t('no_tanks')"
              :rows-per-page-items="[10, 25, 50]"
              class="elevation-1"
            >
              <template slot="items" slot-scope="props">
                <tr
                  :id="`tankRow-${props.item.id}`"
                  class="pointer"
                  @click="selectedRow(props.item)"
                >
                  <td>{{ props.item.id }}</td>
                  <td>{{ props.item.name }}</td>
                  <td>{{ props.item.type }}</td>
                  <td>{{ props.item.status }}</td>
                </tr>
              </template>
            </v-data-table>
          </v-card>
        </v-flex>

        <!-- show the tank to the right hand side on a medium and up screen
             otherwise show it in a full screen dialog -->
        <v-flex md5 pr-2 v-if="$vuetify.breakpoint.mdAndUp && tankViewMode">
          <router-view :key="$route.fullPath" />
        </v-flex>
        <v-dialog v-else fullscreen v-model="tankViewMode">
          <router-view :key="$route.fullPath" />
        </v-dialog>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { State, Action, Getter } from 'vuex-class';
import { ITankState } from './types';
import { Tank } from './tank';

const namespace: string = 'tankStore';

@Component()
export default class TankPage extends Vue {

  $t: any;
  filter: string = '';
  isLoading: boolean = false;

  @Action('clearCache', { namespace }) clearCache: any;
  @Action('fetchTanks', { namespace }) fetchTanks: any;

  @State('tankStore') tankStore?: ITankState;

  get tankViewMode(): boolean {
    return (this.$route.name && ['tankDetail'].includes(this.$route.name));
  }

  get headers(): any[] {
    return [
      { text: this.$t('id'), align: 'left', sortable: true, value: 'id' },
      { text: this.$t('name'), align: 'left', sortable: true, value: 'name' },
      { text: this.$t('type'), align: 'left', sortable: true, value: 'type' },
      { text: this.$t('status'), align: 'center', sortable: true, value: 'status' },
    ];
  }

  get tanks(): Tank[] | undefined {
    return this.tanks
      ? this.tankStore.tanks
      : [];
  }

  get searchHint(): string {
    if (!this.filter.length) return '';

    if (this.filteredTanks && this.tanks) {
      return this.$t('search_results', { amount: this.filteredTanks.length, total: this.tanks.length });
    }

    return '';
  }

  get filteredTanks(): Tank[] {
    let tanks: Tank[] = [];

    if (this.tanks && this.filter && this.filter.length) {
      tanks = this.tanks.filter(o => {
        // no fitler, return them all
        if (!this.filter) {
          return true;
        }

        // filter for id
        if (o.id && o.id.toLowerCase().includes(this.filter)) {
          return true;
        }

        // filter for name
        if (o.name && o.name.toLowerCase().includes(this.filter)) {
          return true;
        }

        return false;
      });
    } else {
      tanks = this.tanks || [];
    }

    return tanks;
  }

  openDocs() {
    shell.openExternal('https://getcommandeer.com/docs/openSource/submitService');
  }

  async refreshClicked() {
    const prefetchCount = this.tanks ? this.tanks.length : 0;

    await this.clearCache();
    await this.refresh();

    let snackbarText = this.$t('refresh_succeed');

    if (this.tanks && this.tanks.length) {
      if (prefetchCount < this.tanks.length) {
        snackbarText = `${this.$t('refresh_succeed')}: ${this.$t('tanks_found', { tanks: this.tanks.length - prefetchCount })}`;
      } else if (prefetchCount < this.tanks.length) {
        snackbarText = `${this.$t('refresh_succeed')}: ${this.$t('tanks_removed', { tanks: prefetchCount - this.tanks.length })}`;
      }
    }

    alert(snackbarText);
  }

  selectedRow(tank: Tank) {
    this.$router.push({
      name: 'tankDetail',
      params: {
        id: tank.id,
      },
    });
  }

  async refresh() {
    try {
      this.isLoading = true;
      await this.fetchTanks();
    } catch (ex) {
      this.logger.error(ex);
    } finally {
      this.isLoading = false;
    }
  }

  async mounted() {
    await this.refresh();
  }
}
</script>

<style>
.pointer {
  cursor: pointer;
}

</style>
