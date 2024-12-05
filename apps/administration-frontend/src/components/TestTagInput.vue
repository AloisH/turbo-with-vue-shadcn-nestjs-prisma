<script setup lang="ts">
import {
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@heloir/ui/command";
import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxInput,
  ComboboxPortal,
  ComboboxRoot,
} from "radix-vue";
import { computed, ref } from "vue";

const frameworks = [
  { value: "next.js", label: "Next.js" },
  { value: "sveltekit", label: "SvelteKit" },
  { value: "nuxt", label: "Nuxt" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
];

const modelValue = ref<string>("");
const open = ref(false);
const searchTerm = ref("");

const filteredFrameworks = computed(() =>
  frameworks.filter((i) => !modelValue.value.includes(i.label)),
);
</script>

<template>
  <ComboboxRoot
    v-model="modelValue"
    v-model:open="open"
    v-model:search-term="modelValue"
    class="w-full"
  >
    <ComboboxAnchor as-child>
      <ComboboxInput
        cmdk-input-wrapper
        auto-focus
        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      />
    </ComboboxAnchor>

    <ComboboxPortal>
      <ComboboxContent>
        <CommandList
          position="popper"
          class="w-[--radix-popper-anchor-width] rounded-md mt-2 border bg-popover text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
        >
          <CommandEmpty />
          <CommandGroup>
            <CommandItem
              v-for="framework in filteredFrameworks"
              :key="framework.value"
              :value="framework.label"
              @select.prevent="
                (ev) => {
                  if (typeof ev.detail.value === 'string') {
                    searchTerm = '';
                    modelValue = ev.detail.value;
                  }

                  if (filteredFrameworks.length === 0) {
                    open = false;
                  }
                }
              "
            >
              {{ framework.label }}
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </ComboboxContent>
    </ComboboxPortal>
  </ComboboxRoot>
</template>
