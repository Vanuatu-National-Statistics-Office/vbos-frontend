import {
  forwardRef,
  Ref,
  useCallback,
  useImperativeHandle,
  useState,
} from "react";
import ReactMapGl, {
  type MapRef,
  type MapProps,
  ViewStateChangeEvent,
  NavigationControl,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useMapStore } from "@/store/map-store";

function Map(props: MapProps, ref: Ref<MapRef | undefined>) {
  const [map, setMap] = useState<MapRef>();
  const setMapRef = (m: MapRef) => setMap(m);
  const { viewState, setViewState } = useMapStore();

  useImperativeHandle(ref, () => {
    if (map) {
      return map;
    }
  }, [map]);

  const onMove = useCallback(
    (evt: ViewStateChangeEvent) => {
      setViewState(evt.viewState);
    },
    [setViewState],
  );

  return (
    <ReactMapGl
      {...viewState}
      ref={setMapRef}
      onMove={onMove}
      mapStyle="https://tiles.openfreemap.org/styles/positron"
      touchPitch={false}
      dragRotate={false}
      {...props}
    >
      <NavigationControl
        position="bottom-left"
        showZoom
        style={{ marginBottom: "7rem" }}
      />
      {props.children}
    </ReactMapGl>
  );
}

export default forwardRef(Map);
