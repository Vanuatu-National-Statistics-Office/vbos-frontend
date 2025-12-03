import { Accordion, Flex, Heading, VStack } from "@chakra-ui/react";
import { useLayerStore } from "@/store/layer-store";
import { useOpacityStore } from "@/store/opacity-store";
import { useLegendLayers } from "@/components/Map/Legend/hooks/useLegendLayers";
import { LayerEntry } from "./LayerEntry";

/**
 * Legend component displaying a list of active map layers with legend details.
 *
 * The legend automatically hides when no layers are active. Each layer entry
 * shows the layer name, type, visualization style, and controls for opacity and removal.
 */
export function Legend() {
  const { switchLayer } = useLayerStore();
  const { setOpacity } = useOpacityStore();
  const legendLayers = useLegendLayers();

  // Hide legend when no layers are active
  if (!legendLayers.length) return null;
  return (
    <Flex
      position="absolute"
      left={2}
      bottom={{ base: "4.5rem", md: 28 }}
      zIndex={100}
      width={{ base: "280px", md: "320px" }}
      maxH="22rem"
      bg="bg"
      overflow="auto"
      rounded="sm"
      shadow="sm"
      border="1px solid"
      borderColor="border"
      fontFamily="body"
      flexFlow="column"
    >
      <Accordion.Root collapsible defaultValue={["legend"]}>
        <Accordion.Item value="legend" w="full">
          <Accordion.ItemTrigger
            p={3}
            borderBottom="1px solid"
            borderColor="border.muted"
            rounded="none"
            position="sticky"
            top={0}
            bg="bg"
            zIndex={10}
          >
            <Heading
              size="sm"
              as="h2"
              fontSize="xs"
              color="fg.muted"
              textTransform="uppercase"
              lineHeight="normal"
              letterSpacing="wide"
              flex={1}
            >
              Legend
            </Heading>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>
            <VStack
              as="ul"
              listStyleType="none"
              fontSize="xs"
              p={0}
              m={0}
              w="100%"
              gap={0}
              align="stretch"
            >
              {legendLayers.map((layer) => (
                <Flex
                  as="li"
                  key={`${layer.dataType}-${layer.id}`}
                  p={2}
                  px={3}
                  borderBottom="1px solid"
                  borderColor="border"
                  _last={{ borderBottom: "none" }}
                >
                  <LayerEntry
                    {...layer}
                    switchLayer={switchLayer}
                    setOpacity={setOpacity}
                  />
                </Flex>
              ))}
            </VStack>
          </Accordion.ItemContent>
        </Accordion.Item>
      </Accordion.Root>
    </Flex>
  );
}
