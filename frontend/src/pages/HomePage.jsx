import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  HStack,
  Select,
  Container,
  VStack,
  Text,
  SimpleGrid,
  useColorModeValue,
  Divider,
  Button,
  Fade,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useProductStore } from "../store/product";
import ProductCard from "../components/ProductCard";

const categoryKeywords = {
  fitness: ["gym", "fitness", "workout", "yoga", "training", "exercise"],
  electronics: ["electronics", "tv", "laptop", "camera", "speaker"],
  gadgets: ["gadget", "charger", "earbuds", "powerbank"],
  clothing: ["clothing", "shirt", "jeans", "dress", "apparel"],
  footwear: ["shoe", "shoes", "footwear", "sneaker", "boots"],
  accessories: ["accessory", "accessories", "belt", "watch", "bag"],
  beauty: ["beauty", "makeup", "skincare", "cosmetics"],
  home: ["home", "kitchen", "cookware", "appliance", "decor"],
  books: ["book", "novel", "literature", "paperback"],
  toys: ["toy", "toys", "game", "puzzle"],
  groceries: ["grocery", "groceries", "food", "snack"],
  stationery: ["stationery", "notebook", "pen", "office"],
  pets: ["pet", "pets", "dog", "cat", "pet-food"],
  automotive: ["auto", "automotive", "car", "vehicle"],
};

const HomePage = () => {
  const { fetchProducts, products } = useProductStore();
  const [category, setCategory] = useState("");

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const norm = (s = "") =>
    String(s || "")
      .toLowerCase()
      .trim();

  const displayedProducts = useMemo(() => {
    const c = norm(category);
    if (!c) return products;

    const related = categoryKeywords[c] ? [c, ...categoryKeywords[c]] : [c];
    const regexes = related.map(
      (t) => new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i")
    );

    return products.filter((p) => {
      const name = p.name || "";
      const desc = p.description || "";
      const prodCat = p.category || "";

      const isMatch = regexes.some(
        (rx) => rx.test(prodCat) || rx.test(name) || rx.test(desc)
      );

      const isUncategorized =
        c === "others" && (!p.category || p.category.trim() === "");

      return isMatch || isUncategorized;
    });
  }, [products, category]);

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    fetchProducts();
  };

  // Dynamic Chakra UI colors
  const bg = useColorModeValue("gray.50", "gray.900");
  const boxBg = useColorModeValue("white", "gray.800");
  const titleGradient = useColorModeValue(
    "linear(to-r, cyan.500, blue.500)",
    "linear(to-r, teal.200, blue.400)"
  );
  const textMuted = useColorModeValue("gray.600", "gray.400");

  return (
    <Box bg={bg} minH="100vh" py={12}>
      <Container maxW="container.xl">
        <VStack spacing={10}>
          <Text
            fontSize={{ base: "2xl", md: "4xl" }}
            fontWeight="extrabold"
            bgGradient={titleGradient}
            bgClip="text"
            textAlign="center"
          >
            🛍️ Explore Products
          </Text>

          <Box
            w="full"
            bg={boxBg}
            shadow="md"
            rounded="lg"
            p={5}
            border="1px solid"
            borderColor={useColorModeValue("gray.200", "gray.700")}
          >
            <HStack justify="space-between" flexWrap="wrap" spacing={4}>
              <Select
                value={category}
                onChange={handleCategoryChange}
                w={{ base: "100%", sm: "280px" }}
                bg={useColorModeValue("gray.100", "gray.700")}
                borderColor={useColorModeValue("gray.300", "gray.600")}
                _focus={{ borderColor: "blue.400" }}
                fontWeight="medium"
              >
                <option value="">All Categories</option>
                <option value="electronics">Electronics</option>
                <option value="gadgets">Gadgets</option>
                <option value="fitness">Fitness & Gym</option>
                <option value="clothing">Clothing</option>
                <option value="footwear">Footwear</option>
                <option value="accessories">Accessories</option>
                <option value="beauty">Beauty & Personal Care</option>
                <option value="home">Home & Kitchen</option>
                <option value="books">Books</option>
                <option value="toys">Toys & Games</option>
                <option value="groceries">Groceries</option>
                <option value="stationery">Stationery</option>
                <option value="pets">Pet Supplies</option>
                <option value="automotive">Automotive</option>
                <option value="others">Others</option>
              </Select>

              {category && (
                <Button
                  colorScheme="blue"
                  variant="outline"
                  onClick={() => setCategory("")}
                  size="sm"
                >
                  Clear Filter
                </Button>
              )}
            </HStack>
          </Box>

          {category && (
            <Text
              fontSize="lg"
              fontWeight="semibold"
              color={textMuted}
              textAlign="center"
            >
              Showing products for:{" "}
              <Text as="span" color="blue.400" fontWeight="bold">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Text>
            </Text>
          )}

          <Divider />

          <Fade in>
            <SimpleGrid
              columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
              spacing={8}
              w="full"
            >
              {displayedProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </SimpleGrid>
          </Fade>

          {displayedProducts.length === 0 && (
            <VStack spacing={2} mt={8}>
              <Text
                fontSize="lg"
                textAlign="center"
                fontWeight="semibold"
                color={textMuted}
              >
                No products found 😢{" "}
                <Link to={"/create"}>
                  <Text
                    as="span"
                    color="blue.500"
                    _hover={{ textDecoration: "underline" }}
                  >
                    Create a Product
                  </Text>
                </Link>
              </Text>
            </VStack>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default HomePage;
