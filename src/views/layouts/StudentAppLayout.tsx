import { Box, Container, Divider, Flex, Text, useBreakpointValue, useColorModeValue } from "@chakra-ui/react";
import KMLayout from "./KMLayout";
import { ReactNode } from "react"
import StudentSidebar from "@/components/Sidebar/StudentSidebar";
import StudentLayout from "./StudentLayout";
type StudentLayoutProps = {
    children: ReactNode;
    navigation?: string
}

export default function StudentAppLayout({ children, navigation }: StudentLayoutProps) {
    const showSidebar = useBreakpointValue({ base: false, md: true })
    const cardBg = useColorModeValue("white", "gray.700")

    return (
        <StudentLayout>
            <Container maxW="7xl" px={4} py={6} mt="-10">
                <Flex direction={{ base: "column", md: "row" }} gap={6}>
                    {/* Sidebar */}
                    {showSidebar && <StudentSidebar />}

                    <Flex direction="column" flex="1" gap={6}>
                        <Box
                            bg={cardBg}
                            p={6}
                            rounded="2xl"
                            shadow="lg"
                            flex="1"
                        >
                            <Text fontSize="lg" fontWeight="bold" mb={4}>
                                Openhouse / {navigation}
                            </Text>
                            <Divider mt="-1" mb={6} />

                            {children}
                        </Box>
                    </Flex>
                </Flex>
            </Container>
        </StudentLayout>
    )
}

