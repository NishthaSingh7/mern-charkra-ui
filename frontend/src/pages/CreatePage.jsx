import React, { useState } from "react";
import {
  Container,
  Box,
  Heading,
  Input,
  Button,
  useColorModeValue,
  useToast,
  VStack,
  Text,
  Fade,
} from "@chakra-ui/react";
import { useProductStore } from "../store/product";

const CreatePage = () => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    image: "",
    category: "",
  });

  const toast = useToast();
  const { createProduct } = useProductStore();

  const handleAddProduct = async () => {
    const { success, message } = await createProduct(newProduct);
    if (!success) {
      toast({
        title: "Error",
        description: message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });
    } else {
      toast({
        title: "Success 🎉",
        description: message,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      setNewProduct({ name: "", price: "", image: "", category: "" });
    }
  };

  const bg = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const headingGradient = useColorModeValue(
    "linear(to-r, blue.500, cyan.400)",
    "linear(to-r, teal.200, blue.400)"
  );

  return (
    <Box bg={bg} minH="100vh" py={12}>
      <Container maxW="container.sm">
        <Fade in>
          <VStack spacing={10}>
            <Heading
              as="h1"
              size="2xl"
              textAlign="center"
              bgGradient={headingGradient}
              bgClip="text"
              fontWeight="extrabold"
              letterSpacing={0.5}
            >
              🛒 Create New Product
            </Heading>

            <Box
              w="full"
              bg={cardBg}
              p={8}
              rounded="xl"
              shadow="2xl"
              border="1px solid"
              borderColor={useColorModeValue("gray.200", "gray.700")}
              transition="all 0.3s"
              _hover={{
                transform: "translateY(-3px)",
                shadow: "xl",
              }}
            >
              <VStack spacing={5}>
                <Text
                  fontSize="lg"
                  fontWeight="medium"
                  color={useColorModeValue("gray.600", "gray.400")}
                >
                  Enter product details below 👇
                </Text>

                <Input
                  placeholder="Product Name"
                  name="name"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                  focusBorderColor="blue.400"
                />

                <Input
                  placeholder="Price"
                  name="price"
                  type="number"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, price: e.target.value })
                  }
                  focusBorderColor="blue.400"
                />

                <Input
                  placeholder="Image URL"
                  name="image"
                  value={newProduct.image}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, image: e.target.value })
                  }
                  focusBorderColor="blue.400"
                />

                <Input
                  placeholder="Category"
                  name="category"
                  value={newProduct.category}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, category: e.target.value })
                  }
                  focusBorderColor="blue.400"
                />

                <Button
                  colorScheme="blue"
                  w="full"
                  size="lg"
                  fontWeight="bold"
                  shadow="md"
                  _hover={{
                    bgGradient: "linear(to-r, blue.500, cyan.400)",
                    transform: "translateY(-2px)",
                  }}
                  onClick={handleAddProduct}
                >
                  Add Product
                </Button>
              </VStack>
            </Box>
          </VStack>
        </Fade>
      </Container>
    </Box>
  );
};

export default CreatePage;
