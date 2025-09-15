import { useState } from "react";
import { Box, Image, Text, useColorModeValue, Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton, useDisclosure } from "@chakra-ui/react";

const PRIMARY = "#F04E23"; // KMUTT Orange Red
const SECONDARY = "#FFC233"; // KMUTT Yellow

const MapSection = () => {
    const text = useColorModeValue("gray.800", "gray.200");
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <Box id="map" position="relative" overflow="hidden" py={{ base: 10, md: 16 }} px={{ base: 4, md: 12 }}>
            {/* Background Circles + Gradient */}
            <Box position="absolute" inset="0" zIndex={0} overflow="hidden">
                <svg width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0 }}>
                    <defs>
                        <radialGradient id="grad1" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor={PRIMARY} stopOpacity={0.15} />
                            <stop offset="100%" stopColor={PRIMARY} stopOpacity={0} />
                        </radialGradient>
                        <radialGradient id="grad2" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor={SECONDARY} stopOpacity={0.15} />
                            <stop offset="100%" stopColor={SECONDARY} stopOpacity={0} />
                        </radialGradient>
                    </defs>
                    <circle cx="25%" cy="25%" r="300" fill="url(#grad1)" />
                    <circle cx="75%" cy="70%" r="250" fill="url(#grad2)" />
                    <circle cx="50%" cy="50%" r="200" fill={`${PRIMARY}10`} />
                    <circle cx="60%" cy="20%" r="150" fill={`${SECONDARY}15`} />
                </svg>
            </Box>

            {/* Content */}
            <Box position="relative" zIndex={1} textAlign="center">
                <Text fontSize={{ base: "2xl", md: "4xl" }} fontWeight="bold" mb={4} color={PRIMARY}>
                    แผนที่มหาวิทยาลัย
                </Text>

                <Text fontSize={{ base: "md", md: "lg" }} mb={8} maxW="800px" mx="auto" color={text}>
                    ดูตำแหน่งคณะและหน่วยงานบริการต่างๆ ของ มจธ. แบบง่ายๆ บนแผนที่นี้
                </Text>

                <Box
                    maxW={{ base: "100%", md: "800px" }}
                    mx="auto"
                    borderRadius="md"
                    overflow="hidden"
                    boxShadow="lg"
                    cursor="pointer"
                    onClick={onOpen}
                >
                    <Image
                        src="/images/map.jpg"
                        alt="แผนที่มหาวิทยาลัย"
                        objectFit="contain"
                        width="100%"
                        height={{ base: "250px", md: "450px" }}
                    />
                </Box>

                {/* Modal สำหรับ popup */}
                <Modal isOpen={isOpen} onClose={onClose} size="full" isCentered>
                    <ModalOverlay bg="blackAlpha.800" />
                    <ModalContent bg="transparent" boxShadow="none">
                        <ModalCloseButton color="white" zIndex={10} />
                        <ModalBody display="flex" justifyContent="center" alignItems="center" p={0}>
                            <Image
                                src="/images/map.jpg"
                                alt="แผนที่มหาวิทยาลัย"
                                maxH="90vh"
                                maxW="90vw"
                                objectFit="contain"
                                borderRadius="md"
                            />
                        </ModalBody>
                    </ModalContent>
                </Modal>
            </Box>
        </Box>
    );
};

export default MapSection;
