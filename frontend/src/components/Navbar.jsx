import {
  Container,
  HStack,
  Button,
  Flex,
  Text,
  useColorMode,
  useColorModeValue,
  Box,
} from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";
import { CiSquarePlus, CiLight, CiDark } from "react-icons/ci";

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue("whiteAlpha.900", "gray.800");
  const border = useColorModeValue("gray.200", "gray.700");

  return (
    <Box
      position="sticky"
      top="0"
      zIndex="999"
      bg={bg}
      borderBottom="1px solid"
      borderColor={border}
      shadow="md"
      backdropFilter="blur(8px)"
    >
      <Container maxW="1280px" px={4}>
        <Flex
          h={16}
          alignItems="center"
          justifyContent="space-between"
          flexDir={{ base: "column", sm: "row" }}
          py={{ base: 2, sm: 0 }}
        >
          <Text
            bgGradient="linear(to-r, cyan.400, blue.500)"
            bgClip="text"
            fontSize={{ base: "xl", sm: "2xl" }}
            fontWeight="extrabold"
            textAlign="center"
            textTransform="uppercase"
            letterSpacing={0.5}
            _hover={{
              bgGradient: "linear(to-r, blue.500, cyan.400)",
              transform: "scale(1.03)",
            }}
            transition="all 0.2s ease"
          >
            <Link to="/">
              Store Manager {" "}
              <Text as="span" color="blue.400">
                — Powered by Chakra UI 🌐
              </Text>{" "}
              ⚡
            </Link>
          </Text>

          <HStack spacing={3} alignItems="center" mt={{ base: 2, sm: 0 }}>
            <Link to="/create">
              <Button
                leftIcon={<CiSquarePlus size={20} />}
                colorScheme="blue"
                variant="solid"
                size="sm"
                shadow="md"
                _hover={{
                  bgGradient: "linear(to-r, blue.500, cyan.400)",
                  transform: "translateY(-2px)",
                }}
              >
                Add
              </Button>
            </Link>

            <Button
              onClick={toggleColorMode}
              colorScheme="gray"
              variant="ghost"
              size="sm"
              _hover={{
                transform: "rotate(15deg)",
                color: "blue.400",
              }}
            >
              {colorMode === "light" ? (
                <CiLight size={22} />
              ) : (
                <CiDark size={22} />
              )}
            </Button>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};

export default Navbar;
