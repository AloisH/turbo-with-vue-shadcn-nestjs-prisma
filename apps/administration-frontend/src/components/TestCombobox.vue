<script setup lang="ts">
import { Check, ChevronDown } from "lucide-vue-next";
import {
  ComboboxContent,
  ComboboxInput,
  ComboboxItemIndicator,
  ComboboxRoot,
  ComboboxTrigger,
  ComboboxViewport,
} from "radix-vue";

import {
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@heloir/ui/command";
import { ref } from "vue";

const v = ref<string>("");
const options = [
  "Apple",
  "Banana",
  "Blueberry",
  "Grapes",
  "Pineapple",
  "りんご",
];
const vegetables = ["Aubergine", "Broccoli", "Carrot", "Courgette", "Leek"];
</script>

<template>
  <ComboboxRoot v-model="v" class="relative max-w-96">
    <ComboboxInput
      auto-focus
      class="pr-10 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    />
    <ComboboxTrigger
      class="absolute end-0 inset-y-0 flex items-center justify-center px-2"
    >
      <ChevronDown />
    </ComboboxTrigger>

    <ComboboxContent
      class="absolute z-10 w-full mt-2 min-w-[160px] bg-white overflow-hidden rounded shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
    >
      <ComboboxViewport class="p-[5px]">
        <CommandEmpty
          class="text-mauve8 text-xs font-medium text-center py-2"
        />

        <CommandGroup :heading="'Fruits'">
          <CommandItem
            v-for="(option, index) in options"
            :key="index"
            :value="option"
          >
            <ComboboxItemIndicator>
              <Check />
            </ComboboxItemIndicator>
            <span>
              {{ option }}
            </span>
          </CommandItem>
          <CommandSeparator />
        </CommandGroup>

        <CommandGroup :heading="'Vegetables'">
          <CommandItem
            v-for="(option, index) in vegetables"
            :key="index"
            :value="option"
          >
            <ComboboxItemIndicator>
              <Check />
            </ComboboxItemIndicator>
            {{ option }}
          </CommandItem>
        </CommandGroup>
      </ComboboxViewport>
    </ComboboxContent>
  </ComboboxRoot>
</template>
