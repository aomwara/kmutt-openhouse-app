import { useEffect, useState } from "react";
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Checkbox,
    useDisclosure,
    useToast,
    Spinner,
    HStack,
} from "@chakra-ui/react";
import KMAppLayout from "@/views/layouts/KMAppLayout";

type Staff = {
    id: number;
    username: string;
    name: string;
    email: string;
    created_at: string;
};

type Activity = {
    id: number;
    title: string;
    date: string;
    start_time: string;
};

const KMStaff = () => {
    const [staffs, setStaffs] = useState<Staff[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
    const [selectedActivities, setSelectedActivities] = useState<number[]>([]);
    const [form, setForm] = useState({
        username: "",
        password: "",
        name: "",
        email: "",
    });
    const [loadingMapping, setLoadingMapping] = useState(false);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    // โหลด staff list
    const fetchStaffs = async () => {
        const res = await fetch("/api/km/staff");
        const data = await res.json();
        setStaffs(data);
    };

    // โหลด activities ของ user เอง
    const fetchActivities = async () => {
        const res = await fetch("/api/km/activities");
        const data = await res.json();
        setActivities(data);
    };

    useEffect(() => {
        fetchStaffs();
        fetchActivities();
    }, []);

    // ฟอร์มสร้าง staff
    const handleCreateStaff = async () => {
        if (!form.username || !form.password || !form.name || !form.email) {
            toast({ status: "warning", title: "กรอกข้อมูลให้ครบก่อน" });
            return;
        }

        const res = await fetch("/api/km/staff", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        if (res.ok) {
            toast({ status: "success", title: "สร้าง Staff สำเร็จ" });
            setForm({ username: "", password: "", name: "", email: "" });
            fetchStaffs();
        } else {
            toast({ status: "error", title: "ไม่สามารถสร้าง Staff ได้" });
        }
    };

    // เปิด modal assign activities
    const handleOpenAssign = async (staff: Staff) => {
        setSelectedStaff(staff);
        setLoadingMapping(true);
        onOpen();

        try {
            const res = await fetch(`/api/km/staff/mapping?staffId=${staff.id}`);
            const data: number[] = await res.json();
            setSelectedActivities(data);
        } catch (err) {
            console.error(err);
            toast({ status: "error", title: "โหลดกิจกรรมไม่สำเร็จ" });
        } finally {
            setLoadingMapping(false);
        }
    };

    // assign activities
    const handleAssign = async () => {
        if (!selectedStaff) return;

        const res = await fetch(`/api/km/staff/mapping`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ staffId: selectedStaff.id, activityIds: selectedActivities }),
        });

        if (res.ok) {
            toast({ status: "success", title: "บันทึกกิจกรรมให้ Staff แล้ว" });
            onClose();
            setSelectedActivities([]);
        } else {
            toast({ status: "error", title: "บันทึกไม่สำเร็จ" });
        }
    };

    return (
        <KMAppLayout navigation="Staff Management">
            <Box bg="white" p={4} rounded="xl" shadow="md">
                <HStack spacing={3}>
                    <Input
                        placeholder="Username"
                        value={form.username}
                        onChange={(e) => setForm({ ...form, username: e.target.value })}
                        size="sm"
                        flex="1"
                    />
                    <Input
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        size="sm"
                        flex="1"
                    />
                    <Input
                        placeholder="Name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        size="sm"
                        flex="1"
                    />
                    <Input
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        size="sm"
                        flex="1"
                    />
                    <Button colorScheme="orange" onClick={handleCreateStaff} size="sm">
                        Create
                    </Button>
                </HStack>
            </Box>



            <Box mt={8}>
                <Table variant="simple" bg="white" shadow="sm" rounded="xl">
                    <Thead bg="orange.500">
                        <Tr>
                            <Th color="white">Name</Th>
                            <Th color="white">Username</Th>
                            <Th color="white">Email</Th>
                            <Th color="white">Created</Th>
                            <Th color="white">Actions</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {staffs.map((staff) => (
                            <Tr key={staff.id}>
                                <Td>{staff.name}</Td>
                                <Td>{staff.username}</Td>
                                <Td>{staff.email}</Td>
                                <Td>{new Date(staff.created_at).toLocaleDateString()}</Td>
                                <Td>
                                    <Button
                                        size="sm"
                                        colorScheme="teal"
                                        onClick={() => handleOpenAssign(staff)}
                                    >
                                        Assign Activities
                                    </Button>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>

            {/* Modal Assign */}
            {/* Modal Assign */}
            <Modal isOpen={isOpen} onClose={onClose} size="lg">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        Assign Activities to {selectedStaff?.name}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {activities.map((act) => {
                            const id = Number(act.id); // cast เป็น number
                            const isChecked = selectedActivities.includes(id); // now it's safe

                            return (
                                <Checkbox
                                    key={id}
                                    isChecked={isChecked}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedActivities((prev) => [...prev, id]);
                                        } else {
                                            setSelectedActivities((prev) =>
                                                prev.filter((x) => x !== id)
                                            );
                                        }
                                    }}
                                >
                                    {act.title} ({new Date(act.date).toLocaleDateString()} {act.start_time})
                                </Checkbox>
                            );
                        })}
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="orange" mr={3} onClick={handleAssign}>
                            Save
                        </Button>
                        <Button variant="ghost" onClick={onClose}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

        </KMAppLayout>
    );
};

export { KMStaff };
