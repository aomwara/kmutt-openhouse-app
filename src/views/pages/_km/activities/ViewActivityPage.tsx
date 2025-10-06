import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
    Box,
    Text,
    Spinner,
    Badge,
    HStack,
    Divider,
    Button,
    Input,
    Textarea,
    NumberInput,
    NumberInputField,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    FormControl,
    FormLabel,
    VStack,
} from "@chakra-ui/react";

import {
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
} from "@chakra-ui/react"

import * as XLSX from "xlsx";
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
} from "@chakra-ui/react"
import KMAppLayout from "@/views/layouts/KMAppLayout";

import { Activity } from "@/interfaces/Activities";

export const ViewActivityPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const [activity, setActivity] = useState<Activity | null>(null);
    const [loading, setLoading] = useState(true);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [form, setForm] = useState<Partial<Activity>>({});

    useEffect(() => {
        if (!id) return;

        const fetchActivity = async () => {
            try {
                const res = await fetch(`/api/km/activities/${id}`);
                const data = await res.json();
                if (res.status === 200) {
                    setActivity(data);
                    setForm(data);
                } else {
                    setActivity(null);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchActivity();
    }, [id]);

    const handleSave = async () => {
        if (!id) return;
        try {
            const res = await fetch(`/api/km/activities/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                const updated = await res.json();
                setActivity(updated);
                setForm(updated);
                onClose();
            }
        } catch (err) {
            console.error(err);
        }
    };



    const exportExcel = () => {
        if (!activity?.registrations) return;

        const wb = XLSX.utils.book_new();

        // --- ข้อมูลกิจกรรม ---
        const activityInfo = [
            { Key: "ชื่อกิจกรรม", Value: activity.title },
            { Key: "รายละเอียด", Value: activity.description },
            { Key: "วันที่", Value: activity.date },
            { Key: "เวลาเริ่ม", Value: activity.start_time },
            { Key: "เวลาสิ้นสุด", Value: activity.end_time },
            { Key: "สถานที่", Value: activity.location },
            { Key: "คะแนน", Value: activity.point },
            { Key: "จำนวนผู้ลงทะเบียนสูงสุด", Value: activity.max_participants },
        ];

        // แปลง activityInfo เป็น sheet (row เดียวแต่ 2 คอลัมน์: Key / Value)
        const wsActivity = XLSX.utils.json_to_sheet(activityInfo, { header: ["Key", "Value"] });

        // --- ข้อมูลนักเรียน ---
        const studentRows = activity.registrations.map((reg) => ({
            "ชื่อ-สกุล": `${reg.student.first_name} ${reg.student.last_name}`,
            Email: reg.student.email,
            เบอร์โทร: reg.student.phone,
            "เวลาลงทะเบียน": new Date(reg.registered_at).toLocaleString("th-TH"),
        }));

        // เพิ่ม row ว่างก่อนนักเรียนเพื่อแยก
        XLSX.utils.sheet_add_aoa(wsActivity, [[""]], { origin: -1 });

        // เพิ่ม header นักเรียน
        XLSX.utils.sheet_add_aoa(
            wsActivity,
            [["ชื่อ-สกุล", "Email", "เบอร์โทร", "เวลาลงทะเบียน"]],
            { origin: -1 }
        );

        // เพิ่มข้อมูลนักเรียน
        XLSX.utils.sheet_add_json(wsActivity, studentRows, { skipHeader: true, origin: -1 });

        XLSX.utils.book_append_sheet(wb, wsActivity, "Registrations");
        XLSX.writeFile(wb, `${activity.title}-registrations.xlsx`);
    };


    return (
        <KMAppLayout navigation={`Activity / ${id}`}>
            {loading ? (
                <HStack justify="center" py={10}>
                    <Spinner size="xl" />
                </HStack>
            ) : !activity ? (
                <Text color="red.500" fontSize={"lg"}>Activity not found</Text>
            ) : (
                <>
                    <Box
                        p={4}
                        bg="white"
                        _dark={{ bg: "gray.700" }}
                        rounded="xl"
                        shadow="sm"
                    >
                        <Badge display={!activity.display ? "block" : "none"} colorScheme={activity.display ? "blue" : "red"} p={4} mb={2} w={"full"} fontSize={"md"}>
                            {activity.display ? "แสดง" : "กิจกรรมนี้ถูกซ่อนอยู่ (ไม่แสดงในหน้ากิจกรรม)"}
                        </Badge>
                        {/* Title + Edit Button */}
                        <HStack justify="space-between" mb={2}>
                            <Text fontSize="md" fontWeight="bold">
                                #{activity.id} - {activity.title}
                            </Text>
                            <Box>
                                <Button size="sm" colorScheme="yellow" onClick={onOpen}>
                                    แก้ไข
                                </Button>

                                {/* <Button ml={2} size="sm" colorScheme="red" onClick={() => { }}>
                                    ลบ
                                </Button> */}
                            </Box>
                        </HStack>

                        {/* Description */}
                        <Text fontSize="md" color="gray.600" _dark={{ color: "gray.300" }} mb={2}>
                            {activity.description}
                        </Text>

                        <Text fontSize="md" color="gray.500" mb={0}>
                            สถานที่: {activity.location} | คณะ: {activity.faculty?.name_th} -{" "}
                            ภาควิชา: {activity.department?.name_th}
                        </Text>

                        <Text fontSize="md" color="gray.500" mb={0}>
                            วันที่: {activity.date} | เวลา: {activity.start_time} - {activity.end_time}
                        </Text>

                        <HStack mt={0} spacing={4}>
                            <Text fontSize="md" color="gray.500">
                                คะแนน: {activity.point}
                            </Text>
                            <Text fontSize="md" color="orange.500">
                                จำนวนผู้ลงทะเบียน: {activity.current_register_participants} /{" "}
                                {activity.max_participants}
                            </Text>
                        </HStack>

                        {activity.form_link && (
                            <Text mt={2} fontSize="md" color="blue.500">
                                แบบสอบถาม:{" "}
                                <a href={activity.form_link} target="_blank" rel="noreferrer">
                                    {activity.form_link}
                                </a>
                            </Text>
                        )}

                        <Divider my={4} />
                        <Text fontSize="md" color="gray.400">
                            สร้างเมื่อ: {new Date(activity.created_at).toLocaleString("th-TH")}
                        </Text>
                    </Box>

                    {/* Participants */}
                    <Box mt={4}>
                        <Box mt={4}>
                            <Tabs variant="enclosed" colorScheme="blue">
                                <TabList>
                                    <Tab>รายชื่อผู้ลงทะเบียน</Tab>
                                    <Tab>E-Stamp</Tab>
                                    <Tab>ผลแบบสอบถาม</Tab>
                                </TabList>

                                <TabPanels>
                                    {/* Participants Tab */}
                                    <TabPanel>
                                        <HStack justify="space-between" mb={2}>
                                            <Text fontSize="sm" fontWeight="bold">
                                                รายชื่อนักเรียนที่ลงทะเบียน
                                            </Text>
                                            <Button size="sm" colorScheme="green" onClick={exportExcel}>
                                                Export Excel
                                            </Button>
                                        </HStack>

                                        {activity.registrations?.length === 0 ? (
                                            <Text fontSize="sm" color="gray.500">
                                                ยังไม่มีผู้ลงทะเบียน
                                            </Text>
                                        ) : (
                                            <TableContainer>
                                                <Table variant="striped" size="sm">
                                                    <Thead>
                                                        <Tr>
                                                            <Th>ชื่อ-สกุล</Th>
                                                            <Th>Email</Th>
                                                            <Th>เบอร์โทร</Th>
                                                            <Th>เวลาลงทะเบียน</Th>
                                                        </Tr>
                                                    </Thead>
                                                    <Tbody>
                                                        {activity.registrations?.map((reg) => (
                                                            <Tr key={reg.id}>
                                                                <Td>
                                                                    {reg.student.first_name} {reg.student.last_name}
                                                                </Td>
                                                                <Td>{reg.student.email}</Td>
                                                                <Td>{reg.student.phone}</Td>
                                                                <Td>
                                                                    {new Date(reg.registered_at).toLocaleString("th-TH")}
                                                                </Td>
                                                            </Tr>
                                                        ))}
                                                    </Tbody>
                                                </Table>
                                            </TableContainer>
                                        )}
                                    </TabPanel>

                                    {/* E-Stamp Tab */}
                                    <TabPanel>
                                        <Text fontSize="sm" color="gray.500">
                                            (ยังไม่ได้ใส่ข้อมูล E-Stamp)
                                        </Text>
                                    </TabPanel>

                                    {/* Survey Result Tab */}
                                    <TabPanel>
                                        <Text fontSize="sm" color="gray.500">
                                            (ยังไม่ได้ใส่ข้อมูลผลแบบสอบถาม)
                                        </Text>
                                    </TabPanel>
                                </TabPanels>
                            </Tabs>
                        </Box>
                    </Box>

                    {/* Modal แก้ไข */}
                    <Modal isOpen={isOpen} onClose={onClose} size="lg">
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>แก้ไขกิจกรรม</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                <FormControl mb={3} display="flex" alignItems="center">
                                    <FormLabel htmlFor="display" mb="0">
                                        แสดงกิจกรรม
                                    </FormLabel>
                                    {/* use select */}
                                    <select

                                        id="display"
                                        value={form.display ? "true" : "false"}
                                        onChange={(e) =>
                                            setForm({ ...form, display: e.target.value === "true" })
                                        }
                                        style={{ width: "100px", border: "1px solid gray", fontSize: "20px", marginLeft: "10px", padding: "5px", borderRadius: "5px" }}
                                    >
                                        <option value="true">แสดง</option>
                                        <option value="false">ซ่อน</option>
                                    </select>
                                </FormControl>

                                <FormControl mb={3}>
                                    <FormLabel>ชื่อกิจกรรม</FormLabel>
                                    <Input
                                        value={form.title || ""}
                                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    />
                                </FormControl>
                                <FormControl mb={3}>
                                    <FormLabel>รายละเอียด</FormLabel>
                                    <Textarea
                                        value={form.description || ""}
                                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    />
                                </FormControl>
                                <FormControl mb={3}>
                                    <FormLabel>สถานที่</FormLabel>
                                    <Input
                                        value={form.location || ""}
                                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                                    />
                                </FormControl>
                                <FormControl mb={3}>
                                    <FormLabel>วันที่</FormLabel>
                                    <Input
                                        type="date"
                                        value={form.date || ""}
                                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                                    />
                                </FormControl>
                                <FormControl mb={3}>
                                    <FormLabel>เวลาเริ่ม</FormLabel>
                                    <Input
                                        type="time"
                                        value={form.start_time || ""}
                                        onChange={(e) => setForm({ ...form, start_time: e.target.value })}
                                    />
                                </FormControl>
                                <FormControl mb={3}>
                                    <FormLabel>เวลาสิ้นสุด</FormLabel>
                                    <Input
                                        type="time"
                                        value={form.end_time || ""}
                                        onChange={(e) => setForm({ ...form, end_time: e.target.value })}
                                    />
                                </FormControl>
                                <FormControl mb={3}>
                                    <FormLabel>คะแนน</FormLabel>
                                    <NumberInput value={form.point || 0} min={0}>
                                        <NumberInputField
                                            onChange={(e) => setForm({ ...form, point: parseInt(e.target.value) || 0 })}
                                        />
                                    </NumberInput>
                                </FormControl>
                                <FormControl mb={3}>
                                    <FormLabel>จำนวนผู้เข้าร่วมสูงสุด</FormLabel>
                                    <NumberInput value={form.max_participants || 0} min={1}>
                                        <NumberInputField
                                            onChange={(e) =>
                                                setForm({ ...form, max_participants: parseInt(e.target.value) || 0 })
                                            }
                                        />
                                    </NumberInput>
                                </FormControl>
                                <FormControl mb={3}>
                                    <FormLabel>ลิงก์ฟอร์ม</FormLabel>
                                    <Input
                                        value={form.form_link || ""}
                                        onChange={(e) => setForm({ ...form, form_link: e.target.value })}
                                    />
                                </FormControl>
                            </ModalBody>
                            <ModalFooter>
                                <Button colorScheme="blue" mr={3} onClick={handleSave}>
                                    บันทึก
                                </Button>
                                <Button onClick={onClose}>ยกเลิก</Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                </>
            )}
        </KMAppLayout>
    );
};
