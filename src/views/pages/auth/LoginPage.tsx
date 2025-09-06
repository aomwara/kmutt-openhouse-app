import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { signIn } from "next-auth/react"
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Alert,
    AlertIcon,
    Heading,
    Text,
    VStack,
    Center,
} from "@chakra-ui/react"
import { ArrowBackIcon, InfoIcon } from "@chakra-ui/icons"

const LoginPage = () => {
    const [emailOrUsername, setEmailOrUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        const res = await signIn("credentials", {
            redirect: false,
            emailOrUsername,
            password,
        })

        if (res?.error) {
            setError("❌ Login failed: " + res.error)
            setIsLoading(false)
            return
        }

        const sessionRes = await fetch("/api/auth/session")
        const session = await sessionRes.json()

        if (session?.user?.role === "student") {
            router.push("/app/dashboard")
        } else if (session?.user?.role === "staff") {
            router.push("/staff/dashboard")
        } else {
            router.push("/")
        }

        setIsLoading(false)
    }

    return (
        <Center minH="100vh" bgGradient="linear(to-br, blue.100, blue.300)" p={4}>
            <VStack spacing={6} w="full" maxW="md">
                {/* Back Button */}
                <Link href="/">
                    <Button leftIcon={<ArrowBackIcon />} variant="link" colorScheme="gray">
                        กลับหน้าหลัก
                    </Button>
                </Link>

                {/* Login Card */}
                <Box bg="white" p={8} rounded="2xl" shadow="xl" w="full">
                    <VStack spacing={4} align="stretch">
                        <Center mb={4}>
                            <InfoIcon w={10} h={10} color="blue.500" />
                        </Center>
                        <Heading textAlign="center" size="lg">เข้าสู่ระบบ</Heading>
                        <Text textAlign="center" color="gray.600">
                            กรอกอีเมล/Username และรหัสผ่านเพื่อเข้าสู่ระบบ
                        </Text>

                        <form onSubmit={handleSubmit}>
                            <VStack spacing={4} align="stretch">
                                <FormControl id="emailOrUsername" isRequired>
                                    <FormLabel>Email (Student) หรือ Username (Staff)</FormLabel>
                                    <Input
                                        type="text"
                                        value={emailOrUsername}
                                        onChange={(e) => setEmailOrUsername(e.target.value)}
                                        placeholder="Email หรือ Username"
                                    />
                                </FormControl>

                                <FormControl id="password" isRequired>
                                    <FormLabel>รหัสผ่าน</FormLabel>
                                    <Input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="รหัสผ่าน"
                                    />
                                </FormControl>

                                {error && (
                                    <Alert status="error">
                                        <AlertIcon />
                                        {error}
                                    </Alert>
                                )}

                                <Button type="submit" colorScheme="blue" w="full" isLoading={isLoading}>
                                    {isLoading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
                                </Button>
                            </VStack>
                        </form>

                        <Text textAlign="center" fontSize="sm" color="gray.600" mt={2}>
                            ไม่มีบัญชี?{" "}
                            <Link href="/register">
                                <Text as="span" color="blue.500" fontWeight="medium" cursor="pointer">
                                    สมัครสมาชิก
                                </Text>
                            </Link>
                        </Text>
                    </VStack>
                </Box>
            </VStack>
        </Center>
    )
}

export { LoginPage };