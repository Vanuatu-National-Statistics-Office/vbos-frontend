import { Box, Grid } from "@chakra-ui/react";
import { Header } from "./components/Header";
import Map from "./components/Map";
import { MapRef } from "react-map-gl/maplibre";
import { useRef } from "react";
import { useUrlSync } from "./hooks/useUrlSync";
import { LeftSidebar } from "./components/LeftSidebar";
import { RightSidebar } from "./components/RightSidebar";

function App() {
  useUrlSync();
  const mapRef = useRef<MapRef>(null);
  return (
    <Grid h="100vh" maxH="100vh" templateRows="max-content 1fr">
      <Header />
      <Grid templateColumns="auto 5fr auto" height="calc(100vh - 3rem)">
        <Box>
          <LeftSidebar />
        </Box>
        <Box>
          <Box position="relative" h="100%">
            <Map ref={mapRef} />
          </Box>
        </Box>
        <Box>
          <RightSidebar />
        </Box>
      </Grid>
    </Grid>
  );
}

export default App;
