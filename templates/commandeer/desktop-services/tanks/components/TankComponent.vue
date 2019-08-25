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
        <h3>{{ $t('orbit_detail') }}</h3>
        <h4>{{ $t('orbit') }}: {{ orbit.name }}</h4>
      </v-flex>
    </v-card-title>

    <v-divider />

    <v-card-actions>
      <v-layout row wrap>
        <v-flex shrink>
          <v-icon v-if="instance.state === 'running'">directions_run</v-icon>
          <v-icon v-else color="error lighten-2">power_off</v-icon>
        </v-flex>
        <v-flex mt-1 ml-2>
          {{ $t(instance.state) }}
        </v-flex>
      </v-layout>
    </v-card-actions>

    <v-divider />

    <v-card-text>
      <v-layout row wrap>
        <v-flex xs12>
          <h3>{{ $t('general_information') }}</h3>
          <v-divider class="mb-3" />

          <p>{{ $t('id') }}: {{ orbit.id }}

          <h3>{{ $t('raw_data') }}</h3>
          <v-divider class="mb-3" />

          <pre>{{ orbit }}</pre>
        </v-flex>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { State, Action, Getter } from 'vuex-class';
import { IOrbitState, Orbit } from '../types';

const namespace: string = 'orbitStore';

@Component({
  components: {
  },
})
export default class OrbitComponent extends Vue {

  $router: any;
  isLoading: boolean = false;

  @Prop() id!: string;

  @State('orbitStore') orbitStore?: IOrbitState;

  get orbit(): Orbit {
    return (this.orbitStore && this.id) ?
      this.orbitStore.orbits.find(o => o.id === this.id)
      : new Orbit();
  }

  close() {
    this.$router.push({ name: 'orbit' });
  }

  async mounted() {
    this.isLoading = true;
    this.isLoading = false;
  }

}
</script>
