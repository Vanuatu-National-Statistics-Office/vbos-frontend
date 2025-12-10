import { useDateStore } from "@/store/date-store";
import { Flex, Slider, IconButton, HStack } from "@chakra-ui/react";
import { useAvailableYears } from "@/hooks/useAvailableYears";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

export const DateSelect = () => {
  const minYear = 2014;
  const maxYear = new Date().getFullYear();
  const { year, setYear } = useDateStore();
  const availableYears = useAvailableYears();

  // Get initial year from URL params if available
  const getInitialYear = () => {
    if (year) return Number(year);
    const params = new URLSearchParams(window.location.search);
    const urlYear = params.get("year");
    return urlYear ? Number(urlYear) : maxYear - 1;
  };

  // Generate marks for the slider
  // Always show min/max year labels, plus dots for years with data
  const marks = [
    { value: minYear, label: minYear.toString() },
    // Add marks for intermediate years with data (no labels, just visual indicators)
    ...availableYears
      .filter((y) => y > minYear && y < maxYear)
      .map((y) => ({ value: y, label: "" })),
    { value: maxYear, label: maxYear.toString() },
  ];

  const currentYear = Number(year) || getInitialYear();

  const handleDecrement = () => {
    if (currentYear > minYear) {
      setYear(String(currentYear - 1));
    }
  };

  const handleIncrement = () => {
    if (currentYear < maxYear) {
      setYear(String(currentYear + 1));
    }
  };

  return (
    <Slider.Root
      width="100%"
      min={minYear}
      max={maxYear}
      value={[currentYear]}
      onValueChange={(e) => setYear(String(e.value[0]))}
      colorPalette="blue"
      variant="solid"
    >
      <Flex justify="space-between" align="center" mb="2">
        <Slider.Label>Set indicator data year</Slider.Label>
        <Slider.ValueText fontWeight="bold" />
      </Flex>
      <HStack gap={2} w="100%">
        <IconButton
          aria-label="Decrement year"
          size="xs"
          variant="ghost"
          onClick={handleDecrement}
          disabled={currentYear <= minYear}
        >
          <LuChevronLeft />
        </IconButton>
        <Slider.Control flex={1} mb={0}>
          <Slider.Track />
          <Slider.Thumb
            index={0}
            width={2}
            height={6}
            bg="blue.muted"
            border="1.5px solid"
            borderColor="blue.solid"
            cursor="pointer"
            _dragging={{ cursor: "grab" }}
            _active={{ cursor: "grab" }}
          >
            <Slider.HiddenInput />
            <Slider.DraggingIndicator
              layerStyle="fill.subtle"
              bottom="6"
              rounded="sm"
              px="1.5"
            >
              <Slider.ValueText />
            </Slider.DraggingIndicator>
          </Slider.Thumb>
          <Slider.Marks
            marks={marks}
            css={{
              "& [data-part='marker'] > .chakra-slider__markerIndicator": {
                bg: "blue.500"
              }
            }}
          />
        </Slider.Control>
        <IconButton
          aria-label="Increment year"
          size="xs"
          variant="ghost"
          onClick={handleIncrement}
          disabled={currentYear >= maxYear}
        >
          <LuChevronRight />
        </IconButton>
      </HStack>
    </Slider.Root>
  );
};
