"use client"

import { useEffect, useState } from "react"
import {
    Flex,
    Text,
    Box,
    useColorModeValue,
    Divider,
    VStack,
    HStack,
    Badge,
    Button,
    IconButton,
    Input,
} from "@chakra-ui/react"
import KMLayout from "@/views/layouts/KMLayout"
import KMProfileCard from "@/components/ProfileCard/KMProfileCard"
import KMAppLayout from "@/views/layouts/KMAppLayout"
import { KMProfile } from "@/interfaces/KMProfile"
import { Activity } from "@/interfaces/Activities"
import { EditIcon, ViewIcon } from "@chakra-ui/icons"
import { useRouter } from "next/router"

const ITEMS_PER_PAGE = 5

const KMDashboardPage = () => {
    const router = useRouter()
    const cardBg = useColorModeValue("white", "gray.700")
    const textColor = useColorModeValue("gray.800", "gray.100")

    const [data, setData] = useState<KMProfile | null>(null)
    const [activities, setActivities] = useState<Activity[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [searchKeyword, setSearchKeyword] = useState("")

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

    const handleEdit = (id: number) => {
        router.push(`/_km/activity/view/${id}`)
    }

    const activityColors: Record<string, string> = {
        workshop: "blue",
        regis_activity: "green",
        non_regis_activity: "orange",
    }

    // --- Filter activities by search keyword ---
    const filteredActivities = activities.filter((act) => {
        const keyword = searchKeyword.toLowerCase()
        return (
            act.title.toLowerCase().includes(keyword) ||
            act.description.toLowerCase().includes(keyword)
        )
    })

    // --- Pagination logic ---
    const totalPages = Math.ceil(filteredActivities.length / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const currentActivities = filteredActivities.slice(startIndex, startIndex + ITEMS_PER_PAGE)

    return (
        <KMAppLayout navigation="Dashboard">
            <Box>
                <KMProfileCard data={data} />
                <Divider mt="-1" mb={6} />

                <Box>
                    {/* Header: กิจกรรมทั้งหมด + Add Button */}
                    <HStack justify="space-between" mb={2}>
                        <Text fontSize="md" fontWeight="bold" color={textColor}>
                            กิจกรรมทั้งหมด
                        </Text>

                        <Button
                            size="sm"
                            colorScheme="orange"
                            onClick={() => router.push("/_km/activity/add")}
                        >
                            + เพิ่มกิจกรรม
                        </Button>
                    </HStack>

                    {/* Search Box */}
                    <Input
                        placeholder="ค้นหากิจกรรม..."
                        size="sm"
                        mb={4}
                        value={searchKeyword}
                        onChange={(e) => {
                            setSearchKeyword(e.target.value)
                            setCurrentPage(1) // รีเซ็ต page กลับหน้าแรก
                        }}
                    />

                    <VStack align="stretch" spacing={4}>
                        {currentActivities.length === 0 ? (
                            <Text fontSize="sm" color="gray.500">
                                ไม่พบกิจกรรมที่ตรงกับคำค้น
                            </Text>
                        ) : (
                            currentActivities.map((act) => (
                                <Box
                                    key={act.id}
                                    p={4}
                                    bg={cardBg}
                                    rounded="xl"
                                    shadow="sm"
                                    position="relative"
                                >
                                    <HStack justify="space-between" mb={2}>
                                        {/* Title */}
                                        <Text fontSize="md" fontWeight="bold">
                                            {act.title}
                                        </Text>

                                        <HStack spacing={2}>
                                            {/* Activity Type */}
                                            <Badge
                                                colorScheme={activityColors[act.activity_type] || "gray"}
                                                textTransform="capitalize"
                                            >
                                                {act.activity_type.replace("_", " ")}
                                            </Badge>

                                            {/* Edit Button */}
                                            <IconButton
                                                aria-label="Edit activity"
                                                icon={<EditIcon />}
                                                size="sm"
                                                onClick={() => handleEdit(act.id)}
                                            />
                                        </HStack>
                                    </HStack>

                                    {/* Description */}
                                    <Text fontSize="sm" color={textColor} noOfLines={3}>
                                        {act.description}
                                    </Text>

                                    {/* Location + Faculty + Department */}
                                    <Text fontSize="xs" mt={2} color="gray.500">
                                        📍 {act.location} | 🏫 {act.faculty?.name_th} - {act.department?.name_th}
                                    </Text>

                                    {/* Date & Time */}
                                    <Text fontSize="xs" color="gray.500">
                                        📅 {act.date} | ⏰ {act.start_time} - {act.end_time}
                                    </Text>

                                    {/* Points & Max Participants */}
                                    <HStack mt={2} spacing={4}>
                                        <Text fontSize="xs" color="gray.500">
                                            ⭐ Points: {act.point}
                                        </Text>
                                        <Text fontSize="xs" color="gray.500">
                                            👥 Max: {act.max_participants} | Registered: {act.current_register_participants}
                                        </Text>
                                    </HStack>
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
        </KMAppLayout>
    )
}

export { KMDashboardPage }
