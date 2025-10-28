# Map Legend Component

A comprehensive legend system for displaying active map layers with metadata, visualization details, and interactive controls.

## Overview

The Legend component automatically displays information about all active layers on the map, including tabular (choropleth), vector (geometry), and raster (imagery) layers. It provides a clean, consistent UI for understanding what data is currently visualized.

## Architecture

```
Legend/
├── types.ts          # TypeScript type definitions
├── Legend.tsx        # Main container component
├── LayerEntry.tsx    # Individual layer entry renderer
└── index.ts          # Barrel exports
```

**Supporting Files:**
- `/hooks/useLegendLayers.ts` - Hook that prepares legend data from store and API

## Usage

The Legend is automatically integrated into the Map component:

```tsx
import Map from "@/components/Map";

function MyPage() {
  return <Map />;
}
```

The legend will:
- Automatically show when layers are active
- Automatically hide when no layers are active
- Display layer metadata (name, type, unit, visualization style)
- Provide remove buttons to toggle layers off

## Data Flow

```
URL Parameters (e.g., ?layers=v1,t2)
         ↓
   Layer Store (Zustand)
         ↓
   useLegendLayers Hook
         ↓
   Fetches dataset metadata via getDatasets API
         ↓
   Enriches with visualization info
         ↓
   Returns LegendLayer[]
         ↓
   Legend Component renders
```

## Layer Types

### Tabular Layers

Tabular layers represent statistical data visualized as choropleth maps on administrative boundaries.

**Features:**
- Shows data range (min/max values)
- Displays unit of measurement
- Color gradient visualization
- Only one can be active at a time

**Example:**
```typescript
{
  id: 1,
  name: "Population Density",
  dataType: "tabular",
  unit: "people per km²",
  colorScheme: "sequential",
  dataRange: { min: 0, max: 5000 }
}
```

### Vector Layers

Vector layers display geometric features (points, lines, polygons) from GeoJSON data.

**Features:**
- Shows geometry type (Point, LineString, Polygon, etc.)
- Displays color coding
- Multiple can be active simultaneously

**Example:**
```typescript
{
  id: 2,
  name: "Road Network",
  dataType: "vector",
  geometryType: "LineString",
  color: "#f97316",
  unit: "kilometers"
}
```

### Raster Layers

Raster layers display continuous imagery or grid data (satellite imagery, elevation, etc.).

**Features:**
- Shows opacity level
- Displays color scheme description
- Only one can be active at a time

**Example:**
```typescript
{
  id: 3,
  name: "Elevation",
  dataType: "raster",
  unit: "meters",
  opacity: 0.7
}
```

## Extending the Legend

### Adding New Layer Actions

The `LayerActionHandler` type supports extensible actions:

```typescript
// In types.ts, add new action type
export type LayerActionType = "toggle" | "remove" | "opacity" | "style";

// In Map/index.tsx, handle the new action
const handleLayerAction: LayerActionHandler = useCallback((details) => {
  if (details.action === "remove") {
    // ... existing code
  } else if (details.action === "opacity") {
    // Handle opacity change
    setLayerOpacity(details.payload.layer.id, details.payload.opacity);
  }
}, [switchLayer]);
```

### Adding Custom Visualization Metadata

To add more visualization details (e.g., specific color palettes):

1. **Extend the type definitions:**
   ```typescript
   // In types.ts
   export interface TabularLegendLayer extends BaseLegendLayer {
     dataType: "tabular";
     colorScheme: "sequential" | "diverging" | "categorical";
     colorPalette?: string[]; // Add this
   }
   ```

2. **Update the hook:**
   ```typescript
   // In useLegendLayers.ts
   function createTabularLegendLayer(...) {
     return {
       // ... existing properties
       colorPalette: ["#eff6ff", "#1e40af"], // Add color array
     };
   }
   ```

3. **Update the component:**
   ```typescript
   // In LayerEntry.tsx
   function TabularEntry(props: TabularLegendLayer) {
     const { colorPalette } = props;

     return (
       // ... render color swatches from colorPalette
     );
   }
   ```

### Detecting Geometry Types Dynamically

Currently, vector layers default to "LineString". To detect actual geometry:

```typescript
// In useLegendLayers.ts
import { useQuery } from "@tanstack/react-query";
import { getDatasetData } from "@/api/getDatasets";

function createVectorLegendLayer(dataset: Dataset): VectorLegendLayer {
  // Fetch the actual data to determine geometry type
  const { data } = useQuery({
    queryKey: ["vector-geom", dataset.id],
    queryFn: () => getDatasetData("vector", dataset.id, new URLSearchParams()),
  });

  const geometryType = data?.features?.[0]?.geometry?.type || "LineString";

  return {
    // ... other properties
    geometryType: geometryType as VectorLegendLayer["geometryType"],
  };
}
```

### Adding Layer Reordering

If you want drag-and-drop reordering like the reference project:

1. **Add motion/react dependency:**
   ```bash
   npm install motion
   ```

2. **Update types.ts:**
   ```typescript
   export type LayerActionType = "toggle" | "remove" | "reorder";

   export interface LayerActionDetails {
     action: LayerActionType;
     payload: {
       layer?: LegendLayer;
       layers?: LegendLayer[]; // For reorder action
     };
   }
   ```

3. **Update Legend.tsx:**
   ```tsx
   import { Reorder } from "motion/react";
   import { chakra } from "@chakra-ui/react";

   const ChReorderGroup = chakra(Reorder.Group);
   const ChReorderItem = chakra(Reorder.Item);

   export function Legend(props: LegendProps) {
     return (
       <ChReorderGroup
         axis="y"
         values={layers}
         onReorder={(newLayers) =>
           onLayerAction?.({ action: "reorder", payload: { layers: newLayers } })
         }
       >
         {/* ... items */}
       </ChReorderGroup>
     );
   }
   ```

4. **Handle reorder in Map component:**
   ```tsx
   const handleLayerAction: LayerActionHandler = useCallback((details) => {
     if (details.action === "reorder") {
       const layerIds = details.payload.layers
         ?.map(l => `${l.dataType.charAt(0)}${l.id}`)
         .join(",");
       setLayers(layerIds);
     }
   }, [setLayers]);
   ```

## Styling

The Legend uses Chakra UI's theme system:

- `bg` - Background color
- `border` - Border color
- `fg.muted` - Muted foreground text
- `blue.500`, `orange.500`, `purple.500` - Layer type accent colors

To customize positioning:

```tsx
// In Legend.tsx, modify the Flex component
<Flex
  position="absolute"
  left={3}           // Adjust horizontal position
  bottom={12}         // Adjust vertical position
  zIndex={100}        // Adjust stacking order
  width={320}         // Adjust width
>
```

## Performance Notes

- The `useLegendLayers` hook uses React Query to cache dataset metadata
- Legend only re-renders when active layers change
- No unnecessary API calls for layer metadata (shared cache with LayerSwitch)

## Testing

To test the legend:

1. **Add a vector layer:**
   - Use LayerSwitch UI to toggle on a vector layer
   - Verify layer appears in legend with correct icon and color

2. **Add a tabular layer:**
   - Toggle on a tabular layer
   - Verify data range displays with min/max values
   - Verify only one tabular layer can be active

3. **Remove a layer:**
   - Click the X button on a legend entry
   - Verify layer is removed from map and legend

4. **Test responsiveness:**
   - View on mobile (legend should reposition)
   - Verify legend hides when no layers active

## Future Enhancements

Potential features to add:

- **Toggle visibility without removing** - Add eye icon to show/hide layers
- **Opacity slider** - Allow adjusting layer transparency
- **Download layer data** - Export current layer data as CSV/GeoJSON
- **Layer info popup** - Click layer name to show detailed metadata
- **Color scheme picker** - Change choropleth color scheme
- **Collapsible legend** - Minimize/expand to save screen space
