"use client"

import { useEffect, useState } from "react"
import {
    Flex,
    Text,
    Box,
    useColorModeValue,
    Divider,
    VStack,
    HStack,
    Badge,
    Button,
    IconButton,
    Input,
} from "@chakra-ui/react"

import { useRouter } from "next/router"
import StaffAppLayout from "@/views/layouts/StaffAppLayout"
import { StaffProfile } from "@/interfaces/KMProfile"
import StaffProfileCard from "@/components/ProfileCard/StaffProfileCard"
import StaffLayout from "@/views/layouts/StaffLayout"

const ITEMS_PER_PAGE = 5

const StaffDashboard = () => {
    const router = useRouter()
    const cardBg = useColorModeValue("white", "gray.700")
    const textColor = useColorModeValue("gray.800", "gray.100")
    const [data, setData] = useState<StaffProfile | null>(null)

    useEffect(() => {
        fetch("/api/staff/profile")
            .then((res) => res.json())
            .then((d) => setData(d))

    }, [])

    if (!data) {
        return (
            <StaffLayout>
                <Flex justify="center" align="center" minH="60vh">
                    <Text>กำลังโหลดข้อมูล Staff Account...</Text>
                </Flex>
            </StaffLayout>
        )
    }

    return (
        <StaffAppLayout navigation="Dashboard">
            <Box>
                <StaffProfileCard data={data} />
                <Divider mt="-1" mb={6} />

                Staff Dashboard
            </Box>
        </StaffAppLayout>
    )
}

export { StaffDashboard }
