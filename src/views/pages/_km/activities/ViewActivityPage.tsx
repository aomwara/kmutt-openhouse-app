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
} from "@chakra-ui/react";
import KMAppLayout from "@/views/layouts/KMAppLayout";

interface Activity {
    id: number;
    activity_type: string;
    title: string;
    description: string;
    date: string;
    round: number;
    start_time: string;
    end_time: string;
    location: string;
    point: number;
    form_link?: string;
    image_url?: string;
    stars: number;
    max_participants: number;
    current_register_participants: number;
    created_at: string;
    department: {
        id: number;
        name_en: string;
        name_th: string;
    };
    faculty: {
        id: number;
        name_en: string;
        name_th: string;
    };
}

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

    return (
        <KMAppLayout navigation="View Activity">
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
                        {/* Title + Edit Button */}
                        <HStack justify="space-between" mb={2}>
                            <Text fontSize="md" fontWeight="bold">
                                {activity.title}
                            </Text>
                            <Box>
                                <Button size="sm" colorScheme="yellow" onClick={onOpen}>
                                    แก้ไข
                                </Button>

                                <Button ml={2} size="sm" colorScheme="red" onClick={() => { }}>
                                    ลบ
                                </Button>
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

                    {/* Modal แก้ไข */}
                    <Modal isOpen={isOpen} onClose={onClose} size="lg">
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>แก้ไขกิจกรรม</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
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
