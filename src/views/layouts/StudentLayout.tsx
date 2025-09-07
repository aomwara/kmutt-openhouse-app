"use client"

import { ReactNode } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
    Box,
    Flex,
    Button,
    Container,
    HStack,
    IconButton,
    useColorModeValue,
} from "@chakra-ui/react"
import { ArrowLeftIcon } from "@chakra-ui/icons"
import { FiLogOut, FiHome, FiSmartphone, FiSettings } from "react-icons/fi"

type StudentLayoutProps = {
    children: ReactNode
}

export default function StudentLayout({ children }: StudentLayoutProps) {
    const router = useRouter()
    const bg = useColorModeValue("white", "gray.800")
    const borderColor = useColorModeValue("gray.200", "gray.700")

    const handleLogout = () => {
        localStorage.removeItem("currentStudent")
        router.push("/")
    }

    return (
        <Flex direction="column" minH="100vh" bg={useColorModeValue("gray.50", "gray.900")}>
            {/* Header */}
            <Box bg={bg} borderBottomWidth="1px" borderColor={borderColor} py={3}>
                <Container maxW="6xl">
                    <Flex justify="space-between" align="center">
                        <HStack spacing={4}>
                            <Link href="/">
                                <IconButton
                                    aria-label="Back Home"
                                    icon={<ArrowLeftIcon />}
                                    variant="ghost"
                                    size="sm"
                                />
                            </Link>
                            <Link href="/app/dashboard">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    leftIcon={<FiHome />}
                                >
                                    หน้าหลัก
                                </Button>
                            </Link>
                            <Link href="/app/qrcode">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    leftIcon={<FiSmartphone />}
                                >
                                    QR Code
                                </Button>
                            </Link>
                            <Link href="/app/setting">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    leftIcon={<FiSettings />}
                                >
                                    ตั้งค่า
                                </Button>
                            </Link>

                        </HStack>

                        <Button
                            onClick={handleLogout}
                            colorScheme="red"
                            variant="outline"
                            size="sm"
                            leftIcon={<FiLogOut />}
                        >
                            Logout
                        </Button>
                    </Flex>
                </Container>
            </Box>

            {/* Main content */}
            <Container maxW="6xl" flex="1" py={6}>
                {children}
            </Container>
        </Flex>
    )
}
