import { Box, Button, Flex, Heading, Text, Stack, Image, VStack, SimpleGrid } from "@chakra-ui/react"
import Link from "next/link"

const LandingPage = () => {
    return (
        <Box>
            {/* Hero Section */}
            <Flex
                direction={{ base: "column", md: "row" }}
                align="center"
                justify="space-between"
                px={{ base: 6, md: 16 }}
                py={{ base: 12, md: 24 }}
                bgGradient="linear(to-br, blue.100, blue.300)"
            >
                <VStack align="start" spacing={6} maxW={{ base: "full", md: "50%" }}>
                    <Heading size="2xl">Welcome to KMUTT Passport System</Heading>
                    <Text fontSize="lg" color="gray.700">
                        ระบบลงทะเบียนและจัดการข้อมูลนักเรียนและเจ้าหน้าที่ สำหรับงานกิจกรรมและการใช้งานต่าง ๆ
                    </Text>
                    <Stack direction={{ base: "column", sm: "row" }} spacing={4}>
                        <Link href="/login">
                            <Button colorScheme="blue" size="lg">เข้าสู่ระบบ</Button>
                        </Link>
                        <Link href="/register">
                            <Button colorScheme="gray" size="lg" variant="outline">สมัครสมาชิก</Button>
                        </Link>
                    </Stack>
                </VStack>

                <Box mt={{ base: 10, md: 0 }} maxW={{ base: "full", md: "45%" }}>
                    <Image src="/hero-image.png" alt="Hero Image" rounded="2xl" shadow="lg" />
                </Box>
            </Flex>

            {/* Features Section */}
            <Box px={{ base: 6, md: 16 }} py={{ base: 12, md: 24 }} bg="white">
                <Heading textAlign="center" mb={12}>Features</Heading>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
                    <Box textAlign="center" p={6} rounded="xl" shadow="md" bg="blue.50">
                        <Heading size="md" mb={2}>Student Dashboard</Heading>
                        <Text>นักเรียนสามารถดูข้อมูลกิจกรรมและสถานะการเข้าร่วมได้ง่าย</Text>
                    </Box>
                    <Box textAlign="center" p={6} rounded="xl" shadow="md" bg="green.50">
                        <Heading size="md" mb={2}>Staff Management</Heading>
                        <Text>เจ้าหน้าที่สามารถจัดการข้อมูลผู้เข้าร่วมและรายงานได้สะดวก</Text>
                    </Box>
                    <Box textAlign="center" p={6} rounded="xl" shadow="md" bg="yellow.50">
                        <Heading size="md" mb={2}>Secure Access</Heading>
                        <Text>ระบบรักษาความปลอดภัยด้วยการ login และ role-based access control</Text>
                    </Box>
                </SimpleGrid>
            </Box>

            {/* Footer */}
            <Box bg="gray.100" py={6}>
                <Text textAlign="center" color="gray.600">
                    © 2025 KMUTT Passport System. All rights reserved.
                </Text>
            </Box>
        </Box>
    )
}

export { LandingPage }