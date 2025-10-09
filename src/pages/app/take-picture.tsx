"use client"

import { useRef, useState, useEffect } from "react"
import {
    Box,
    Button,
    VStack,
    Heading,
    Image,
    useToast,
    Spinner,
    Text,
    Center,
    SimpleGrid,
    HStack,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    IconButton,
} from "@chakra-ui/react"
import { DeleteIcon, RepeatIcon } from "@chakra-ui/icons"
import Webcam from "react-webcam"
import imageCompression from "browser-image-compression"
import StudentAppLayout from "@/views/layouts/StudentAppLayout"
import Head from "next/head"

type UploadLog = {
    id: number
    image_url: string
    taken_at: string
}

const TakePicturePage = () => {
    const webcamRef = useRef<Webcam>(null)
    const toast = useToast()
    const [image, setImage] = useState<string | null>(null)
    const [uploading, setUploading] = useState(false)
    const [logs, setLogs] = useState<UploadLog[]>([])
    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [facingMode, setFacingMode] = useState<"user" | "environment">("user")

    // ดึง logs จาก server
    const fetchLogs = async () => {
        try {
            const res = await fetch("/api/student/get-picture")
            const data = await res.json()
            setLogs(data.logs ?? [])
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        fetchLogs()
    }, [])

    // ถ่ายรูป
    const capture = () => {
        const imgSrc = webcamRef.current?.getScreenshot()
        if (imgSrc) setImage(imgSrc)
    }

    // สลับกล้อง
    const toggleCamera = () => {
        setFacingMode(prev => (prev === "user" ? "environment" : "user"))
    }

    // อัปโหลดรูป
    const handleUpload = async () => {
        if (!image) return
        setUploading(true)
        try {
            const blob = await fetch(image).then(r => r.blob())
            const file = new File([blob], `photo-${Date.now()}.jpg`, { type: "image/jpeg" })

            const compressedFile = await imageCompression(file, {
                maxSizeMB: 1, // เพิ่มเป็น 1MB เพื่อให้คุณภาพสูงขึ้น
                maxWidthOrHeight: 2560, // เพิ่ม resolution เพื่อไม่บีบมากเกินไป
                initialQuality: 0.9, // ตั้งค่าเริ่มต้นคุณภาพสูง
                useWebWorker: true,
            })
            const reader = new FileReader()
            reader.readAsDataURL(compressedFile)
            reader.onloadend = async () => {
                const base64data = reader.result as string
                const res = await fetch("/api/student/upload", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ base64: base64data }),
                })

                const data = await res.json()
                if (!res.ok) {
                    toast({ title: data.error || "Upload failed", status: "error" })
                    return
                }

                toast({ title: "อัปโหลดสำเร็จ!", status: "success" })
                setLogs(prev => [data.uploaded, ...prev])
                setImage(null)
            }
        } catch (err) {
            console.error(err)
            toast({ title: "เกิดข้อผิดพลาด", status: "error" })
        } finally {
            setUploading(false)
        }
    }

    const openModal = (url: string) => {
        setSelectedImage(url)
        onOpen()
    }

    const handleDelete = async (id: number) => {
        try {
            const res = await fetch(`/api/student/delete-picture?id=${id}`, { method: "DELETE" })
            if (!res.ok) throw new Error("Delete failed")
            setLogs(prev => prev.filter(log => log.id !== id))
            toast({ title: "ลบเรียบร้อย", status: "success" })
        } catch (err) {
            console.error(err)
            toast({ title: "ลบไม่สำเร็จ", status: "error" })
        }
    }

    return (
        <StudentAppLayout navigation="ถ่ายรูปกิจกรรม Open House 2025">
            <Head>
                <title>Openhouse / ถ่ายรูปกิจกรรม</title>
            </Head>

            {/* Header */}
            <Box
                w="full"
                bgGradient="linear(to-r, orange.400, orange.600)"
                color="white"
                p={4}
                rounded="2xl"
                textAlign="center"
                shadow="lg"
            >
                <Heading size="md" mb={2} fontWeight="bold">
                    📸 มาอวดรูปกันหน่อย
                </Heading>
                <Text mt={-2} fontSize={{ base: "xs", md: "md" }} fontWeight="semibold">
                    และอัปโหลดเพื่อลุ้นรับของที่ระลึกสุดพิเศษ
                </Text>
            </Box>

            <Center>
                <VStack spacing={6} w="full" mt={2} align="stretch">
                    {/* Camera */}
                    <Box borderRadius="2xl" overflow="hidden">
                        {!image ? (
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                width="100%"
                                height={360}
                                videoConstraints={{ facingMode }}
                                style={{ borderRadius: 16 }}
                            />
                        ) : (
                            <Image
                                src={image}
                                alt="preview"
                                width="100%"
                                height={360}
                                objectFit="cover"
                                borderRadius="2xl"
                                cursor="pointer"
                                onClick={() => openModal(image)}
                            />
                        )}
                    </Box>

                    {/* Action Buttons */}
                    <HStack spacing={3} justify="center">
                        {/* สลับกล้อง */}
                        <Button size="sm" leftIcon={<RepeatIcon />} onClick={toggleCamera}>
                            {/* กล้อง: {facingMode === "user" ? "หน้า" : "หลัง"} */}
                        </Button>

                        {!image ? (
                            <Button colorScheme="orange" size="lg" flex={1} onClick={capture}>
                                ถ่ายรูป
                            </Button>
                        ) : (
                            <>
                                <Button
                                    colorScheme="orange"
                                    size="lg"
                                    flex={1}
                                    onClick={handleUpload}
                                    isLoading={uploading}
                                    loadingText="กำลังอัปโหลด"
                                >
                                    อัปโหลด
                                </Button>
                                <Button variant="outline" size="lg" flex={1} onClick={() => setImage(null)}>
                                    ถ่ายใหม่
                                </Button>
                            </>
                        )}
                    </HStack>

                    {/* Gallery */}
                    {logs.length > 0 && (
                        <Box mt={4}>
                            <Heading size="md" mb={2}>Gallery ของฉัน</Heading>
                            <SimpleGrid columns={{ base: 2, md: 3 }} spacing={2}>
                                {logs.map(log => (
                                    <Box key={log.id} borderRadius="md" overflow="hidden" border="1px solid #eee" position="relative">
                                        <Image
                                            src={log.image_url}
                                            alt="Uploaded"
                                            objectFit="cover"
                                            width="100%"
                                            height={120}
                                            cursor="pointer"
                                            onClick={() => openModal(log.image_url)}
                                        />
                                        <IconButton
                                            aria-label="Delete image"
                                            icon={<DeleteIcon />}
                                            size="sm"
                                            colorScheme="red"
                                            position="absolute"
                                            top={1}
                                            right={1}
                                            onClick={() => handleDelete(log.id)}
                                        />
                                    </Box>
                                ))}
                            </SimpleGrid>
                            {logs.length >= 5 && (
                                <Text mt={2} color="red.500" fontWeight="bold" textAlign="center">
                                    อัปโหลดได้สูงสุด 5 รูปแล้ว
                                </Text>
                            )}
                        </Box>
                    )}
                </VStack>

                {/* Modal แสดงรูปใหญ่ */}
                <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
                    <ModalOverlay />
                    <ModalContent bg="transparent" boxShadow="none">
                        <ModalCloseButton color="white" zIndex={10} />
                        <ModalBody p={0}>
                            {selectedImage && (
                                <Image src={selectedImage} alt="Preview" width="100%" borderRadius="xl" />
                            )}
                        </ModalBody>
                    </ModalContent>
                </Modal>
            </Center>
        </StudentAppLayout>
    )
}

export default TakePicturePage
