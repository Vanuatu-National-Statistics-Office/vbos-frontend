import { useDateStore } from "@/store/date-store";
import { NumberInput, HStack, IconButton } from "@chakra-ui/react";
import { LuMinus, LuPlus } from "react-icons/lu";

export const DateSelect = () => {
  const maxYear = new Date().getFullYear() - 1;
  const { year, setYear } = useDateStore();

  return (
    <NumberInput.Root
      unstyled
      spinOnPress={true}
      min={2004}
      max={maxYear}
      value={year || "2024"}
      onValueChange={(e) => setYear(e.value)}
    >
      <NumberInput.Label>Year</NumberInput.Label>
      <HStack gap="2">
        <NumberInput.DecrementTrigger asChild>
          <IconButton variant="outline" size="sm">
            <LuMinus />
          </IconButton>
        </NumberInput.DecrementTrigger>
        <NumberInput.ValueText textAlign="center" fontSize="lg" minW="3ch" />
        <NumberInput.IncrementTrigger asChild>
          <IconButton variant="outline" size="sm">
            <LuPlus />
          </IconButton>
        </NumberInput.IncrementTrigger>
      </HStack>
    </NumberInput.Root>
  );
};
