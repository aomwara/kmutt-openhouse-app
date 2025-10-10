"use client"

import { useEffect, useState } from "react"
import {
    Box,
    VStack,
    HStack,
    Input,
    Button,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    useToast,
    Spinner,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    useDisclosure,
    Text,
    TableContainer,
} from "@chakra-ui/react"
import StaffAppLayout from "@/views/layouts/StaffAppLayout"
import { SettingsIcon } from "@chakra-ui/icons"

type Student = {
    id: string
    first_name: string
    last_name: string
    email: string
}

const StudentSetting = () => {
    const toast = useToast()
    const [search, setSearch] = useState("")
    const [students, setStudents] = useState<Student[]>([])
    const [loading, setLoading] = useState(false)
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
    const [newPassword, setNewPassword] = useState("")
    const [saving, setSaving] = useState(false)

    const { isOpen, onOpen, onClose } = useDisclosure()

    const handleSearch = async () => {
        if (!search.trim()) return
        setLoading(true)
        try {
            const res = await fetch(`/api/staff/search-students?query=${encodeURIComponent(search)}`)
            const data = await res.json()
            setStudents(data.students ?? [])
        } catch (err) {
            toast({ title: "เกิดข้อผิดพลาดในการค้นหา", status: "error" })
        } finally {
            setLoading(false)
        }
    }

    const handleResetClick = (student: Student) => {
        setSelectedStudent(student)
        setNewPassword("")
        onOpen()
    }

    const handleSave = async () => {
        if (!newPassword.trim()) {
            toast({ title: "กรุณากรอกรหัสผ่านใหม่", status: "warning" })
            return
        }

        setSaving(true)
        try {
            const res = await fetch("/api/staff/reset-student-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ studentId: selectedStudent?.id, newPassword }),
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || "ไม่สามารถรีเซ็ตรหัสผ่านได้")
            }

            toast({ title: "รีเซ็ตรหัสผ่านสำเร็จ", status: "success" })
            onClose()
        } catch (err: unknown) {
            toast({ title: (err as Error).message, status: "error" })
        } finally {
            setSaving(false)
        }
    }

    return (
        <StaffAppLayout navigation="ตั้งค่ารหัสผ่านนักเรียน">
            <Box p={4}>
                <VStack align="stretch" spacing={4}>
                    <HStack>
                        <Input
                            placeholder="ค้นหาอีเมลนักเรียน เช่น student@kmutt.ac.th"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            bg="white"
                        />
                        <Button colorScheme="orange" onClick={handleSearch}>
                            ค้นหา
                        </Button>
                    </HStack>

                    {loading ? (
                        <Spinner alignSelf="center" />
                    ) : students.length === 0 ? (
                        <Text textAlign="center" color="gray.500">
                            🔍 ยังไม่มีผลลัพธ์การค้นหา
                        </Text>
                    ) : (
                        <Box overflowX="auto">
                            <TableContainer>
                                <Table variant="simple">
                                    <Thead bg="orange.50">
                                        <Tr>
                                            <Th textAlign="right">จัดการ</Th>
                                            <Th>ชื่อ</Th>
                                            <Th>อีเมล</Th>

                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {students.map((student) => (
                                            <Tr key={student.id}>
                                                <Td textAlign="right">
                                                    <Button
                                                        size="sm"
                                                        colorScheme="orange"
                                                        onClick={() => handleResetClick(student)}
                                                    >
                                                        <SettingsIcon mr={1} />
                                                    </Button>
                                                </Td>
                                                <Td fontSize={"md"}>{student.first_name} {student.last_name}</Td>
                                                <Td fontSize={"md"}>{student.email}</Td>

                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        </Box>
                    )}
                </VStack>

                {/* Modal ตั้งรหัสผ่านใหม่ */}
                <Modal isOpen={isOpen} onClose={onClose} isCentered>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>รีเซ็ตรหัสผ่าน</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Text fontSize={"md"} mb={2}>สำหรับ {selectedStudent?.first_name} {selectedStudent?.last_name}</Text>
                            <Input
                                placeholder="กรอกรหัสผ่านใหม่"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="ghost" mr={3} onClick={onClose}>
                                ยกเลิก
                            </Button>
                            <Button
                                colorScheme="orange"
                                onClick={handleSave}
                                isLoading={saving}
                            >
                                บันทึก
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </Box>
        </StaffAppLayout>
    )
}

export default StudentSetting
