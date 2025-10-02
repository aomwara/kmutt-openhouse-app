"use client";

import { useEffect, useState } from "react";
import {
    Box,
    Heading,
    Select,
    VStack,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Text,
    Spinner,
    Card,
    CardHeader,
    CardBody,
    Divider,
    Badge,
} from "@chakra-ui/react";

// ----------------- Types -----------------
type StudentCensored = {
    id: number;
    name: string;
    email: string;
    phone: string;
};

type ActivityReport = {
    id: number;
    title: string;
    date: string;
    start_time: string;
    end_time: string;
    location: string;
    activity_type: string;
    max_participants: number;
    point: number;
    participants: StudentCensored[];
};

type Department = {
    id: number;
    name_th: string;
    name_en: string;
};

// ----------------- Component -----------------
const ReportPage = () => {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [activities, setActivities] = useState<ActivityReport[]>([]);
    const [departmentId, setDepartmentId] = useState("");
    const [date, setDate] = useState("");
    const [loading, setLoading] = useState(false);

    const dates = ["10/10/2025", "11/10/2025", "12/10/2025"];

    // โหลด department
    useEffect(() => {
        const fetchDepartments = async () => {
            const res = await fetch("/api/departments");
            const data: Department[] = await res.json();
            setDepartments(data);
        };
        fetchDepartments();
    }, []);

    // โหลด activities
    useEffect(() => {
        if (!departmentId || !date) return;
        const fetchReport = async () => {
            setLoading(true);
            try {
                const res = await fetch(
                    `/api/report?departmentId=${departmentId}&date=${date}`
                );
                const data: ActivityReport[] = await res.json();
                setActivities(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchReport();
    }, [departmentId, date]);

    return (
        <Box p={8} maxW="1000px" mx="auto">
            <Heading mb={6} textAlign="center" color="teal.600">
                📊 รายงานการเข้าร่วมกิจกรรม
            </Heading>

            {/* ฟิลเตอร์ */}
            <Card mb={8} shadow="md" borderWidth="1px">
                <CardBody>
                    <VStack align="start" spacing={4}>
                        <Box w="100%">
                            <Text fontWeight="bold" mb={1}>
                                เลือกภาควิชา
                            </Text>
                            <Select
                                placeholder="เลือกภาควิชา"
                                value={departmentId}
                                onChange={(e) => setDepartmentId(e.target.value)}
                            >
                                {departments.map((dept) => (
                                    <option key={dept.id} value={dept.id}>
                                        {dept.name_th} ({dept.name_en})
                                    </option>
                                ))}
                            </Select>
                        </Box>

                        <Box w="100%">
                            <Text fontWeight="bold" mb={1}>
                                เลือกวัน
                            </Text>
                            <Select
                                placeholder="เลือกวัน"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            >
                                {dates.map((d) => (
                                    <option key={d} value={d}>
                                        {d}
                                    </option>
                                ))}
                            </Select>
                        </Box>
                    </VStack>
                </CardBody>
            </Card>

            {/* รายงาน */}
            {loading && (
                <Box textAlign="center" py={8}>
                    <Spinner size="xl" color="teal.500" />
                    <Text mt={4}>กำลังโหลด...</Text>
                </Box>
            )}

            {!loading && activities.length === 0 && (
                <Text textAlign="center" color="gray.500">
                    ไม่มีข้อมูลกิจกรรม
                </Text>
            )}

            {!loading &&
                activities.map((act) => (
                    <Card key={act.id} mb={6} shadow="lg" borderWidth="1px">
                        <CardHeader>
                            <Heading size="md" color="teal.700">
                                {act.title}
                            </Heading>
                            <Text fontSize="sm" color="gray.600">
                                วันที่ {new Date(act.date).toLocaleDateString("th-TH")} เวลา{" "}
                                {act.start_time} - {act.end_time}
                            </Text>
                            <Badge mt={2} colorScheme="purple">
                                {act.location}
                            </Badge>
                            <br />
                            <Text fontSize={"md"}>
                                จำนวนผู้ลงทะเบียน: {act.participants.length} / {act.max_participants} | คะแนน: {act.point}
                            </Text>
                        </CardHeader>
                        <Divider />
                        <CardBody>
                            {act.activity_type !== "non_regis_activity" ? (<>

                                <Table variant="striped" size="sm" colorScheme="teal">
                                    <Thead>
                                        <Tr>
                                            <Th>ชื่อ</Th>
                                            <Th>Email</Th>
                                            <Th>เบอร์</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {act.participants.map((p) => (
                                            <Tr key={p.id}>
                                                <Td>{p.name}</Td>
                                                <Td>{p.email}</Td>
                                                <Td>{p.phone}</Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                                {act.participants.length === 0 && (
                                    <Text mt={4} color="gray.500">
                                        ไม่มีผู้เข้าร่วม
                                    </Text>
                                )}
                            </>) : "กิจกรรมนี้ไม่ต้องลงทะเบียนเข้าร่วม"}

                        </CardBody>
                    </Card>
                ))}
        </Box>
    );
};

export default ReportPage;
