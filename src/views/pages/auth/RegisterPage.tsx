"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
    Box,
    Button,
    Input,
    FormControl,
    FormLabel,
    VStack,
    Heading,
    Text,
    Alert,
    AlertIcon,
    Flex,
    Icon,
    SimpleGrid,
    useColorModeValue,
} from "@chakra-ui/react"
import { UserPlus } from "lucide-react"

// KMUTT Colors
const PRIMARY = "#F04E23"
const SECONDARY = "#FFC233"

export function RegisterPage() {
    const [form, setForm] = useState<Record<string, string>>({})
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            })

            if (res.ok) {
                router.push("/login")
            } else {
                const data = await res.json()
                setError(data?.message || "การสมัครสมาชิกไม่สำเร็จ")
            }
        } catch {
            setError("เกิดข้อผิดพลาด กรุณาลองใหม่")
        }

        setIsLoading(false)
    }

    const cardBg = useColorModeValue("white", "gray.800")
    const textColor = useColorModeValue("gray.600", "gray.300")

    return (
        <Flex
            minH="100vh"
            align="center"
            justify="center"
            bgGradient={`linear(to-br, ${SECONDARY}50, ${PRIMARY}80)`}
            p={4}
        >

            <Box
                w="full"
                maxW="lg"
                bg={cardBg}
                rounded="2xl"
                shadow="xl"
                p={10}
                border="1px solid"
                borderColor={useColorModeValue("orange.100", "gray.700")}
            >
                {/* Header */}
                <Flex direction="column" align="center" mb={6}>
                    <Flex
                        w={16}
                        h={16}
                        bg={useColorModeValue("orange.50", "gray.700")}
                        rounded="full"
                        align="center"
                        justify="center"
                        mb={4}
                    >
                        <Icon as={UserPlus} w={8} h={8} color={PRIMARY} />
                    </Flex>
                    <Heading size="lg" mb={1} color={PRIMARY}>
                        สมัครสมาชิก
                    </Heading>
                    <Text color={textColor} fontSize="sm">
                        กรอกข้อมูลจริงเพื่อสมัครบัญชีผู้ใช้งาน
                    </Text>
                </Flex>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <VStack spacing={5}>
                        {/* สองคอลัมน์ */}
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
                            <FormControl id="first_name" isRequired>
                                <FormLabel>ชื่อจริง</FormLabel>
                                <Input
                                    type="text"
                                    value={form.first_name || ""}
                                    onChange={(e) =>
                                        setForm({ ...form, first_name: e.target.value })
                                    }
                                    placeholder="ชื่อจริง"
                                />
                            </FormControl>

                            <FormControl id="last_name" isRequired>
                                <FormLabel>นามสกุล</FormLabel>
                                <Input
                                    type="text"
                                    value={form.last_name || ""}
                                    onChange={(e) =>
                                        setForm({ ...form, last_name: e.target.value })
                                    }
                                    placeholder="นามสกุล"
                                />
                            </FormControl>

                            <FormControl id="school" isRequired>
                                <FormLabel>โรงเรียน</FormLabel>
                                <Input
                                    type="text"
                                    value={form.school || ""}
                                    onChange={(e) =>
                                        setForm({ ...form, school: e.target.value })
                                    }
                                    placeholder="โรงเรียน"
                                />
                            </FormControl>

                            <FormControl id="province" isRequired>
                                <FormLabel>จังหวัด</FormLabel>
                                <Input
                                    type="text"
                                    value={form.province || ""}
                                    onChange={(e) =>
                                        setForm({ ...form, province: e.target.value })
                                    }
                                    placeholder="จังหวัด"
                                />
                            </FormControl>
                        </SimpleGrid>

                        {/* เต็มบรรทัด */}
                        <FormControl id="email" isRequired>
                            <FormLabel>อีเมล</FormLabel>
                            <Input
                                type="email"
                                value={form.email || ""}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                placeholder="example@email.com"
                            />
                        </FormControl>

                        <FormControl id="phone" isRequired>
                            <FormLabel>เบอร์โทรศัพท์</FormLabel>
                            <Input
                                type="tel"
                                value={form.phone || ""}
                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                placeholder="0812345678"
                            />
                        </FormControl>

                        <FormControl id="password" isRequired>
                            <FormLabel>รหัสผ่าน</FormLabel>
                            <Input
                                type="password"
                                value={form.password || ""}
                                onChange={(e) =>
                                    setForm({ ...form, password: e.target.value })
                                }
                                placeholder="••••••••"
                            />
                        </FormControl>

                        {error && (
                            <Alert status="error" rounded="md">
                                <AlertIcon />
                                {error}
                            </Alert>
                        )}

                        <Button
                            type="submit"
                            bg={PRIMARY}
                            color="white"
                            _hover={{ bg: "#d63e1a" }}
                            w="full"
                            mt={2}
                            isLoading={isLoading}
                            rounded="xl"
                        >
                            สมัครสมาชิก
                        </Button>
                    </VStack>
                </form>

                {/* Tips */}
                <Box
                    mt={6}
                    p={4}
                    bg={useColorModeValue("orange.50", "gray.700")}
                    rounded="lg"
                    textAlign="center"
                    fontSize="sm"
                    color={textColor}
                >
                    <Text>กรุณาใช้ข้อมูลจริงเพื่อการยืนยันตัวตน</Text>
                    <Text>หลังสมัครสมาชิกสามารถเข้าสู่ระบบผ่านหน้า Login</Text>
                </Box>

                {/* Login Link */}
                <Text textAlign="center" fontSize="sm" color={textColor} mt={4}>
                    มีบัญชีแล้ว?{" "}
                    <Text
                        as="span"
                        color={PRIMARY}
                        fontWeight="semibold"
                        cursor="pointer"
                        onClick={() => router.push("/login")}
                    >
                        เข้าสู่ระบบ
                    </Text>
                </Text>
            </Box>
        </Flex>
    )
}
