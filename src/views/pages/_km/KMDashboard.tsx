"use client"

import { useEffect, useState } from "react"
import {
    Flex,
    Text,
    Box,
    useBreakpointValue,
    Container,
    useColorModeValue,
    Divider,
    VStack,
    HStack,
    Badge,
    Button,
} from "@chakra-ui/react"
import KMSidebar from "@/components/Sidebar/KMSidebar"
import KMLayout from "@/views/layouts/KMLayout"
import KMProfileCard from "@/components/ProfileCard/KMProfileCard"

import { KMProfile } from "@/interfaces/KMProfile"

interface Activity {
    id: number
    title: string
    description: string
    date: string
    location: string
    max_participants: number
    activity_type: string
    department: {
        id: number
        name: string
    }
    faculty: {
        id: number
        name: string
    }
}

const ITEMS_PER_PAGE = 5

const KMDashboardPage = () => {
    const cardBg = useColorModeValue("white", "gray.700")
    const textColor = useColorModeValue("gray.800", "gray.100")

    const [data, setData] = useState<KMProfile | null>(null)
    const [activities, setActivities] = useState<Activity[]>([])
    const [currentPage, setCurrentPage] = useState(1)

    const showSidebar = useBreakpointValue({ base: false, md: true })

    useEffect(() => {
        fetch("/api/km/profile")
            .then((res) => res.json())
            .then((d) => setData(d))

        fetch("/api/km/activities")
            .then((res) => res.json())
            .then((d) => setActivities(d))
    }, [])

    if (!data) {
        return (
            <KMLayout>
                <Flex justify="center" align="center" minH="60vh">
                    <Text>กำลังโหลดข้อมูล KMUTT Account...</Text>
                </Flex>
            </KMLayout>
        )
    }

    // Pagination logic
    const totalPages = Math.ceil(activities.length / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const currentActivities = activities.slice(startIndex, startIndex + ITEMS_PER_PAGE)

    return (
        <KMLayout>
            <Container maxW="7xl" px={4} py={6} mt="-10">
                <Flex direction={{ base: "column", md: "row" }} gap={6}>
                    {/* Sidebar */}
                    {showSidebar && <KMSidebar />}

                    <Flex direction="column" flex="1" gap={6}>
                        <Box
                            bg={cardBg}
                            p={6}
                            rounded="2xl"
                            shadow="lg"
                            flex="1"
                        >
                            <Text fontSize="lg" fontWeight="bold" mb={4}>
                                Openhouse / Back office system
                            </Text>

                            <KMProfileCard data={data} />
                            <Divider mt="-1" mb={6} />

                            <Box>
                                <Text fontSize="md" fontWeight="bold" mb={4} color={textColor}>
                                    กิจกรรมทั้งหมด
                                </Text>

                                <VStack align="stretch" spacing={4}>
                                    {currentActivities.length === 0 ? (
                                        <Text fontSize="sm" color="gray.500">
                                            ยังไม่มีกิจกรรม
                                        </Text>
                                    ) : (
                                        currentActivities.map((act) => (
                                            <Box
                                                key={act.id}
                                                p={4}
                                                bg={cardBg}
                                                rounded="xl"
                                                shadow="sm"
                                            >
                                                <HStack justify="space-between" mb={2}>
                                                    <Text fontSize="md" fontWeight="bold">
                                                        {act.title}
                                                    </Text>
                                                    <Badge colorScheme="blue">{act.activity_type}</Badge>
                                                </HStack>
                                                <Text fontSize="sm" color={textColor} noOfLines={2}>
                                                    {act.description}
                                                </Text>
                                                <Text fontSize="xs" mt={2} color="gray.500">
                                                    📍 {act.location} | 🏫 {act.faculty.name} - {act.department.name}
                                                </Text>
                                                <Text fontSize="xs" color="gray.500">
                                                    📅 {new Date(act.date).toLocaleString("th-TH")}
                                                </Text>
                                            </Box>
                                        ))
                                    )}
                                </VStack>

                                {/* Pagination controls */}
                                {totalPages > 1 && (
                                    <HStack justify="center" spacing={2} mt={6}>
                                        <Button
                                            size="sm"
                                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                            isDisabled={currentPage === 1}
                                        >
                                            ก่อนหน้า
                                        </Button>

                                        {[...Array(totalPages)].map((_, i) => (
                                            <Button
                                                key={i}
                                                size="sm"
                                                variant={currentPage === i + 1 ? "solid" : "outline"}
                                                colorScheme="blue"
                                                onClick={() => setCurrentPage(i + 1)}
                                            >
                                                {i + 1}
                                            </Button>
                                        ))}

                                        <Button
                                            size="sm"
                                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                            isDisabled={currentPage === totalPages}
                                        >
                                            ถัดไป
                                        </Button>
                                    </HStack>
                                )}
                            </Box>
                        </Box>
                    </Flex>
                </Flex>
            </Container>
        </KMLayout>
    )
}

export { KMDashboardPage }
