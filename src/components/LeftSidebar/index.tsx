import { Indicators } from "./Indicators";
import { Sidebar } from "../Sidebar";

const SECTIONS = [
  {
    title: "Baseline Indicators",
    items: [
      {
        title: "Business",
        description: "Information about businesses",
        datasets: [
          {
            name: "Shops",
            datasetId: "shops",
            type: "vector",
          },
        ],
      },
      {
        title: "Education",
        description: "Information about education",
        datasets: [
          {
            name: "Number of students",
            datasetId: "students",
            type: "vector",
          },
          {
            name: "Number of schools",
            datasetId: "schools",
            type: "vector",
          },
          {
            name: "Number of teachers",
            datasetId: "teachers",
            type: "vector",
          },
        ],
      },
    ],
  },
];

const LeftSidebar = () => {
  return (
    <Sidebar title="Data Layers">
      <Indicators sections={SECTIONS} />
    </Sidebar>
  );
};

export { LeftSidebar };
