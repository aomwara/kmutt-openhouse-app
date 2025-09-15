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
import Link from "next/link";
import { Menu, X, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { LandingSections } from "./LandingSection";
import { ScheduleSection } from "./ScheduleSection";
import BoothSection from "./BoothSection";
import MapSection from "./MapSection";

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
            <Box as="header" position="sticky" top="0" zIndex="50" w="full" px={0}>
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
                            <Link href="/" aria-label="KMUTT Open House">
                                <Text fontWeight="bold" fontSize={{ base: "sm", md: "md" }} color={PRIMARY}>
                                    KMUTT Open House
                                </Text>
                            </Link>
                        </HStack>

                        {/* Desktop nav */}
                        <HStack
                            as="nav"
                            spacing={8}
                            display={{ base: "none", md: "flex" }}
                            fontSize="sm"
                            fontWeight="medium"
                        >
                            {/* <Link href="#how">วิธีใช้งาน</Link> */}
                            <Link href="#schedule">กำหนดการ</Link>
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
                            {/* <Box display={{ base: "none", md: "block" }}>
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
                            </Box> */}



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
                                {/* <Link href="#how" onClick={() => setMenuOpen(false)}>
                                    วิธีใช้งาน
                                </Link> */}
                                <Link href="#schedule" onClick={() => setMenuOpen(false)}>
                                    กำหนดการ
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
                mt={"-20vh"}
                as="section"
                minH="110vh"
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

                <VStack zIndex={1} mt="20" textAlign="center" spacing={6} px={6} maxW="4xl">
                    <Heading size={{ base: "md", md: "4xl" }} fontWeight="extrabold" color={textColor}>
                        <Text as="span" color={PRIMARY}>
                            KMUTT OPEN HOUSE 2025 <br />
                        </Text> {" "}
                        JOURNEY OF DISCOVERY
                    </Heading>
                    <Text px={6} fontSize={{ base: "md", md: "lg" }} lineHeight={{ base: "25px", md: "32px" }} color={textColor}>
                        วันที่ 10 – 12 ตุลาคม 2568 เวลา 8:30 น. – 21:00 น. <br />
                        ณ มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี (มจธ.) บางมด และบางขุนเทียน
                    </Text>
                    <HStack spacing={4} pt={4}>
                        <Button
                            as={Link}
                            href="#schedule"
                            size={{ base: "md", md: "lg" }}
                            bg={PRIMARY}
                            _hover={{ bg: "#d6451f" }}
                            color="white"
                            rounded="xl"
                            px={8}
                        >
                            กำหนดการกิจกรรม
                        </Button>
                        {/* <Button
                            as={Link}
                            href="/register"
                            size={{ base: "md", md: "lg" }}
                            variant="outline"
                            borderColor={PRIMARY}
                            color={PRIMARY}
                            _hover={{ bg: `${SECONDARY}30` }}
                            rounded="xl"
                            px={8}
                        >
                            ลงทะเบียน
                        </Button> */}
                    </HStack>
                </VStack>
            </Flex>
            {/* ===== SCHEDULE ===== */}
            <ScheduleSection />
            <BoothSection />
            <MapSection />
            {/* ===== OTHER SECTIONS ===== */}
            <LandingSections />

        </Box>
    );
};

export { LandingPage }