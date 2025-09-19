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
  {
    title: "Disaster Indicators",
    items: [
      {
        title: "Business",
        description: "Information about impact of disaster on businesses.",
        datasets: [
          {
            name: "Shops affected",
            datasetId: "shops",
            type: "vector",
          },
        ],
      },
      {
        title: "Education",
        description: "Information about impact of disaster on education.",
        datasets: [
          {
            name: "Prediction: Damages",
            datasetId: "education_damages",
            type: "vector",
          },
          {
            name: "Immediate Response: Resources",
            datasetId: "education_resources",
            type: "vector",
          },
          {
            name: "Financial Recovery: Assets",
            datasetId: "education_recovery_assets",
            type: "vector",
          },
        ],
      },
    ],
  },
];

const LeftSidebar = () => {
  return (
    <Sidebar direction="left" title="Data Layers">
      <Indicators sections={SECTIONS} />
    </Sidebar>
  );
};

export { LeftSidebar };
