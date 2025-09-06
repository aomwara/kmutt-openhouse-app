"use client"

import { useState } from "react"
import { useRouter } from "next/router"
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
} from "@chakra-ui/react"
import { UserPlus } from "lucide-react"

export function RegisterPage() {
    const [form, setForm] = useState<Record<string, string>>({})
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()

    const fields = [
        { name: "first_name", placeholder: "First Name" },
        { name: "last_name", placeholder: "Last Name" },
        { name: "school", placeholder: "School" },
        { name: "province", placeholder: "Province" },
        { name: "email", placeholder: "Email", type: "email" },
        { name: "phone", placeholder: "Phone", type: "tel" },
        { name: "password", placeholder: "Password", type: "password" },
    ]

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
                setError(data?.message || "Registration failed")
            }
        } catch {
            setError("Registration failed. Please try again.")
        }

        setIsLoading(false)
    }

    return (
        <Flex minH="100vh" align="center" justify="center" bgGradient="linear(to-br, blue.100, blue.300)" p={4}>
            <Box w="full" maxW="md" bg="white" rounded="2xl" shadow="xl" p={8}>
                {/* Header */}
                <Flex direction="column" align="center" mb={6}>
                    <Flex w={16} h={16} bg="blue.100" rounded="full" align="center" justify="center" mb={4}>
                        <Icon as={UserPlus} w={8} h={8} color="blue.600" />
                    </Flex>
                    <Heading size="lg" mb={1}>Student Registration</Heading>
                    <Text color="gray.600" fontSize="sm">กรอกข้อมูลเพื่อสมัครบัญชีผู้ใช้งาน</Text>
                </Flex>

                <form onSubmit={handleSubmit}>
                    <VStack spacing={4}>
                        {fields.map((field) => (
                            <FormControl key={field.name} id={field.name} isRequired>
                                <FormLabel>{field.placeholder}</FormLabel>
                                <Input
                                    type={field.type || "text"}
                                    value={form[field.name] || ""}
                                    onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                                />
                            </FormControl>
                        ))}

                        {error && (
                            <Alert status="error">
                                <AlertIcon />
                                {error}
                            </Alert>
                        )}

                        <Button
                            type="submit"
                            colorScheme="blue"
                            w="full"
                            mt={2}
                            isLoading={isLoading}
                        >
                            Register
                        </Button>
                    </VStack>
                </form>

                {/* Tips Section */}
                <Box mt={6} p={4} bg="blue.50" rounded="lg" textAlign="center" fontSize="sm" color="gray.700">
                    <Text>ใช้ข้อมูลจริงเพื่อการยืนยันตัวตน</Text>
                    <Text>หลังสมัครสมาชิกสามารถเข้าสู่ระบบผ่านหน้า Login</Text>
                </Box>

                {/* Login Link */}
                <Text textAlign="center" fontSize="sm" color="gray.600" mt={4}>
                    Already have an account?{" "}
                    <Text as="span" color="blue.600" fontWeight="medium" cursor="pointer" onClick={() => router.push("/login")}>
                        Login here
                    </Text>
                </Text>
            </Box>
        </Flex>
    )
}
