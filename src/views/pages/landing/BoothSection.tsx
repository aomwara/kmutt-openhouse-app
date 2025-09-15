import { Box, Heading, SimpleGrid, Text, VStack, Stack, Badge, useColorModeValue } from "@chakra-ui/react";

const PRIMARY = "#F04E23"; // KMUTT Orange Red
const SECONDARY = "#FFC233"; // KMUTT Yellow

const BoothSection = () => {
    const bgSection = useColorModeValue("gray.50", "gray.800");
    const bgCard = useColorModeValue("white", "gray.700");
    const textColor = useColorModeValue("gray.700", "gray.200");
    const badgeBg = useColorModeValue(SECONDARY, PRIMARY);
    const badgeText = useColorModeValue("black", "white");

    const boothData = [
        {
            location: "A1 – อาคารการเรียนรู้พหุวิทยาการ (N16) ชั้น 1",
            units: ["คณะเทคโนโลยีสารสนเทศ", "คณะวิทยาศาสตร์", "สถาบันหุ่นยนต์ภาคสนาม"],
        },
        {
            location: "A1 – อาคารการเรียนรู้พหุวิทยาการ (N16) ชั้น 3",
            units: [
                "คณะศิลปศาสตร์",
                "คณะทรัพยากรชีวภาพและเทคโนโลยี",
                "คณะพลังงานสิ่งแวดล้อมและวัสดุ",
                "บัณฑิตวิทยาลัยการจัดการและนวัตกรรม (GMI)",
                "บัณฑิตวิทยาลัยร่วมด้านพลังงานและสิ่งแวดล้อม (JGSEE)",
                "คณะวิศวกรรมศาสตร์",
                "คณะครุศาสตร์อุตสาหกรรมและเทคโนโลยี",
                "คณะวิทยาศาสตร์",
                "คณะเทคโนโลยีสารสนเทศ",
                "คณะสถาปัตยกรรมศาสตร์และการออกแบบ",
                "สถาบันวิทยาการหุ่นยนต์ภาคสนาม",
                "สำนักงานกิจการต่างประเทศ",
                "KMUTTWORKS",
                "สำนักงานคัดเลือกและสรรหานักศึกษา",
                "กลุ่มงานช่วยเหลือทางการเงินแก่นักศึกษา",
                "ชมรมติว"

            ],
        },
        {
            location: "A3 – อาคารเรียนรวม 2 (CB 2)",
            units: ["บูธแนะนำกิจกรรมและชมรมของนักศึกษา"],
        },
        {
            location: "A4 – คณะศิลปศาสตร์ (N15)",
            units: [
                "คณะศิลปศาสตร์ (GCDC-GEN)",
                "คณะสถาปัตยกรรมศาสตร์และการออกแบบ",
                "โครงการร่วมบริหารหลักสูตรมีเดียและเทคโนโลยี",
                "มจธ. ราชบุรี",
            ],
        },
        {
            location: "A5 – อาคารสำนักหอสมุด (N10)",
            units: ["บูธกิจกรรมสำนักหอสมุด", "คณะวิศวกรรมศาสตร์", "คณะครุศาสตร์อุตสาหกรรมและเทคโนโลยี"],
        },
    ];

    return (
        <Box as="section" id="booth" py={{ base: 8, md: 12 }} px={{ base: 4, md: 8 }} bg={bgSection}>
            <VStack spacing={3} mb={10} textAlign="center">
                <Heading size="xl" color={PRIMARY} lineHeight="short">
                    บูธแนะนำหลักสูตร & หน่วยงาน
                </Heading>
                <Text fontSize={{ base: "sm", md: "md" }} color={textColor} maxW="700px">
                    พบกับข้อมูลหลักสูตร ปริญญาตรี-โท-เอก แนะนำทุนการศึกษา และกิจกรรม Portfolio Clinic
                </Text>
                <Badge bg={badgeBg} color={badgeText} px={4} py={1} fontSize="0.9rem">
                    วันที่ 10 – 12 ตุลาคม 2568 | 08:30 – 16:30 น.
                </Badge>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {boothData.map((booth, index) => (
                    <Box
                        key={index}
                        p={{ base: 4, md: 6 }}
                        bg={bgCard}
                        borderRadius="lg"
                        borderLeft={`6px solid ${PRIMARY}`}
                        shadow="sm"
                        _hover={{ shadow: "md", transform: "translateY(-2px)", transition: "0.2s" }}
                    >
                        <Heading size="md" mb={3} color={PRIMARY} lineHeight="short">
                            {booth.location}
                        </Heading>
                        <Stack spacing={1.5}>
                            {booth.units.map((unit, i) => (
                                <Text key={i} fontSize={{ base: "sm", md: "sm" }} color={textColor}>
                                    • {unit}
                                </Text>
                            ))}
                        </Stack>
                    </Box>
                ))}
            </SimpleGrid>
        </Box>
    );
};

export default BoothSection;
