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
    ModalBody,
    ModalCloseButton,
    useDisclosure,
} from "@chakra-ui/react"
import { useRouter } from "next/router"
import Head from "next/head"
import QRCode from "react-qr-code"

type StudentProfile = {
    first_name: string
    last_name: string
    school: string
    province: string
    email: string
    phone: string
    uuid: string
}

const MyPassportPage = () => {
    const router = useRouter()
    const bgColor = useColorModeValue("white", "gray.700")
    const textColor = useColorModeValue("gray.800", "gray.200")
    const [profile, setProfile] = useState<StudentProfile | null>(null)
    const { isOpen, onOpen, onClose } = useDisclosure()

    useEffect(() => {
        fetch("/api/student/profile")
            .then((res) => res.json())
            .then((d) => setProfile(d))
    }, [])

    if (!profile) {
        return (
            <StudentAppLayout navigation="พาสปอร์ตของฉัน">
                <Flex justify="center" align="center" h="100vh">
                    <Spinner size="xl" />
                </Flex>
            </StudentAppLayout>
        )
    }

    return (
        <StudentAppLayout navigation="พาสปอร์ตของฉัน">
            <Head>
                <title>Openhouse / พาสปอร์ตของฉัน</title>
            </Head>

            <Flex justify="center" align="flex-start" py={6} px={4}>
                <VStack
                    spacing={6}
                    bg={bgColor}
                    color={textColor}
                    rounded="2xl"
                    p={6}
                    w="full"
                    maxW="sm"
                >
                    {/* QR Code */}
                    <Box bg="white" p={5} rounded="xl" shadow="lg" w="full">
                        <QRCode
                            value={profile.uuid}
                            size={256}
                            style={{ width: "100%", height: "auto" }}
                        />
                    </Box>

                    {/* ข้อมูลโปรไฟล์ */}
                    <VStack spacing={1}>
                        <Text fontWeight="bold" fontSize="lg" textAlign="center">
                            {profile.first_name} {profile.last_name}
                        </Text>
                        <Text fontSize="sm" color="gray.500" textAlign="center">
                            {profile.school} - {profile.province}
                        </Text>
                    </VStack>

                    <Divider />

                    {/* UUID */}
                    <HStack spacing={2} justify="center">
                        <Badge colorScheme="orange" fontSize="0.85em" px={2} py={1}>
                            {profile.uuid}
                        </Badge>
                    </HStack>

                    {/* ปุ่ม Full Screen */}
                    <Button colorScheme="blue" size="sm" onClick={onOpen}>
                        แสดงแบบเต็มหน้าจอ
                    </Button>

                    <Text fontSize="xs" color="gray.400" textAlign="center">
                        กรุณาแสดง QR Code นี้ให้เจ้าหน้าที่สแกน
                    </Text>
                </VStack>
            </Flex>

            {/* Modal Full Screen */}
            <Modal isOpen={isOpen} onClose={onClose} size="full" isCentered>
                <ModalOverlay />
                <ModalContent bg={bgColor}>
                    <ModalCloseButton size="lg" />
                    <ModalBody>
                        <Flex
                            direction="column"
                            justify="center"
                            align="center"
                            h="100vh"
                            textAlign="center"
                            gap={6}
                        >
                            <Box bg="white" p={6} rounded="xl" shadow="lg">
                                <QRCode
                                    value={profile.uuid}
                                    size={320}
                                    style={{ width: "100%", height: "auto" }}
                                />
                            </Box>

                            <VStack spacing={2}>
                                <Text fontWeight="bold" fontSize="lg">
                                    {profile.first_name} {profile.last_name}
                                </Text>
                                <Text fontSize="md" color="gray.500">
                                    {profile.school} - {profile.province}
                                </Text>
                                <Badge colorScheme="orange" fontSize="xs" px={3} py={1}>
                                    {profile.uuid}
                                </Badge>
                            </VStack>
                        </Flex>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </StudentAppLayout>
    )
}

export { MyPassportPage }
