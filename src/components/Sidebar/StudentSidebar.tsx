import {
    Box,
    VStack,
    Button,
    HStack,
    Text,
    useColorModeValue,
} from "@chakra-ui/react"
import { label } from "framer-motion/client"
import {
    MdDashboard,
    MdQrCode,
    MdPerson,
    MdSettings,
} from "react-icons/md"
import { RiProfileFill } from "react-icons/ri";

import { GrWorkshop } from "react-icons/gr";

const StudentSidebar = () => {
    const PRIMARY = "#F04E23"
    const bgColor = useColorModeValue("white", "gray.700")
    const hoverBg = useColorModeValue("gray.200", "gray.700")
    const textColor = useColorModeValue("gray.800", "gray.100")

    const menuItems = [
        { label: "Dashboard", icon: MdDashboard },
        // { label: "QR Code", icon: MdQrCode },
        { label: "โปรไฟล์", icon: RiProfileFill },
        { label: "ลงทะเบียนกิจกรรม", icon: GrWorkshop },
        // { label: "Profile", icon: MdPerson },
        // { label: "Settings", icon: MdSettings },
    ]

    return (
        <Box
            bg={bgColor}
            w="250px"
            p={5}
            rounded="2xl"
            h="fit-content"
            shadow="md"
            flexShrink={0}
        >
            <VStack align="stretch" spacing={3}>
                {menuItems.map((item) => (
                    <Button
                        key={item.label}
                        variant="ghost"
                        justifyContent="start"
                        _hover={{ bg: hoverBg }}
                        leftIcon={<item.icon />}
                        color={textColor}
                        fontWeight="medium"
                        size="md"
                        rounded="lg"
                    >
                        {item.label}
                    </Button>
                ))}
            </VStack>
        </Box>
    )
}

export default StudentSidebar
