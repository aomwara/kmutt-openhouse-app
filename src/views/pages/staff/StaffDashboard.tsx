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
    Spinner,
    Icon,
} from "@chakra-ui/react"
import { QrCode } from "lucide-react"

import StaffAppLayout from "@/views/layouts/StaffAppLayout"
import StaffProfileCard from "@/components/ProfileCard/StaffProfileCard"
import StaffLayout from "@/views/layouts/StaffLayout"
import { StaffProfile } from "@/interfaces/KMProfile"
import { useRouter } from "next/router"

type Activity = {
    id: number
    title: string
    description: string
    date: string
    start_time: string
    end_time: string
    location: string
    point: number
    max_participants: number
    registrations: {
        id: number
        student: {
            first_name: string
            last_name: string
            email: string
            phone: string
        }
        registered_at: string
    }[]
}

const StaffDashboard = () => {
    const router = useRouter()
    const cardBg = useColorModeValue("white", "gray.700")
    const highlightBg = useColorModeValue("orange.50", "orange.900")
    const cardBorder = useColorModeValue("orange.400", "orange.500")
    const textColor = useColorModeValue("gray.800", "gray.100")
    const [profile, setProfile] = useState<StaffProfile | null>(null)
    const [activities, setActivities] = useState<Activity[]>([])
    const [loading, setLoading] = useState(true)

    // โหลด profile
    useEffect(() => {
        fetch("/api/staff/profile")
            .then((res) => res.json())
            .then((d) => setProfile(d))
    }, [])

    // โหลดกิจกรรม
    useEffect(() => {
        const fetchActivities = async () => {
            setLoading(true)
            const res = await fetch("/api/staff/my-activity")
            if (res.ok) {
                const data = await res.json()
                setActivities(data)
            }
            setLoading(false)
        }
        fetchActivities()
    }, [])

    const scan = (activity: Activity) => {
        router.push(`/staff/scan/${activity.id}`)
    }

    const isOngoing = (act: Activity) => {
        const now = new Date()
        const start = new Date(`${act.date}T${act.start_time}`)
        const end = new Date(`${act.date}T${act.end_time}`)
        return now >= start && now <= end
    }

    if (!profile) {
        return (
            <StaffLayout>
                <Flex justify="center" align="center" minH="60vh">
                    <Text>กำลังโหลดข้อมูล Staff Account...</Text>
                </Flex>
            </StaffLayout>
        )
    }

    return (
        <StaffAppLayout navigation="Dashboard">
            <Box>
                <StaffProfileCard data={profile} />
                <Divider mt="-1" mb={6} />

                <Text fontSize="lg" fontWeight="bold" mb={3}>
                    กิจกรรมที่ฉันดูแล
                </Text>

                {loading ? (
                    <Flex justify="center" py={10}>
                        <Spinner size="xl" />
                    </Flex>
                ) : activities.length === 0 ? (
                    <Text>คุณยังไม่มีกิจกรรมที่ดูแล</Text>
                ) : (
                    <VStack spacing={4} align="stretch">
                        {activities.map((act) => {
                            const ongoing = isOngoing(act)
                            return (
                                <Box
                                    key={act.id}
                                    p={5}
                                    bg={ongoing ? highlightBg : cardBg}
                                    borderRadius="2xl"
                                    shadow={ongoing ? "xl" : "sm"}
                                    border={ongoing ? `2px solid ${cardBorder}` : undefined}
                                    transition="all 0.3s"
                                >
                                    <HStack justify="space-between" mb={2}>
                                        <HStack spacing={2}>
                                            {ongoing && <Icon as={QrCode} color="orange.500" />}
                                            <Text fontSize="md" fontWeight="bold">
                                                {act.title}
                                            </Text>
                                        </HStack>

                                        <Button
                                            size="md"
                                            colorScheme="orange"
                                            borderRadius="full"
                                            onClick={() => scan(act)}
                                        >
                                            SCAN
                                        </Button>
                                    </HStack>

                                    <Text color="gray.600" mb={2}>{act.description}</Text>

                                    <HStack spacing={3} wrap="wrap" mb={1}>
                                        <Badge colorScheme="green">วันที่: {act.date}</Badge>
                                        <Badge colorScheme="blue">
                                            เวลา: {act.start_time} - {act.end_time}
                                        </Badge>
                                        <Badge colorScheme="purple">สถานที่: {act.location}</Badge>
                                        {ongoing && <Badge colorScheme="orange">กำลังดำเนินอยู่</Badge>}
                                    </HStack>

                                    <Text fontSize="sm" color="gray.500">
                                        คะแนน: {act.point} | ผู้ลงทะเบียน: {act.registrations.length} / {act.max_participants}
                                    </Text>
                                </Box>
                            )
                        })}
                    </VStack>
                )}
            </Box>
        </StaffAppLayout>
    )
}

export { StaffDashboard }
