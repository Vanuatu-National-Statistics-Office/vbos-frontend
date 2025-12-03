import { useDateStore } from "@/store/date-store";
import { Flex, Slider } from "@chakra-ui/react";
import { useAvailableYears } from "@/hooks/useAvailableYears";

export const DateSelect = () => {
  const minYear = 2004;
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

  return (
    <Slider.Root
      width="100%"
      min={minYear}
      max={maxYear}
      defaultValue={[getInitialYear()]}
      onValueChangeEnd={(e) => setYear(String(e.value[0]))}
      colorPalette="blue"
      variant="solid"
    >
      <Flex justify="space-between" align="center" mb="2">
        <Slider.Label>Set year data</Slider.Label>
        <Slider.ValueText fontWeight="bold" />
      </Flex>
      <Slider.Control>
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
    </Slider.Root>
  );
};
