import useAreaCouncils from "@/hooks/useAreaCouncils";
import { useAreaStore } from "@/store/area-store";
import { Heading, NativeSelect } from "@chakra-ui/react";

const PROVINCES = [
  { label: "Vanuatu", value: "" },
  { label: "Malampa", value: "Malampa" },
  { label: "Penama", value: "Penama" },
  { label: "Sanma", value: "Sanma" },
  { label: "Shefa", value: "Shefa" },
  { label: "Tafea", value: "Tafea" },
  { label: "Torba", value: "Torba" },
];

const AreaSelect = () => {
  const { ac, province, setAc, setProvince } = useAreaStore();
  const { data: areaCouncils } = useAreaCouncils(province);

  return (
    <>
      <Heading
        flex="1"
        as="h3"
        fontWeight={600}
        fontSize="1rem"
        color="blue.800"
      >
        Administrative Area
      </Heading>
      <NativeSelect.Root size="md">
        <NativeSelect.Field
          value={province}
          onChange={(e) => setProvince(e.currentTarget.value)}
          cursor="pointer"
        >
          {PROVINCES.map((i) => (
            <option value={i.value} key={i.label}>
              {i.label}
            </option>
          ))}
        </NativeSelect.Field>
        <NativeSelect.Indicator />
      </NativeSelect.Root>
      {province && (
        <NativeSelect.Root size="md">
          <NativeSelect.Field
            value={ac}
            onChange={(e) => setAc(e.currentTarget.value)}
            cursor="pointer"
          >
            {areaCouncils?.features
              .map((i) => i.properties.name)
              .map((i) => (
                <option value={i} key={i}>
                  {i}
                </option>
              ))}
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>
      )}
    </>
  );
};

export { AreaSelect };
