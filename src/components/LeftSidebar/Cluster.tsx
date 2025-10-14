import { Accordion, Box, Skeleton, Stack } from "@chakra-ui/react";
import { LuMinus, LuPlus } from "react-icons/lu";

import { SidebarSectionHeading } from "../SidebarSectionHeading";
import { DatasetSection } from "./DatasetSection";
import { useClusterDatasets } from "@/hooks/useClusters";

type ClusterProps = {
  name: string;
  id: number;
};

const Cluster = ({ name, id }: ClusterProps) => {
  const { data: clusterDatasets, isPending, error } = useClusterDatasets(name);

  if (error) {
    return (
      <Box p={4} fontSize="sm" color="fg.warning">
        Error loading data: {String(error)}
      </Box>
    );
  }

  if (isPending) {
    return (
      <Stack gap={3} px={4} py={1}>
        <Stack gap={1}>
          <Skeleton height={5} width="100px" />
          <Stack gap={1} pl={3}>
            <Skeleton height={3} width="80%" />
            <Skeleton height={3} width="95%" />
            <Skeleton height={3} width="90%" />
          </Stack>
        </Stack>
        <Stack gap={1}>
          <Skeleton height={5} width="120px" />
          <Stack gap={1} pl={3}>
            <Skeleton height={3} width="100%" />
            <Skeleton height={3} width="92%" />
          </Stack>
        </Stack>
      </Stack>
    );
  }

  return (
    <Accordion.Item key={name} value={`${id}`}>
      <Accordion.ItemTrigger cursor="pointer" px={4}>
        <SidebarSectionHeading>{name}</SidebarSectionHeading>
        <Accordion.ItemIndicator asChild color="fg">
          <Accordion.ItemContext>
            {(context) => (context.expanded ? <LuMinus /> : <LuPlus />)}
          </Accordion.ItemContext>
        </Accordion.ItemIndicator>
      </Accordion.ItemTrigger>
      <Accordion.ItemContent>
        <Accordion.ItemBody p={0}>
          <Accordion.Root multiple>
            {clusterDatasets?.map((item) => (
              <DatasetSection
                title={item.type}
                datasets={item.datasets}
                key={item.type}
              />
            ))}
          </Accordion.Root>
        </Accordion.ItemBody>
      </Accordion.ItemContent>
    </Accordion.Item>
  );
};

export { Cluster };
