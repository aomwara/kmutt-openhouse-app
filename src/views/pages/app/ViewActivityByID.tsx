"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import StudentAppLayout from "@/views/layouts/StudentAppLayout"
import {
    Box,
    Text,
    Heading,
    VStack,
    HStack,
    Spinner,
    Badge,
    Divider,
    Button,
    useColorModeValue,
    Flex,
    Stack,
    useToast,
} from "@chakra-ui/react"
import Head from "next/head"

interface Activity {
    id: number
    title: string
    description: string
    date: string
    round: number
    start_time: string
    end_time: string
    location: string
    point: number
    max_participants: number
    current_register_participants: number
    stars: number
    form_link?: string
    activity_type: string
    created_at: string
    department: { id: number; name_th: string; name_en: string }
    faculty: { id: number; name_th: string; name_en: string }
    registered?: boolean
}

const ViewActivityByID = () => {
    const router = useRouter()
    const { id } = router.query
    const [activity, setActivity] = useState<Activity | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const bgColor = useColorModeValue("white", "gray.700")
    const textColor = useColorModeValue("gray.700", "gray.400")
    const regisText = useColorModeValue("gray.700", "gray.400")
    const toast = useToast()

    const fetchActivity = async () => {
        if (!id) return
        setLoading(true)
        try {
            const res = await fetch(`/api/student/activities/${id}`)
            const data: Activity = await res.json()
            setActivity(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async () => {
        if (!activity) return
        setSaving(true)
        try {
            const res = await fetch(`/api/student/activities/${activity.id}/register`, {
                method: "POST",
            })
            const data = await res.json()
            if (!res.ok) {
                toast({
                    title: "ลงทะเบียนล้มเหลว",
                    description: data.message,
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                })
            } else {
                toast({
                    title: data.registered ? "ลงทะเบียนสำเร็จ" : "ยกเลิกการลงทะเบียนสำเร็จ",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                })
                fetchActivity() // refresh state
            }
        } catch {
            toast({
                title: "เกิดข้อผิดพลาด",
                description: "ไม่สามารถดำเนินการได้",
                status: "error",
                duration: 3000,
                isClosable: true,
            })
        } finally {
            setSaving(false)
        }
    }

    useEffect(() => {
        fetchActivity()
    }, [id])

    if (loading) {
        return (
            <StudentAppLayout navigation="รายละเอียดกิจกรรม">
                <Flex justify="center" align="center" minH="60vh">
                    <Spinner size="xl" />
                </Flex>
            </StudentAppLayout>
        )
    }

    if (!activity) {
        return (
            <StudentAppLayout navigation="รายละเอียดกิจกรรม">
                <Flex direction="column" align="center" mt={10}>
                    <Text color="red.500" fontSize="lg">ไม่พบกิจกรรม</Text>
                    <Button mt={4} onClick={() => router.back()}>กลับ</Button>
                </Flex>
            </StudentAppLayout>
        )
    }

    return (
        <StudentAppLayout navigation="รายละเอียดกิจกรรม">
            <Head><title>{activity.title}</title></Head>

            <Box maxW="full" bg={bgColor} rounded="xl" p={6} shadow="sm">
                <VStack spacing={4} align="start">
                    {/* Badge ประเภทกิจกรรม */}
                    <Badge
                        fontSize="md"
                        px={2}
                        py={1}
                        colorScheme={
                            activity.activity_type === "workshop"
                                ? "blue"
                                : activity.activity_type === "regis_activity"
                                    ? "green"
                                    : "orange"
                        }
                    >
                        {activity.activity_type === "workshop"
                            ? "Workshop"
                            : activity.activity_type === "regis_activity"
                                ? "กิจกรรมที่ต้องลงทะเบียน"
                                : "กิจกรรมทั่วไป"}
                    </Badge>

                    <Heading size={{ base: "md", md: "lg" }} lineHeight={{ base: "10", md: "50px" }}>{activity.title}</Heading>

                    {/* Description */}
                    <Text fontSize="md" lineHeight={{ base: "8", md: "7" }} color={textColor} noOfLines={4}>
                        {activity.description}
                    </Text>

                    {/* วันที่และเวลา */}
                    <HStack spacing={4} wrap="wrap">
                        <Badge colorScheme="teal" fontSize="sm" fontWeight="bold">
                            วันที่: {activity.date} (รอบ {activity.round})
                        </Badge>
                        <Badge colorScheme="orange" fontSize="sm" fontWeight="bold">
                            เวลา: {activity.start_time} - {activity.end_time}
                        </Badge>
                    </HStack>


                    {/* สถานที่ */}
                    <Text fontSize="sm" color="gray.500">
                        สถานที่: {activity.location} | {activity.faculty.name_th} - {activity.department.name_th}
                    </Text>

                    {/* จำนวนผู้ลงทะเบียน */}
                    {activity.activity_type !== "non_regis_activity" && (
                        <Text fontSize="sm" fontWeight="bold" color={regisText}>
                            จำนวนผู้ลงทะเบียน: {activity.current_register_participants}/{activity.max_participants === 999 ? "ไม่จำกัด" : activity.max_participants}
                        </Text>
                    )}

                    {/* ลิงก์แบบฟอร์ม */}
                    {/* {activity.form_link && (
                        <Button
                            as="a"
                            href={activity.form_link}
                            target="_blank"
                            colorScheme="blue"
                            size="sm"
                        >
                            เปิดแบบฟอร์ม
                        </Button>
                    )} */}

                    {activity.department.name_th === "โครงการร่วมบริหารหลักสูตรมีเดียอาตส์และเทคโนโลยีมีเดีย" ? (
                        <Box
                            bg="yellow.100"           // สีพื้นหลังอ่อน ๆ
                            border="1px"               // เส้นขอบ
                            borderColor="yellow.400"   // สีเส้นขอบ
                            p={4}                      // ช่องว่างรอบ ๆ
                            rounded="md"               // มุมโค้ง
                            fontWeight="semibold"      // ตัวหนาเล็กน้อย
                            color="yellow.800"
                            fontSize={"sm"}
                        >
                            หากลงทะเบียนเข้าร่วมกิจกรรมของ <Text as="span" fontWeight="bold">โครงการร่วมบริหารหลักสูตรมีเดียอาตส์และเทคโนโลยีมีเดีย</Text>
                            {" "}โปรดลงทะเบียนรถเพื่อเดินทางจาก <Text as="span" fontWeight="bold">มจธ.บางมด</Text> ไป <Text as="span" fontWeight="bold">มจธ.บางขุนเทียน</Text> ด้วย

                            Link: <a href="https://kmutt.me/OPHBusBooking2025" target="_blank" style={{ textDecoration: "underline", color: "#3182ce" }}>
                                https://kmutt.me/OPHBusBooking2025
                            </a>
                        </Box>

                    ) : ""}

                    {activity.department.name_th === "คณะสถาปัตยกรรมศาสตร์และการออกแบบ" ? (
                        <Box
                            bg="yellow.100"           // สีพื้นหลังอ่อน ๆ
                            border="1px"               // เส้นขอบ
                            borderColor="yellow.400"   // สีเส้นขอบ
                            p={4}                      // ช่องว่างรอบ ๆ
                            rounded="md"               // มุมโค้ง
                            fontWeight="semibold"      // ตัวหนาเล็กน้อย
                            color="yellow.800"
                            fontSize={"sm"}
                        >
                            If you would like to use the transportation service for  school of Architecture and Design, Bang Khun Thian, please register through this link
                            : <a href="https://forms.office.com/r/iemtQmb05i" target="_blank" style={{ textDecoration: "underline", color: "#3182ce" }}>
                                https://forms.office.com/r/iemtQmb05i
                            </a>
                        </Box>

                    ) : ""}

                    <Divider />

                    {/* ปุ่มลงทะเบียน / ยกเลิก */}
                    {(activity.activity_type === "workshop" || activity.activity_type === "regis_activity") && (
                        <Button
                            width={{ base: "full", md: "auto" }}
                            colorScheme={activity.registered ? "red" : "orange"}
                            onClick={handleRegister}
                            isLoading={saving}
                        >
                            {activity.registered ? "ยกเลิกการลงทะเบียน" : "ลงทะเบียนกิจกรรม"}
                        </Button>
                    )}
                </VStack>
            </Box >
        </StudentAppLayout >
    )
}

export { ViewActivityByID }
