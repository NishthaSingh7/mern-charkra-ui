import React, { useState } from "react";
import {
  useDisclosure,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useToast,
  VStack,
  ModalFooter,
  Box,
  IconButton,
  useColorModeValue,
  Heading,
  HStack,
  Image,
  Text,
  Input,
  Button,
  Badge,
  Divider,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { useProductStore } from "../store/product";

const ProductCard = ({ product }) => {
  const [updatedProduct, setUpdatedProduct] = useState(product);
  const textColor = useColorModeValue("gray.700", "gray.200");
  const bg = useColorModeValue("white", "gray.800");
  const { deleteProduct, updateProduct } = useProductStore();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDeleteProduct = async (pid) => {
    const { success, message } = await deleteProduct(pid);
    toast({
      title: success ? "Deleted ✅" : "Error ❌",
      description: message,
      status: success ? "success" : "error",
      duration: 3000,
      isClosable: true,
      position: "bottom-right",
    });
  };

  const handleUpdateProduct = async () => {
    const { success, message } = await updateProduct(
      product._id,
      updatedProduct
    );
    toast({
      title: success ? "Updated 🎉" : "Error ❌",
      description: message,
      status: success ? "success" : "error",
      duration: 3000,
      isClosable: true,
      position: "bottom",
    });
    if (success) onClose();
  };

  return (
    <Box
      bg={bg}
      rounded="xl"
      shadow="lg"
      overflow="hidden"
      border="1px solid"
      borderColor={useColorModeValue("gray.200", "gray.700")}
      transition="all 0.3s ease"
      _hover={{
        transform: "translateY(-6px)",
        shadow: "2xl",
      }}
    >
      <Image
        src={product.image}
        alt={product.name}
        h="220px"
        w="full"
        objectFit="cover"
      />

      <Box p={5}>
        <HStack justify="space-between" mb={2}>
          <Heading as="h3" size="md" color={textColor}>
            {product.name}
          </Heading>
          {product.category && (
            <Badge
              colorScheme="blue"
              fontSize="0.8em"
              px={2}
              py={1}
              rounded="md"
            >
              {product.category}
            </Badge>
          )}
        </HStack>

        <Text fontWeight="bold" fontSize="xl" color={textColor}>
          ₹ {product.price}
        </Text>

        {product.description && (
          <Text mt={2} fontSize="sm" color="gray.500" noOfLines={2}>
            {product.description}
          </Text>
        )}

        <Divider my={3} />

        <HStack spacing={3}>
          <IconButton
            icon={<EditIcon />}
            onClick={onOpen}
            colorScheme="blue"
            variant="solid"
            size="sm"
            shadow="md"
          />
          <IconButton
            icon={<DeleteIcon />}
            onClick={() => handleDeleteProduct(product._id)}
            colorScheme="red"
            variant="solid"
            size="sm"
            shadow="md"
          />
        </HStack>
      </Box>

      {/* Update Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Input
                placeholder="Product Name"
                name="name"
                value={updatedProduct.name}
                onChange={(e) =>
                  setUpdatedProduct({ ...updatedProduct, name: e.target.value })
                }
                focusBorderColor="blue.400"
              />
              <Input
                placeholder="Price"
                name="price"
                type="number"
                value={updatedProduct.price}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    price: e.target.value,
                  })
                }
                focusBorderColor="blue.400"
              />
              <Input
                placeholder="Image URL"
                name="image"
                value={updatedProduct.image}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    image: e.target.value,
                  })
                }
                focusBorderColor="blue.400"
              />
              <Input
                placeholder="Category"
                name="category"
                value={updatedProduct.category}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    category: e.target.value,
                  })
                }
                focusBorderColor="blue.400"
              />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleUpdateProduct}
              shadow="md"
            >
              Update
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ProductCard;
