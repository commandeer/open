<template>
  <v-layout row wrap>
    <v-flex xs4 mb-1 pb-0>
      <p class="text-xs-left grey--text darken-2" style="margin: 2px; margin-left: 12px">
        {{ $t(title) }}:
      </p>
    </v-flex>
    <v-flex xs8 mb-0 pb-0>
      <p class="text-xs-right" style="margin: 2px; margin-right: 16px;">
        <!-- show a checkbox of close if this is a boolean -->
        <span v-if="showBoolean">
          <v-icon v-if="value" color="green">check</v-icon>
          <v-icon v-else :color="(showFalseRed) ? 'red' : 'grey'">close</v-icon>
        </span>

        <!-- show the text value -->
        <span v-else :class="(showNegativeNumber) ? 'negative-number' : ''">
          <span v-if="showBold" :class="(showLink) ? 'link' : ''">
            <strong v-if="value">{{ value }}</strong><strong v-else>-</strong>
          </span>
          <span v-else :class="(showLink) ? 'link' : ''">
            <span v-if="value">{{ value }}</span><span v-else>-</span>
          </span>
        </span>
      </p>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Attribute extends Vue {
  @Prop({ default: '' }) title!: string;
  @Prop({ default: '-' }) value!: string;
  @Prop({ default: false }) showBoolean!: boolean;
  @Prop({ default: false }) showFalseRed!: boolean;
  @Prop({ default: false }) showBold!: boolean;
  @Prop({ default: false }) showNegativeNumber!: boolean;
  @Prop({ default: false }) showLink!: boolean;
}
</script>

<style lang="stylus" scoped>
.negative-number
  color: red !important;

.link
  color: #27a4bd !important;
  cursor: pointer;
</style>
