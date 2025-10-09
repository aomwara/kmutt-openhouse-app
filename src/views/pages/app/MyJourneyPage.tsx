"use client"

import { useEffect, useState } from "react"
import StudentAppLayout from "@/views/layouts/StudentAppLayout"
import {
    Box,
    Flex,
    Heading,
    Text,
    Spinner,
    VStack,
    Badge,
    useColorModeValue,
    Divider,
    HStack,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    Textarea,
    useDisclosure,
    IconButton,
} from "@chakra-ui/react"
import { StarIcon } from "@chakra-ui/icons"
import { useRouter } from "next/router"
import Head from "next/head"

type EStamp = {
    id: number
    activityId: number
    issued_at: string
    rating: number | null
    feedback: string | null
    activity: {
        title: string
        description: string
        date: string
        start_time: string
        end_time: string
        location: string
        point: number
    }
}

const MyJourneyPage = () => {
    const router = useRouter()
    const bgColor = useColorModeValue("white", "gray.700")
    const textColor = useColorModeValue("gray.800", "gray.200")
    const [loading, setLoading] = useState(true)
    const [journeys, setJourneys] = useState<EStamp[]>([])
    const [selected, setSelected] = useState<EStamp | null>(null)
    const [rating, setRating] = useState(0)
    const [feedback, setFeedback] = useState("")
    const { isOpen, onOpen, onClose } = useDisclosure()

    // โหลดข้อมูลกิจกรรมที่นักเรียนเข้าร่วม
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            const res = await fetch("/api/student/estamp")
            if (res.ok) {
                const data = await res.json()
                setJourneys(data)
            }
            setLoading(false)
        }
        fetchData()
    }, [])

    const handleOpenModal = (item: EStamp) => {
        setSelected(item)
        setRating(item.rating ?? 0)
        setFeedback(item.feedback ?? "")
        onOpen()
    }

    const handleSave = async () => {
        if (!selected) return

        const res = await fetch(`/api/student/estamp/${selected.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ rating, feedback }),
        })

        if (res.ok) {
            // อัปเดตใน state
            setJourneys((prev) =>
                prev.map((j) =>
                    j.id === selected.id ? { ...j, rating, feedback } : j
                )
            )
            onClose()
        } else {
            alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล")
        }
    }

    return (
        <StudentAppLayout navigation="กิจกรรมที่ฉันเข้าร่วม">
            <Head>
                <title>Openhouse / กิจกรรมที่ฉันเข้าร่วม</title>
            </Head>

            <Box p={0}>

                {loading ? (
                    <Flex justify="center" align="center" minH="40vh">
                        <Spinner size="xl" />
                    </Flex>
                ) : journeys.length === 0 ? (
                    <Text fontSize={"md"} color={textColor}>
                        ยังไม่มีกิจกรรมที่ฉันเข้าร่วม...
                    </Text>
                ) : (
                    <VStack spacing={4} align="stretch">
                        {journeys.map((item) => (
                            <Box
                                key={item.id}
                                p={4}
                                bg={bgColor}
                                shadow="sm"
                                rounded="lg"
                                borderWidth="1px"
                            >
                                <HStack justify="space-between" mb={1}>
                                    <Text fontWeight="bold" fontSize="lg">
                                        {item.activity.title}
                                    </Text>
                                    <Badge colorScheme="green">
                                        {item.activity.date}
                                    </Badge>
                                </HStack>
                                {/* <Text noOfLines={1} color="gray.600">{item.activity.description}</Text> */}
                                <Text fontSize="sm" color="gray.500">
                                    เวลา: {item.activity.start_time} - {item.activity.end_time}
                                </Text>
                                <Text fontSize="sm" color="gray.500">
                                    สถานที่: {item.activity.location}
                                </Text>
                                <Divider my={2} />
                                <HStack justify="space-between">
                                    <Text fontSize="sm" color="gray.500">
                                        เข้าร่วมเมื่อ{" "}
                                        {new Date(item.issued_at).toLocaleString("th-TH")}
                                    </Text>

                                    <Button
                                        size="sm"
                                        colorScheme={item.rating ? "yellow" : "orange"}
                                        onClick={() => handleOpenModal(item)}
                                    >
                                        {item.rating ? "ดูการประเมิน" : "ให้คะแนนกิจกรรม"}
                                    </Button>
                                </HStack>
                            </Box>
                        ))}
                    </VStack>
                )}
            </Box>

            {/* Modal ประเมินกิจกรรม */}
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>ให้คะแนนกิจกรรม</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {selected && (
                            <Box>
                                <Text fontWeight="bold" mb={2}>
                                    {selected.activity.title}
                                </Text>

                                <HStack spacing={1} mb={4}>
                                    {[1, 2, 3, 4, 5].map((num) => (
                                        <IconButton
                                            key={num}
                                            aria-label={`star-${num}`}
                                            icon={<StarIcon />}
                                            variant="ghost"
                                            colorScheme={num <= rating ? "yellow" : "gray"}
                                            onClick={() => setRating(num)}
                                        />
                                    ))}
                                </HStack>

                                <Textarea
                                    placeholder="แสดงความคิดเห็นเกี่ยวกับกิจกรรมนี้"
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    rows={4}
                                />
                            </Box>
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="orange" mr={3} onClick={handleSave}>
                            บันทึก
                        </Button>
                        <Button variant="ghost" onClick={onClose}>
                            ปิด
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </StudentAppLayout>
    )
}

export { MyJourneyPage }
