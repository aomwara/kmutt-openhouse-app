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


const MyJourneyPage = () => {
    const router = useRouter()
    const bgColor = useColorModeValue("white", "gray.700")
    const textColor = useColorModeValue("gray.800", "gray.200")

    return (
        <StudentAppLayout navigation="กิจกรรมที่ฉันเข้าร่วม">
            <Head>
                <title>Openhouse / กิจกรรมที่ฉันเข้าร่วม</title>
            </Head>
            <Box p={6} bg={bgColor} >
                <Heading fontSize={"xl"} mb={4} color={textColor}>
                    กิจกรรมที่ฉันเข้าร่วม
                </Heading>
                <Text fontSize={"md"} color={textColor}>ยังไม่มีกิจกรรมที่ฉันเข้าร่วม...</Text>
            </Box>

        </StudentAppLayout>
    )
}

export { MyJourneyPage }
