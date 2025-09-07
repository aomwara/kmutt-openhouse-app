"use client"

import { useEffect, useState } from "react"
import StudentLayout from "@/views/layouts/StudentLayout"
import {
    Box,
    Flex,
    Heading,
    Text,
    Avatar,
    AvatarBadge,
    Badge,
    VStack,
    HStack,
    Divider,
} from "@chakra-ui/react"
import { FiCheckCircle, FiMapPin, FiClock } from "react-icons/fi"

type CheckIn = {
    facultyName: string
    checkInPoint: string
    timestamp: string
}

type StudentProfile = {
    first_name: string
    last_name: string
    school: string
    province: string
    email: string
    phone: string
    checkIns: CheckIn[]
}

const StudentDashboardPage = () => {
    const [data, setData] = useState<StudentProfile | null>(null)

    useEffect(() => {
        fetch("/api/student/profile")
            .then((res) => res.json())
            .then((d) => setData(d))
    }, [])

    if (!data) {
        return (
            <StudentLayout>
                <Flex justify="center" align="center" minH="60vh">
                    <Text>กำลังโหลดข้อมูลนักเรียน...</Text>
                </Flex>
            </StudentLayout>
        )
    }

    return (
        <StudentLayout>
            {/* Profile Card */}
            <Box bg="white" p={6} rounded="xl" shadow="md" mb={6}>
                <Flex align="center" justify="space-between" wrap="wrap">
                    <HStack spacing={4}>
                        <Avatar name={data.first_name} size="xl">
                            <AvatarBadge boxSize="1em" bg="green.400" />
                        </Avatar>
                        <VStack align="start" spacing={1}>
                            <Heading size="md">{data.first_name} {data.last_name}</Heading>
                            <Text>{data.school} • {data.province}</Text>
                            <Text fontSize="sm" color="gray.600">📧 {data.email}</Text>
                            {/* <Text fontSize="sm" color="gray.600">📱 {data.phone}</Text> */}
                        </VStack>
                    </HStack>
                    <Badge colorScheme="orange" fontSize="sm">
                        เข้าร่วม 2 จุด
                    </Badge>
                </Flex>
            </Box>

            {/* Check-in History
            <Box bg="white" p={6} rounded="xl" shadow="md" mb={6}>
                <Heading size="md" mb={4}>ประวัติการเข้าร่วมกิจกรรม</Heading>
                <Divider mb={4} />
                {data.checkIns.length === 0 ? (
                    <Text color="gray.500">ยังไม่มีการเข้าร่วมกิจกรรม</Text>
                ) : (
                    <VStack spacing={4} align="stretch">
                        {data.checkIns.map((checkIn, i) => (
                            <Flex
                                key={i}
                                justify="space-between"
                                p={4}
                                bg="gray.50"
                                rounded="md"
                                align="center"
                            >
                                <VStack align="start" spacing={1}>
                                    <Heading size="sm">{checkIn.facultyName}</Heading>
                                    <Text fontSize="sm">{checkIn.checkInPoint}</Text>
                                    <HStack spacing={1} fontSize="xs" color="gray.500">
                                        <FiClock /> <Text>{new Date(checkIn.timestamp).toLocaleString("th-TH")}</Text>
                                    </HStack>
                                </VStack>
                                <Badge colorScheme="green">เสร็จสิ้น</Badge>
                            </Flex>
                        ))}
                    </VStack>
                )}
            </Box> */}

            {/* Available Check-in Points (ตัวอย่าง) */}
            {/* <Box bg="white" p={6} rounded="xl" shadow="md">
                <Heading size="md" mb={4}>จุดเข้าร่วมกิจกรรมทั้งหมด</Heading>
                <Divider mb={4} />
                <VStack spacing={4} align="stretch">
                    <Box p={4} bg="gray.50" rounded="md">
                        <Heading size="sm" mb={2}>คณะวิศวกรรมศาสตร์</Heading>
                        <HStack spacing={2} wrap="wrap">
                            {["วิศวกรรมคอมพิวเตอร์", "วิศวกรรมไฟฟ้า", "วิศวกรรมอุตสาหการ", "วิศวกรรมเครื่องกล"].map((p) => (
                                <Badge key={p} colorScheme="orange">{p}</Badge>
                            ))}
                        </HStack>
                    </Box>
                    <Box p={4} bg="gray.50" rounded="md">
                        <Heading size="sm" mb={2}>คณะวิทยาศาสตร์</Heading>
                        <Badge colorScheme="orange">หลัก</Badge>
                    </Box>
                    <Box p={4} bg="gray.50" rounded="md">
                        <Heading size="sm" mb={2}>คณะเทคโนโลยีสารสนเทศ</Heading>
                        <Badge colorScheme="orange">หลัก</Badge>
                    </Box>
                </VStack>
            </Box> */}
        </StudentLayout>
    )
}

export { StudentDashboardPage }