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
        <h3>{{ $t('tank_detail') }}</h3>
        <h4>{{ $t('tank') }}: {{ tank.name }}</h4>
      </v-flex>
    </v-card-title>

    <v-divider />

    <v-card-actions>
      <v-layout row wrap>
        <v-flex shrink>
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
          <h3>{{ $t('general_information') }}</h3>
          <v-divider class="mb-3" />

          <attribute title="id" :value="tank.id" />
          <attribute title="type" :value=" $t(tank.type)" />
          <attribute title="status" :value="$t(tank.status)" />

          <h3>{{ $t('raw_data') }}</h3>
          <v-divider class="mb-3" />

          <code class="pl-2 accent-text" style="width: 100%">
  {{ tank }}
          </code>
        </v-flex>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { State, Action, Getter } from 'vuex-class';
import Attribute from '../_base/Attribute.vue';
import { ITankState, Tank } from '../stores/tankStore';

const namespace: string = 'tankStore';

@Component({
  components: {
    Attribute,
  },
})
export default class TankComponent extends Vue {

  $router: any;
  isLoading: boolean = false;

  @Prop() id!: string;

  @State('tankStore') tankStore?: ITankState;

  get tank(): Tank | undefined {
    return (this.tankStore && this.tankStore.tanks && this.id) ?
      this.tankStore.tanks.find(t => t.id === this.id)
      : new Tank();
  }

  close() {
    this.$router.push({ name: 'tanksPage' });
  }

  async mounted() {
    this.isLoading = true;
    this.isLoading = false;
  }

}
</script>
