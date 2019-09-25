<template>
  <v-card>
    <v-card-title>
      <v-flex shrink>
        <v-btn flat icon
          color="primary" @click="close">
          <v-icon>keyboard_arrow_left</v-icon>
        </v-btn>
      </v-flex>

      <v-flex xs8>
        <h3>{{ $t('battle_detail') }}</h3>
        <h4>{{ $t('tank') }}: {{ tank.name }}</h4>
      </v-flex>
    </v-card-title>

    <v-divider />

    <v-card-actions>
      <v-layout row wrap>
        <v-flex shrink>
          <v-icon>{{ tankStateIcon(tank.state) }}</v-icon>
        </v-flex>
        <v-flex mt-1 ml-2>
          {{ $t(tank.state) }}
        </v-flex>
      </v-layout>
    </v-card-actions>

    <v-divider />

    <v-card-text>
      <v-layout row wrap>
        <v-flex xs12>
        </v-flex>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { State, Action, Getter } from 'vuex-class';
import { ITankState, Tank } from '../types';

const namespace: string = 'battleStore';

@Component()
export default class BattleComponent extends Vue {

  $router: any;
  isLoading: boolean = false;

  @Prop() id!: string;

  @State('tankStore') tankStore?: ITankState;

  get tank(): Tank {
    return (this.tankStore && this.id) ?
      this.tankStore.tanks.find(t => t.id === this.id)
      : new Tank();
  }

  close() {
    this.$router.push({ name: 'tank' });
  }

  async mounted() {
    this.isLoading = true;
    this.isLoading = false;
  }

}
</script>
