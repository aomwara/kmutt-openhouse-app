import {
    Box,
    Tabs,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Text,
    Heading,
    VStack,
} from "@chakra-ui/react";
import TenOctTable from "./Tables/TenOctTable";
import ElevenOctTable from "./Tables/ElevenOctTable";
import TweleveOctTable from "./Tables/TwelveOctTable";

const ScheduleSection = () => {
    return (
        <Box as="section" id="schedule" py={20} px={6} maxW="7xl" mx="auto">
            <VStack spacing={6} textAlign="center" mb={{ base: 7, md: 10 }}>
                <Heading size="lg" mb={-5} color="#F04E23">
                    กำหนดการกิจกรรม
                </Heading>
                <Heading size={{ base: "sm", md: "md" }} color="gray.500">
                    เส้นทางค้นพบแรงบันดาลใจและกิจกรรมหลากหลาย ตลอดวัน
                </Heading>
            </VStack>

            <Tabs variant="enclosed" colorScheme="orange" isFitted>
                <TabList>
                    <Tab>

                        <Text display={{ base: "inline", md: "none" }}>10 ต.ค.</Text>
                        <Text display={{ base: "none", md: "inline" }}>10 ตุลาคม 2568</Text>

                    </Tab>
                    <Tab>

                        <Text display={{ base: "inline", md: "none" }}>11 ต.ค.</Text>
                        <Text display={{ base: "none", md: "inline" }}>11 ตุลาคม 2568</Text>

                    </Tab>
                    <Tab>

                        <Text display={{ base: "inline", md: "none" }}>12 ต.ค.</Text>
                        <Text display={{ base: "none", md: "inline" }}>12 ตุลาคม 2568</Text>
                    </Tab>
                </TabList>

                <TabPanels>
                    {/* ---------------- วันที่ 10 ---------------- */}
                    <TabPanel>
                        <TenOctTable />
                    </TabPanel>


                    {/* ---------------- วันที่ 11 ---------------- */}
                    <TabPanel>
                        <ElevenOctTable />
                    </TabPanel>

                    {/* ---------------- วันที่ 12 ---------------- */}
                    <TabPanel>
                        <TweleveOctTable />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    );
};

export { ScheduleSection };
