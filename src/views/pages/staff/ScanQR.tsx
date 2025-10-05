"use client"

import { useEffect, useState } from "react"
import {
    Flex,
    Text,
    Box,
    useColorModeValue,
    Button,
    Spinner,
    Alert,
    AlertIcon,
    VStack,
    HStack,
    Divider,
    Badge,
} from "@chakra-ui/react"
import QrScanner from "react-qr-reader"
import StaffAppLayout from "@/views/layouts/StaffAppLayout"

type ScanLog = {
    uid: string
    time: string
}

const ScanQR = () => {
    const cardBg = useColorModeValue("white", "gray.700")
    const textColor = useColorModeValue("gray.800", "gray.100")
    const [scanning, setScanning] = useState(false)
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState<{ type: "success" | "error" | "info"; msg: string } | null>(null)
    const [logs, setLogs] = useState<ScanLog[]>([])

    const handleError = (err: Error | DOMException | unknown) => {
        console.error("QR Scanner Error:", err)
        setStatus({ type: "error", msg: "เกิดข้อผิดพลาดในการเปิดกล้อง" })
    }

    const handleScan = (data: string | null) => {
        if (data) {
            setLoading(true)
            const uid = data

            setTimeout(() => {
                setLogs((prev) => [
                    { uid, time: new Date().toLocaleString("th-TH") },
                    ...prev.slice(0, 4),
                ])
                setStatus({ type: "success", msg: `Stamp Passport สำเร็จ: UID ${uid}` })
                setLoading(false)
            }, 1000)
        }
    }

    return (
        <StaffAppLayout navigation="Scan">
            <Box p={6} bg={cardBg} borderRadius="lg" shadow="md" textAlign="center">
                <Text fontSize="2xl" fontWeight="bold" color={textColor} mb={6}>
                    สแกน QR Code นักเรียน
                </Text>

                {!scanning ? (
                    <Button colorScheme="teal" size="lg" onClick={() => setScanning(true)}>
                        เริ่มสแกน
                    </Button>
                ) : (
                    <Box>
                        <Box
                            overflow="hidden"
                            borderRadius="lg"
                            border="2px solid"
                            borderColor="teal.400"
                            mx="auto"
                            maxW="300px"
                        >
                            <QrScanner
                                delay={300}
                                onError={handleError}
                                onScan={handleScan}
                                style={{ width: "100%" }}
                            />
                        </Box>
                        <Button mt={4} colorScheme="red" variant="outline" onClick={() => setScanning(false)}>
                            หยุดสแกน
                        </Button>
                    </Box>
                )}

                {loading && (
                    <Box mt={4}>
                        <Spinner /> <Text mt={2}>กำลัง Stamp...</Text>
                    </Box>
                )}

                {status && (
                    <Alert status={status.type} mt={4} borderRadius="md">
                        <AlertIcon />
                        {status.msg}
                    </Alert>
                )}

                <Divider my={6} />

                <Box textAlign="left">
                    <Text fontSize="lg" fontWeight="semibold" mb={3}>
                        ประวัติการสแกนล่าสุด
                    </Text>
                    <VStack align="stretch" spacing={3}>
                        {logs.length === 0 ? (
                            <Text color="gray.500">ยังไม่มีการสแกน</Text>
                        ) : (
                            logs.map((log, idx) => (
                                <HStack
                                    key={idx}
                                    justify="space-between"
                                    p={3}
                                    bg={cardBg}
                                    borderRadius="md"
                                    shadow="sm"
                                >
                                    <Box>
                                        <Text fontWeight="medium">UID: {log.uid}</Text>
                                        <Text fontSize="sm" color="gray.500">
                                            {log.time}
                                        </Text>
                                    </Box>
                                    <Badge colorScheme="teal">Stamped</Badge>
                                </HStack>
                            ))
                        )}
                    </VStack>
                </Box>
            </Box>
        </StaffAppLayout>
    )
}

export { ScanQR }
