<script setup lang="ts">
import { computed, type Component } from "vue";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "../form";
import { Input } from "../input";
import { Textarea } from "../textarea";
import type { FieldProps } from "./interface";
import AutoFormLabel from "./AutoFormLabel.vue";
import { beautifyObjectName } from "./utils";

const props = defineProps<FieldProps>();
const inputComponent = computed(
  (): Component => (props.config?.component === "textarea" ? Textarea : Input)
);
</script>

<template>
  <FormField v-slot="slotProps" :name="fieldName">
    <FormItem v-bind="$attrs">
      <AutoFormLabel v-if="!config?.hideLabel" :required="required">
        {{ config?.label || beautifyObjectName(label ?? fieldName) }}
      </AutoFormLabel>
      <FormControl>
        <slot v-bind="slotProps">
          <component
            :is="inputComponent"
            type="text"
            v-bind="{ ...slotProps.componentField, ...config?.inputProps }"
            :disabled="disabled"
          />
        </slot>
      </FormControl>
      <FormDescription v-if="config?.description">
        {{ config.description }}
      </FormDescription>
      <FormMessage />
    </FormItem>
  </FormField>
</template>
