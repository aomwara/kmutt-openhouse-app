"use client";

import {
    Box,
    Flex,
    Heading,
    Text,
    Button,
    HStack,
    VStack,
    IconButton,
    Container,
    useColorMode,
    useColorModeValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Menu, X, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { LandingSections } from "./LandingSection";

const MotionBox = motion(Box);

const PRIMARY = "#F04E23"; // KMUTT Orange Red
const SECONDARY = "#FFC233"; // KMUTT Yellow

const LandingPage = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { colorMode, toggleColorMode } = useColorMode();

    const bg = useColorModeValue("white", "gray.900");
    const textColor = useColorModeValue("gray.800", "gray.100");
    const navBg = useColorModeValue("whiteAlpha.85", "gray.800");
    const borderColor = useColorModeValue("orange.100", "gray.700");

    return (
        <Box minH="100vh" bg={useColorModeValue("white", "gray.900")} color={textColor}>
            {/* ===== NAVBAR ===== */}
            <Box as="header" position="sticky" top="0" zIndex="50" w="full" px={4}>
                <Container maxW="7xl" py={4}>
                    <Flex
                        bg={navBg}
                        backdropFilter="blur(12px)"
                        border="1px solid"
                        borderColor={borderColor}
                        rounded="2xl"
                        shadow="sm"
                        px={6}
                        h="16"
                        align="center"
                        justify="space-between"
                    >
                        {/* Logo */}
                        <HStack spacing={3}>
                            <Box w={8} h={8} rounded="xl" bg={PRIMARY} />
                            <Text fontWeight="bold" color={PRIMARY}>
                                KMUTT Passport
                            </Text>
                        </HStack>

                        {/* Desktop nav */}
                        <HStack
                            as="nav"
                            spacing={8}
                            display={{ base: "none", md: "flex" }}
                            fontSize="sm"
                            fontWeight="medium"
                        >
                            <Link href="#how">วิธีใช้งาน</Link>
                            <Link href="#features">ฟีเจอร์</Link>
                            <Link href="#stats">สถิติ</Link>
                            <Link href="#testimonials">เสียงจากผู้ใช้</Link>
                        </HStack>

                        {/* Right side buttons */}
                        <HStack spacing={2}>
                            {/* Dark Mode Toggle */}
                            <IconButton
                                aria-label="Toggle Dark Mode"
                                icon={colorMode === "light" ? <Moon /> : <Sun />}
                                onClick={toggleColorMode}
                                variant="ghost"
                            />

                            {/* Desktop login */}
                            <Box display={{ base: "none", md: "block" }}>
                                <Button
                                    as={Link}
                                    href="/login"
                                    bg={PRIMARY}
                                    _hover={{ bg: "#d6451f" }}
                                    color="white"
                                    rounded="xl"
                                >
                                    เข้าสู่ระบบ
                                </Button>
                            </Box>

                            {/* Mobile Hamburger */}
                            <Box display={{ base: "block", md: "none" }}>
                                <IconButton
                                    aria-label="Toggle Menu"
                                    icon={menuOpen ? <X /> : <Menu />}
                                    onClick={() => setMenuOpen(!menuOpen)}
                                    color={PRIMARY}
                                    variant="ghost"
                                />
                            </Box>
                        </HStack>
                    </Flex>

                    {/* Mobile dropdown menu */}
                    {menuOpen && (
                        <Box
                            mt={2}
                            rounded="2xl"
                            border="1px solid"
                            borderColor={borderColor}
                            bg={bg}
                            shadow="md"
                            px={6}
                            py={4}
                        >
                            <VStack align="stretch" spacing={4}>
                                <Link href="#how" onClick={() => setMenuOpen(false)}>
                                    วิธีใช้งาน
                                </Link>
                                <Link href="#features" onClick={() => setMenuOpen(false)}>
                                    ฟีเจอร์
                                </Link>
                                <Link href="#stats" onClick={() => setMenuOpen(false)}>
                                    สถิติ
                                </Link>
                                <Link href="#testimonials" onClick={() => setMenuOpen(false)}>
                                    เสียงจากผู้ใช้
                                </Link>
                                <Button
                                    as={Link}
                                    href="/student/login"
                                    w="full"
                                    bg={PRIMARY}
                                    _hover={{ bg: "#d6451f" }}
                                    color="white"
                                    rounded="xl"
                                >
                                    เข้าสู่ระบบ
                                </Button>
                            </VStack>
                        </Box>
                    )}
                </Container>
            </Box>

            {/* ===== HERO ===== */}
            <Flex
                as="section"
                minH="100vh"
                align="center"
                justify="center"
                overflow="hidden"
                bgGradient={useColorModeValue(
                    `linear(to-br, white, ${SECONDARY}20)`,
                    `linear(to-br, gray.900, ${PRIMARY}20)`
                )}
                position="relative"
            >
                {/* Background Circles */}
                <Box position="absolute" inset="0" zIndex={0}>
                    <svg width="100%" height="100%">
                        <circle cx="20%" cy="30%" r="250" fill={`${PRIMARY}20`} />
                        <circle cx="80%" cy="70%" r="200" fill={`${SECONDARY}25`} />
                    </svg>
                </Box>

                <VStack zIndex={1} textAlign="center" spacing={6} px={6} maxW="3xl">
                    <Heading size="3xl" fontWeight="extrabold" color={textColor}>
                        KMUTT Passport{" "}
                        <Text as="span" color={PRIMARY}>
                            Open House 2025
                        </Text>
                    </Heading>
                    <Text fontSize={{ base: "lg", md: "xl" }} color={textColor}>
                        พาสปอร์ตดิจิทัลที่จะพาคุณทัวร์ทุกคณะ ทุกกิจกรรม และค้นหาแรงบันดาลใจที่ มจธ.
                    </Text>
                    <HStack spacing={4} pt={4}>
                        <Button
                            as={Link}
                            href="/login"
                            size="lg"
                            bg={PRIMARY}
                            _hover={{ bg: "#d6451f" }}
                            color="white"
                            rounded="xl"
                            px={8}
                        >
                            เริ่มใช้งาน Passport
                        </Button>
                        <Button
                            as={Link}
                            href="/register"
                            size="lg"
                            variant="outline"
                            borderColor={PRIMARY}
                            color={PRIMARY}
                            _hover={{ bg: `${SECONDARY}30` }}
                            rounded="xl"
                            px={8}
                        >
                            สมัครสมาชิก
                        </Button>
                    </HStack>
                </VStack>
            </Flex>

            <LandingSections />
        </Box>
    );
}


export { LandingPage }