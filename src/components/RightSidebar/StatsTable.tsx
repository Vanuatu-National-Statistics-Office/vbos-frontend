import { useAreaStore } from "@/store/area-store";
import { TabularData } from "@/types/api";
import { consolidateStats } from "@/utils/consolidateStats";
import { getAttributes } from "@/utils/getAttributes";
import { Table } from "@chakra-ui/react";

type StatsTableProps = {
  stats: TabularData[];
};

export function StatsTable({ stats }: StatsTableProps) {
  const { province } = useAreaStore();
  const rows = consolidateStats(stats, province ? "area_council" : "province");
  const columns = getAttributes(stats);

  return (
    <Table.ScrollArea>
      <Table.Root
        size="sm"
        mt={2}
        css={{
          "& [data-sticky]": {
            position: "sticky",
            zIndex: 1,
            bg: "bg",

            _after: {
              content: "' '",
              position: "absolute",
              pointerEvents: "none",
              top: "0",
              bottom: "-1px",
              width: "32px",
            },
          },

          "& [data-sticky=end]": {
            _after: {
              insetInlineEnd: "0",
              translate: "100% 0",
              shadow: "inset 8px 0px 8px -8px rgba(0, 0, 0, 0.16)",
            },
          },

          "& [data-sticky=start]": {
            _after: {
              insetInlineStart: "0",
              translate: "-100% 0",
              shadow: "inset -8px 0px 8px -8px rgba(0, 0, 0, 0.16)",
            },
          },
        }}
      >
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader data-sticky="end" minW="max-content" left="0" borderBottomColor="fg">
              {province ? "Area Council" : "Province"}
            </Table.ColumnHeader>
            {columns.map((col) => (
              <Table.ColumnHeader textAlign="right" textTransform="capitalize" borderBottomColor="fg">
                {col}
              </Table.ColumnHeader>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body color="fg.muted">
          {rows.map((row) => (
            <Table.Row key={row.place}>
              <Table.Cell data-sticky="end" left="0">{row.place}</Table.Cell>
              {columns.map((col) => (
                <Table.Cell textAlign="right">
                  {row[col].toLocaleString()}
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  );
}
