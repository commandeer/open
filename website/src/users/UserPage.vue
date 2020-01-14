<template>
  <v-layout row wrap>
    <h1>Personnel</h1>
  </v-layout>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { State, Action, Getter } from 'vuex-class';
import { ITankState, Tank } from '../stores/tankStore';

const namespace: string = 'battleStore';

@Component
export default class BattlePage extends Vue {

  $t: any;
  filter: string = '';
  isLoading: boolean = false;

  @Action('clearCache', { namespace }) clearCache: any;
  @Action('fetchTanks', { namespace }) fetchTanks: any;

  @State('tankStore') tankStore?: ITankState;

  get tankViewMode(): boolean {
    return (this.$route.name && ['tankDetail'].includes(this.$route.name)) as boolean;
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
    return this.tankStore
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
    window.open('https://getcommandeer.com/docs/openSource/submitService');
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
        id: tank.id as string,
      },
    });
  }

  async refresh() {
    try {
      this.isLoading = true;
      await this.fetchTanks();
    } catch (ex) {
      console.error(ex);
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
