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
    <Table.Root size="sm" variant="outline">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>
            {province ? "Area Council" : "Province"}
          </Table.ColumnHeader>
          {columns.map((col) => (
            <Table.ColumnHeader>{col}</Table.ColumnHeader>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.map((row) => (
          <Table.Row key={row.place}>
            <Table.Cell>{row.place}</Table.Cell>
            {columns.map((col) => (
              <Table.Cell>{row[col]}</Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
