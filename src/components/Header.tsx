import {
  Box,
  Button,
  Clipboard,
  CloseButton,
  Dialog,
  Heading,
  IconButton,
  Link,
  List,
  Portal,
} from "@chakra-ui/react";
import { ReactNode, useState } from "react";
import { LuCircleHelp, LuLockKeyhole, LuShare2 } from "react-icons/lu";

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
            <NavButton solid>
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

type NavButtonProps = {
  solid?: boolean;
  children: ReactNode;
  onClick?: () => void;
};

const NavButton = ({ solid, onClick, children }: NavButtonProps) => (
  <IconButton
    px="2"
    variant={solid ? "solid" : "outline"}
    fontWeight="600"
    size="sm"
    onClick={onClick}
  >
    {children}
  </IconButton>
);

type ShareDialogProps = {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
};

const ShareDialog = ({ isOpen, setIsOpen }: ShareDialogProps) => {
  return (
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
            <Dialog.Footer>
              <Clipboard.Root value={`${window.location}`} timeout={1500}>
                <Clipboard.Trigger asChild>
                  <Button variant="surface" size="sm">
                    <Clipboard.Indicator />
                    Copy Link
                  </Button>
                </Clipboard.Trigger>
              </Clipboard.Root>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
