<template>
  <v-layout row wrap>
    <v-flex xs12>
      <h1>
        <v-layout row wrap>
          {{ $t('orbits') }}

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
        <v-flex :class="{ 'md7': orbitViewMode, 'md12': !orbitViewMode }" pr-2>
          <v-card>
            <v-data-table
              :loading="isLoading"
              :headers="headers"
              :items="filteredOrbits"
              :no-data-text="$t('no_orbits')"
              :rows-per-page-items="[10, 25, 50]"
              class="elevation-1"
            >
              <template slot="items" slot-scope="props">
                <tr
                  :id="`orbitRow-${props.item.id}`"
                  class="pointer"
                  @click="selectedRow(props.item)"
                >
                  <td>{{ props.item.id }}</td>
                  <td>{{ props.item.name }}</td>
                </tr>
              </template>
            </v-data-table>
          </v-card>
        </v-flex>

        <v-flex md5 pr-2
          v-if="$vuetify.breakpoint.mdAndUp && orbitViewMode"
        >
          <router-view :key="$route.fullPath" />
        </v-flex>
        <v-dialog v-else
          fullscreen
          v-model="orbitViewMode"
        >
          <router-view :key="$route.fullPath" />
        </v-dialog>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { State, Action, Getter } from 'vuex-class';
import { IOrbitState } from './types';
import { Orbit } from './orbit';

const namespace: string = 'orbitStore';

@Component({
  components: {
  },
})
export default class OrbitPage extends Vue {

  $t: any;
  isLoading: boolean = false;
  filter: string = '';

  @Action('clearCache', { namespace }) clearCache: any;
  @Action('fetchOrbits', { namespace }) fetchOrbits: any;

  @State('orbitStore') orbitStore?: IOrbitState;

  get orbitViewMode(): boolean {
    return (this.$route.name && ['orbitDetail'].includes(this.$route.name));
  }

  get headers(): any[] {
    return [
      { text: this.$t('id'), align: 'left', sortable: true, value: 'id' },
      { text: this.$t('name'), align: 'left', sortable: true, value: 'name' },
    ];
  }

  get orbits(): Orbit[] | undefined {
    return this.orbits
      ? this.ec2Store.orbits
      : [];
  }

  get searchHint(): string {
    if (!this.filter.length) return '';

    if (this.filteredOrbits && this.orbits) {
      return this.$t('search_results', { amount: this.filteredOrbits.length, total: this.orbits.length });
    }

    return '';
  }

  get filteredOrbits(): Orbits[] {
    let orbits: Orbit[] = [];

    if (this.orbits && this.filter && this.filter.length) {
      orbits = this.orbits.filter(o => {
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
      orbits = this.orbits || [];
    }

    return instances;
  }

  openDocs() {
    shell.openExternal('https://getcommandeer.com/docs/orbits');
  }

  async refreshClicked() {
    const prefetchCount = this.orbits ? this.orbits.length : 0;

    await this.clearCache();
    await this.refresh();

    let snackbarText = this.$t('refresh_succeed');

    if (this.orbits && this.orbits.length) {
      if (prefetchCount < this.orbits.length) {
        snackbarText = `${this.$t('refresh_succeed')}: ${this.$t('orbits_found', { orbits: this.orbits.length - prefetchCount })}`;
      } else if (prefetchCount < this.orbits.length) {
        snackbarText = `${this.$t('refresh_succeed')}: ${this.$t('orbits_removed', { orbits: prefetchCount - this.orbits.length })}`;
      }
    }

    alert(snackbarText);
  }

  selectedRow(orbit: Orbit) {
    // @ts-ignore
    this.$router.push({
      name: 'orbitDetail',
      params: {
        id: orbit.id,
      },
    });
  }

  async refresh() {
    try {
      this.isLoading = true;
      await this.fetchOrbits();
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
