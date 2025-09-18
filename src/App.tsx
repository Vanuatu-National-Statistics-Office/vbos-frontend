import { Box, Grid } from "@chakra-ui/react";
import { Header } from "./components/Header";
import Map from "./components/Map";
import { MapRef } from "react-map-gl/maplibre";
import { useRef } from "react";
import { Sidebar } from "./components/Sidebar";
import { useUrlSync } from "./hooks/useUrlSync";

function App() {
  useUrlSync();
  const mapRef = useRef<MapRef>(null);
  return (
    <Grid h="100vh" maxH="100vh" templateRows="max-content 1fr">
      <Header />
      <Grid templateColumns="2fr 5fr 3fr" h="100vh" gap="2" maxH="100vh">
        <Box>
          <Sidebar>Baseline Indicators</Sidebar>
        </Box>
        <Box>
          <Box position="relative" h="100%">
            <Map ref={mapRef} />
          </Box>
        </Box>
        <Box>
          <Sidebar>Analysis</Sidebar>
        </Box>
      </Grid>
    </Grid>
  );
}

export default App;
