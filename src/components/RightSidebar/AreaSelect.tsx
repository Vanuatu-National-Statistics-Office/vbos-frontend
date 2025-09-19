import { useAreaStore } from "@/store/area-store";
import { Heading, NativeSelect } from "@chakra-ui/react";

const AreaSelect = () => {
  const { area, setArea } = useAreaStore();
  return (
    <>
      <Heading flex="1" as="h3" fontWeight={600} fontSize="1rem">
        Administrative Area
      </Heading>
      <NativeSelect.Root size="md">
        <NativeSelect.Field
          value={area}
          onChange={(e) => setArea(e.currentTarget.value)}
        >
          <option value="Vanuatu">Vanuatu</option>
          <option value="Malampa">Malampa</option>
          <option value="Penama">Penama</option>
          <option value="Sanma">Sanma</option>
          <option value="Shefa">Shefa</option>
          <option value="Tafea">Tafea</option>
          <option value="Torba">Torba</option>
        </NativeSelect.Field>
        <NativeSelect.Indicator />
      </NativeSelect.Root>
    </>
  );
};

export { AreaSelect };
