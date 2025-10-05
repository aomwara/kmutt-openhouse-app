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
} from "@chakra-ui/react"

import StaffAppLayout from "@/views/layouts/StaffAppLayout"
import StaffProfileCard from "@/components/ProfileCard/StaffProfileCard"
import StaffLayout from "@/views/layouts/StaffLayout"
import { StaffProfile } from "@/interfaces/KMProfile"
import * as XLSX from "xlsx"

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
    const cardBg = useColorModeValue("white", "gray.700")
    const textColor = useColorModeValue("gray.800", "gray.100")
    const [profile, setProfile] = useState<StaffProfile | null>(null)
    const [activities, setActivities] = useState<Activity[]>([])
    const [loading, setLoading] = useState(true)

    // โหลดข้อมูล profile
    useEffect(() => {
        fetch("/api/staff/profile")
            .then((res) => res.json())
            .then((d) => setProfile(d))
    }, [])

    // โหลดกิจกรรมที่ดูแล
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

    const exportExcel = (activity: Activity) => {
        if (!activity.registrations) return

        // ข้อมูลกิจกรรมบนหัวตาราง
        const headerRows = [
            ["ชื่อกิจกรรม", activity.title],
            ["รายละเอียด", activity.description],
            ["วันที่", activity.date],
            ["เวลาเริ่ม", activity.start_time],
            ["เวลาสิ้นสุด", activity.end_time],
            ["สถานที่", activity.location],
            [],
        ]

        // ข้อมูลนักเรียน
        const studentRows = activity.registrations.map((reg) => [
            `${reg.student.first_name} ${reg.student.last_name}`,
            reg.student.email,
            reg.student.phone,
            new Date(reg.registered_at).toLocaleString("th-TH"),
        ])

        const ws = XLSX.utils.aoa_to_sheet([
            ...headerRows,
            ["ชื่อ-สกุล", "Email", "เบอร์โทร", "เวลาลงทะเบียน"],
            ...studentRows,
        ])
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "Registrations")
        XLSX.writeFile(wb, `${activity.title}-registrations.xlsx`)
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
                        {activities.map((act) => (
                            <Box key={act.id} p={4} bg={cardBg} rounded="xl" shadow="sm">
                                <HStack justify="space-between" mb={2}>
                                    <Text fontSize="md" fontWeight="bold">
                                        {act.title}
                                    </Text>
                                    <Button size="sm" colorScheme="orange" onClick={() => exportExcel(act)}>
                                        Export Excel
                                    </Button>
                                </HStack>
                                <Text color="gray.600">{act.description}</Text>
                                <HStack mt={2} spacing={4}>
                                    <Badge colorScheme="green">วันที่: {act.date}</Badge>
                                    <Badge colorScheme="blue">
                                        เวลา: {act.start_time} - {act.end_time}
                                    </Badge>
                                    <Badge colorScheme="purple">สถานที่: {act.location}</Badge>
                                </HStack>
                                <Text mt={2} fontSize="sm" color="gray.500">
                                    คะแนน: {act.point} | จำนวนผู้ลงทะเบียน: {act.registrations.length} / {act.max_participants}
                                </Text>
                            </Box>
                        ))}
                    </VStack>
                )}
            </Box>
        </StaffAppLayout>
    )
}

export { StaffDashboard }
