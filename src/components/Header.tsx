import {
  Box,
  Button,
  ButtonProps,
  Clipboard,
  CloseButton,
  Dialog,
  Heading,
  IconButton,
  Link,
  List,
  Portal,
} from "@chakra-ui/react";
import { ReactNode, useState, useRef } from "react";
import { LuCircleHelp, LuLockKeyhole, LuShare2, LuDownload } from "react-icons/lu";
import { toElement } from "maplibre-gl-map-to-image";
import { useMapStore } from "@/store/map-store";
import { useAreaStore } from "@/store/area-store";
import { useLayerStore } from "@/store/layer-store";
import { useDateStore } from "@/store/date-store";

export const Header = () => {
  const [shareDialogIsOpen, setShareDialogIsOpen] = useState(false);
  return (
    <Box
      as="header"
      display="flex"
      alignItems="center"
      gap="5"
      bg="white"
      px="4"
      py="3"
      shadow="base"
    >
      <Heading
        font="Work Sans"
        letterSpacing="0.125rem"
        fontWeight="400"
        textTransform="uppercase"
        size="md"
        as="h1"
        flex="1"
      >
        VBoS MIS
      </Heading>
      <Box as="nav">
        <List.Root
          display="flex"
          flexDirection="row"
          gap={{ base: "2", md: "4" }}
        >
          <NavButton>
            <LuCircleHelp />
            Help
          </NavButton>
          <NavButton onClick={() => setShareDialogIsOpen(true)}>
            <LuShare2 />
            Share
          </NavButton>
          <Link href="/admin">
            <NavButton solid colorPalette="blue">
              <LuLockKeyhole />
              Admin
            </NavButton>
          </Link>
        </List.Root>
      </Box>
      <ShareDialog
        isOpen={shareDialogIsOpen}
        setIsOpen={setShareDialogIsOpen}
      />
    </Box>
  );
};

interface  NavButtonProps extends ButtonProps {
  solid?: boolean;
  children: ReactNode;
  onClick?: () => void;
}

const NavButton = ({ solid, onClick, children, ...props }: NavButtonProps) => (
  <IconButton
    px="2"
    variant={solid ? "solid" : "outline"}
    fontWeight="600"
    size="sm"
    onClick={onClick}
    {...props}
  >
    {children}
  </IconButton>
);

type ShareDialogProps = {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
};

const ShareDialog = ({ isOpen, setIsOpen }: ShareDialogProps) => {
  const { mapRef } = useMapStore();
  const { ac, province } = useAreaStore();
  const { layers, getLayerMetadata } = useLayerStore();
  const { year } = useDateStore();
  const [isDownloading, setIsDownloading] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const buildFilename = () => {
    const parts = ["vbos-map"];

    // Add province or area council
    if (ac) {
      parts.push(ac.toLowerCase().replace(/\s+/g, "-"));
    } else if (province) {
      parts.push(province.toLowerCase().replace(/\s+/g, "-"));
    }

    // Add layer names
    if (layers) {
      const layerArray = layers.split(",");
      const layerNames = layerArray
        .map(layerId => {
          const metadata = getLayerMetadata(layerId);
          return metadata?.name?.toLowerCase().replace(/\s+/g, "-") || layerId;
        })
        .join("_");
      parts.push(layerNames);
    }

    // Add year
    if (year) {
      parts.push(year);
    }

    // Add date
    parts.push(new Date().toISOString().split("T")[0]);

    return `${parts.join("_")}.png`;
  };

  const handleDownloadMap = async () => {
    if (!mapRef || !imgRef.current) {
      console.error("Map or image ref not available");
      return;
    }

    setIsDownloading(true);

    try {
      const map = mapRef.getMap();

      // Wait for map to be fully loaded
      if (!map.loaded()) {
        await new Promise<void>((resolve) => {
          map.once("load", () => resolve());
        });
      }

      // Wait for map to be idle (all rendering complete)
      if (map.isMoving()) {
        await new Promise<void>((resolve) => {
          map.once("idle", () => resolve());
        });
      } else {
        // Trigger a render to ensure map is up to date
        map.triggerRepaint();
        await new Promise<void>((resolve) => {
          map.once("idle", () => resolve());
        });
      }

      // Call toElement with timeout to prevent hanging
      await Promise.race([
        toElement(map, {
          targetImageId: "map-export-image",
          hideAllControls: true,
          coverEdits: false,
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Map export timed out")), 15000)
        ),
      ]);

      // Wait a moment for the image to be fully set
      await new Promise(resolve => setTimeout(resolve, 100));

      // Download the image
      if (imgRef.current.src && imgRef.current.src.startsWith("data:")) {
        const link = document.createElement("a");
        link.href = imgRef.current.src;
        link.download = buildFilename();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        throw new Error("Failed to generate map image");
      }
    } catch (error) {
      console.error("Error downloading map:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      {/* Hidden image element for map export */}
      <img
        ref={imgRef}
        id="map-export-image"
        style={{ display: "none" }}
        alt=""
      />
      <Dialog.Root
        lazyMount
        size="sm"
        open={isOpen}
        onOpenChange={(e) => setIsOpen(e.open)}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Share</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Box
                  borderColor="blackAlpha.800"
                  bg="gray.100"
                  borderWidth={1}
                  p={2}
                >
                  {`${window.location}`}
                </Box>
              </Dialog.Body>
              <Dialog.Footer gap={2}>
                <Clipboard.Root value={`${window.location}`} timeout={1500}>
                  <Clipboard.Trigger asChild>
                    <Button variant="surface" size="sm">
                      <Clipboard.Indicator />
                      Copy Link
                    </Button>
                  </Clipboard.Trigger>
                </Clipboard.Root>
                <Button
                  variant="surface"
                  size="sm"
                  onClick={handleDownloadMap}
                  disabled={!mapRef || isDownloading}
                >
                  <LuDownload />
                  {isDownloading ? "Downloading..." : "Download Map as PNG"}
                </Button>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
};
