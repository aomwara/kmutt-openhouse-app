"use client"

import { useEffect, useState } from "react"
import StudentAppLayout from "@/views/layouts/StudentAppLayout"
import {
    Box,
    Flex,
    Heading,
    Text,
    Spinner,
    Input,
    Button,
    VStack,
    useColorModeValue,
    FormControl,
    FormLabel,
    useToast,
    Stack,
} from "@chakra-ui/react"
import Head from "next/head";


type StudentProfile = {
    citizen_id?: string;
    passport_id?: string;
    first_name: string;
    last_name: string;
    school?: string;
    province?: string;
    email: string;
    phone: string;
};
const StudentProfilePage = () => {


    const [profile, setProfile] = useState<StudentProfile | null>(null);
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const toast = useToast()
    const textColor = useColorModeValue("gray.800", "gray.100")
    const bgColor = useColorModeValue("white", "gray.700");

    useEffect(() => {
        fetch("/api/student/profile")
            .then((res) => res.json())
            .then((data) => setProfile(data))
            .finally(() => setLoading(false))
    }, [])

    const handleChange = (field: keyof StudentProfile, value: string) => {
        if (!profile) return
        setProfile({ ...profile, [field]: value })
    }

    const handleSave = async () => {
        if (!profile) return
        setSaving(true)
        try {
            const res = await fetch("/api/student/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(profile),
            })
            if (!res.ok) throw new Error("Failed to update profile")
            toast({ title: "บันทึกสำเร็จ", status: "success", duration: 3000, isClosable: true })
        } catch (err: unknown) {
            if (err instanceof Error) {
                toast({
                    title: "เกิดข้อผิดพลาด",
                    description: err.message,
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                toast({
                    title: "เกิดข้อผิดพลาด",
                    description: "Unknown error occurred",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            }
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <StudentAppLayout navigation="Edit Profile">
                <Flex justify="center" align="center" minH="60vh">
                    <Spinner size="xl" />
                </Flex>
            </StudentAppLayout>
        )
    }

    if (!profile) {
        return (
            <StudentAppLayout navigation="Edit Profile">
                <Text color="red.500">ไม่พบข้อมูลนักเรียน</Text>
            </StudentAppLayout>
        )


    }

    return (
        <StudentAppLayout navigation="แก้ไขข้อมูล">
            <Head>
                <title>Openhouse / Profile</title>
            </Head>
            <Box maxW="full" mx="auto" bg={bgColor} rounded="xl" >
                <Stack spacing={4}>
                    {/* Citizen ID */}
                    <Text fontWeight="bold" fontSize="sm">หมายเลขประจำตัวประชาชน</Text>
                    <Input
                        value={profile.citizen_id || ""}
                        onChange={(e) => handleChange("citizen_id", e.target.value)}
                        placeholder="ระบุหมายเลขประจำตัวประชาชน"
                    />

                    {/* Passport ID */}
                    <Text fontWeight="bold" fontSize="sm">Passport ID</Text>
                    <Input
                        value={profile.passport_id || ""}
                        onChange={(e) => handleChange("passport_id", e.target.value)}
                        placeholder="ระบุ Passport ID"
                    />

                    {/* First Name */}
                    <Text fontWeight="bold" fontSize="sm">ชื่อ</Text>
                    <Input
                        value={profile.first_name}
                        onChange={(e) => handleChange("first_name", e.target.value)}
                        placeholder="ระบุชื่อ"
                        isRequired
                    />

                    {/* Last Name */}
                    <Text fontWeight="bold" fontSize="sm">นามสกุล</Text>
                    <Input
                        value={profile.last_name}
                        onChange={(e) => handleChange("last_name", e.target.value)}
                        placeholder="ระบุนามสกุล"
                        isRequired
                    />

                    {/* School */}
                    <Text fontWeight="bold" fontSize="sm">โรงเรียน</Text>
                    <Input
                        value={profile.school || ""}
                        onChange={(e) => handleChange("school", e.target.value)}
                        placeholder="ระบุโรงเรียน"
                    />

                    {/* Province */}
                    <Text fontWeight="bold" fontSize="sm">จังหวัด</Text>
                    <Input
                        value={profile.province || ""}
                        onChange={(e) => handleChange("province", e.target.value)}
                        placeholder="ระบุจังหวัด"
                    />

                    {/* Email */}
                    <Text fontWeight="bold" fontSize="sm">Email</Text>
                    <Input value={profile.email} isReadOnly />

                    {/* Phone */}
                    <Text fontWeight="bold" fontSize="sm">เบอร์โทร</Text>
                    <Input
                        value={profile.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        placeholder="ระบุเบอร์โทร"
                        isRequired
                    />

                    <Button colorScheme="orange" onClick={handleSave} isLoading={saving}>
                        บันทึกข้อมูล
                    </Button>
                </Stack>
            </Box>


        </StudentAppLayout>
    )
}

export { StudentProfilePage }
