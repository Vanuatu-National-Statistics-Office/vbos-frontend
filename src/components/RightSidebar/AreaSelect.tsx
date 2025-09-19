import { useAreaStore } from "@/store/area-store";
import { Heading, NativeSelect } from "@chakra-ui/react";

const ADMIN_AREAS = [
  "Vanuatu",
  "Malampa",
  "Penama",
  "Sanma",
  "Shefa",
  "Tafea",
  "Torba",
];

const AreaSelect = () => {
  const { area, setArea } = useAreaStore();
  return (
    <>
      <Heading flex="1" as="h3" fontWeight={600} fontSize="1rem" color="blue.800">
        Administrative Area
      </Heading>
      <NativeSelect.Root size="md">
        <NativeSelect.Field
          value={area}
          onChange={(e) => setArea(e.currentTarget.value)}
          cursor="pointer"
        >
          {ADMIN_AREAS.map((i) => (
            <option value={i} key={i}>
              {i}
            </option>
          ))}
        </NativeSelect.Field>
        <NativeSelect.Indicator />
      </NativeSelect.Root>
    </>
  );
};

export { AreaSelect };
