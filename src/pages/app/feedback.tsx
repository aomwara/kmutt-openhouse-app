"use client"

import { useState } from "react"
import {
    Box,
    Button,
    VStack,
    Heading,
    Text,
    RadioGroup,
    Radio,
    Stack,
    Textarea,
    Select,
    useToast,
    FormControl,
    FormLabel,
    Divider,
} from "@chakra-ui/react"
import StudentAppLayout from "@/views/layouts/StudentAppLayout"

interface FeedbackForm {
    device: string
    overallRating: string
    easeOfUse: string
    loadingSpeed: string
    favoriteFeature: string
    issues: string
    contentQuality: string
    helpfulness: string
    bestSection: string
    featureSuggestion: string
    topImprovement: string
    otherComments: string
}

const FeedbackPage = () => {
    const toast = useToast()
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState<FeedbackForm>({
        device: "",
        overallRating: "",
        easeOfUse: "",
        loadingSpeed: "",
        favoriteFeature: "",
        issues: "",
        contentQuality: "",
        helpfulness: "",
        bestSection: "",
        featureSuggestion: "",
        topImprovement: "",
        otherComments: "",
    })

    const handleChange = (key: keyof FeedbackForm, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }))
    }

    const handleSubmit = async () => {
        setLoading(true)
        try {
            // ส่งข้อมูลไป API ของคุณ
            const res = await fetch("/api/student/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            })

            if (!res.ok) throw new Error("Failed to submit feedback")

            toast({
                title: "ส่งแบบประเมินสำเร็จ",
                description: "ขอบคุณสำหรับความคิดเห็นของคุณ ❤️",
                status: "success",
                duration: 4000,
                isClosable: true,
            })
            setForm({
                device: "",
                overallRating: "",
                easeOfUse: "",
                loadingSpeed: "",
                favoriteFeature: "",
                issues: "",
                contentQuality: "",
                helpfulness: "",
                bestSection: "",
                featureSuggestion: "",
                topImprovement: "",
                otherComments: "",
            })
        } catch (error) {
            toast({
                title: "เกิดข้อผิดพลาด",
                description: "ไม่สามารถส่งแบบประเมินได้ โปรดลองอีกครั้ง",
                status: "error",
                duration: 4000,
                isClosable: true,
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <StudentAppLayout navigation="การใช้งานเว็บไซต์">
            <Box p={{ base: 0, md: 6 }} mx="auto">
                <Heading size="lg" mb={2} lineHeight={"42px"}>
                    แบบประเมินการใช้งานเว็บไซต์ Openhouse 2025
                </Heading>
                <Text color="gray.600" fontSize={"md"} mb={6}>
                    แบบฟอร์มนี้จัดทำขึ้นเพื่อเก็บข้อมูลเพื่อนำไปปรับปรุงเว็บไซต์ให้ดีขึ้นในปีถัดไป 🙌
                </Text>

                <VStack align="stretch" spacing={6}>
                    {/* หมวดที่ 1 */}
                    <Box>
                        <Heading size="md" mb={3}>
                            🧭 ข้อมูลทั่วไป
                        </Heading>

                        <FormControl>
                            <FormLabel>อุปกรณ์ที่ใช้เข้าเว็บไซต์</FormLabel>
                            <Select
                                placeholder="เลือกอุปกรณ์"
                                value={form.device}
                                onChange={(e) => handleChange("device", e.target.value)}
                            >
                                <option>โทรศัพท์มือถือ</option>
                                <option>แท็บเล็ต</option>
                                <option>คอมพิวเตอร์</option>
                                <option>อื่น ๆ</option>
                            </Select>
                        </FormControl>
                    </Box>

                    <Divider />

                    {/* หมวดที่ 2 */}
                    <Box>
                        <Heading size="md" mb={3}>
                            💡 ความประทับใจโดยรวม
                        </Heading>

                        <FormControl mb={3}>
                            <FormLabel>ภาพรวมของเว็บไซต์ Openhouse 2025</FormLabel>
                            <RadioGroup
                                onChange={(val) => handleChange("overallRating", val)}
                                value={form.overallRating}
                            >
                                <Stack direction="row">
                                    {[1, 2, 3, 4, 5].map((num) => (
                                        <Radio key={num} value={num.toString()}>
                                            {num}
                                        </Radio>
                                    ))}
                                </Stack>
                            </RadioGroup>
                        </FormControl>

                        <FormControl mb={3}>
                            <FormLabel>เว็บไซต์ใช้งานง่ายหรือไม่</FormLabel>
                            <RadioGroup
                                onChange={(val) => handleChange("easeOfUse", val)}
                                value={form.easeOfUse}
                            >
                                <Stack direction="row">
                                    <Radio value="ง่ายมาก">ง่ายมาก</Radio>
                                    <Radio value="ง่าย">ง่าย</Radio>
                                    <Radio value="ปานกลาง">ปานกลาง</Radio>
                                    <Radio value="ยาก">ยาก</Radio>
                                    <Radio value="ยากมาก">ยากมาก</Radio>
                                </Stack>
                            </RadioGroup>
                        </FormControl>

                        <FormControl>
                            <FormLabel>ความเร็วในการโหลดหน้าเว็บ</FormLabel>
                            <RadioGroup
                                onChange={(val) => handleChange("loadingSpeed", val)}
                                value={form.loadingSpeed}
                            >
                                <Stack direction="row">
                                    <Radio value="เร็วมาก">เร็วมาก</Radio>
                                    <Radio value="เร็ว">เร็ว</Radio>
                                    <Radio value="พอใช้">พอใช้</Radio>
                                    <Radio value="ช้า">ช้า</Radio>
                                    <Radio value="ช้ามาก">ช้ามาก</Radio>
                                </Stack>
                            </RadioGroup>
                        </FormControl>
                    </Box>

                    <Divider />

                    {/* หมวดที่ 3 */}
                    <Box>
                        <Heading size="md" mb={3}>
                            ⚙️ การใช้งานและฟังก์ชัน
                        </Heading>

                        <FormControl mb={3}>
                            <FormLabel>ฟีเจอร์ที่คุณชอบที่สุด</FormLabel>
                            <Select
                                placeholder="เลือกฟีเจอร์"
                                value={form.favoriteFeature}
                                onChange={(e) => handleChange("favoriteFeature", e.target.value)}
                            >
                                <option>ระบบสะสม E-Stamp</option>
                                <option>ตารางกิจกรรม</option>
                                <option>ระบบลงทะเบียน</option>
                                <option>ระบบถ่ายรูป</option>
                                <option>ชอบทั้งหมด</option>
                            </Select>
                        </FormControl>

                        <FormControl>
                            <FormLabel>คุณพบปัญหาขณะใช้งานหรือไม่</FormLabel>
                            <Textarea
                                placeholder="ระบุปัญหาที่พบ (ถ้ามี)"
                                value={form.issues}
                                onChange={(e) => handleChange("issues", e.target.value)}
                            />
                        </FormControl>
                    </Box>

                    <Divider />

                    {/* หมวดที่ 4 */}
                    <Box>
                        <Heading size="md" mb={3}>
                            📚 เนื้อหาและประโยชน์ที่ได้รับ
                        </Heading>

                        <FormControl mb={3}>
                            <FormLabel>ข้อมูลในเว็บไซต์มีความครบถ้วน เข้าใจง่ายหรือไม่</FormLabel>
                            <RadioGroup
                                onChange={(val) => handleChange("contentQuality", val)}
                                value={form.contentQuality}
                            >
                                <Stack direction="row">
                                    <Radio value="ครบถ้วนมาก">ครบถ้วนมาก</Radio>
                                    <Radio value="พอใช้">พอใช้</Radio>
                                    <Radio value="ควรปรับปรุง">ควรปรับปรุง</Radio>
                                </Stack>
                            </RadioGroup>
                        </FormControl>

                        <FormControl mb={3}>
                            <FormLabel>เว็บไซต์ช่วยให้คุณตัดสินใจมาร่วมงานหรือไม่</FormLabel>
                            <RadioGroup
                                onChange={(val) => handleChange("helpfulness", val)}
                                value={form.helpfulness}
                            >
                                <Stack direction="row">
                                    <Radio value="ช่วยมาก">ช่วยมาก</Radio>
                                    <Radio value="พอช่วยได้">พอช่วยได้</Radio>
                                    <Radio value="ไม่แน่ใจ">ไม่แน่ใจ</Radio>
                                    <Radio value="ไม่ช่วย">ไม่ช่วย</Radio>
                                </Stack>
                            </RadioGroup>
                        </FormControl>

                        <FormControl>
                            <FormLabel>ส่วนที่ให้ข้อมูลดีที่สุด</FormLabel>
                            <Select
                                placeholder="เลือกส่วน"
                                value={form.bestSection}
                                onChange={(e) => handleChange("bestSection", e.target.value)}
                            >
                                <option>รายละเอียดกิจกรรม</option>
                                <option>หน้าคณะ/ภาควิชา</option>
                                <option>ข่าวสาร / Schedule</option>
                                <option>ระบบ E-Stamp</option>
                            </Select>
                        </FormControl>
                    </Box>

                    <Divider />

                    {/* หมวดที่ 5 */}
                    <Box>
                        <Heading size="md" mb={3}>
                            💬 ความคิดเห็นเพิ่มเติม
                        </Heading>

                        <FormControl mb={3}>
                            <FormLabel>อยากให้เว็บไซต์เพิ่มฟีเจอร์อะไร</FormLabel>
                            <Textarea
                                placeholder="ระบุฟีเจอร์ที่อยากให้เพิ่ม"
                                value={form.featureSuggestion}
                                onChange={(e) =>
                                    handleChange("featureSuggestion", e.target.value)
                                }
                            />
                        </FormControl>

                        <FormControl mb={3}>
                            <FormLabel>สิ่งที่อยากให้ปรับปรุงมากที่สุด</FormLabel>
                            <Textarea
                                placeholder="ระบุสิ่งที่อยากให้ปรับปรุง"
                                value={form.topImprovement}
                                onChange={(e) =>
                                    handleChange("topImprovement", e.target.value)
                                }
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel>ข้อเสนอแนะอื่น ๆ</FormLabel>
                            <Textarea
                                placeholder="พิมพ์ความคิดเห็นเพิ่มเติมได้ที่นี่"
                                value={form.otherComments}
                                onChange={(e) => handleChange("otherComments", e.target.value)}
                            />
                        </FormControl>
                    </Box>

                    <Divider />

                    <Button
                        colorScheme="blue"
                        size="lg"
                        onClick={handleSubmit}
                        isLoading={loading}
                    >
                        ส่งแบบประเมิน
                    </Button>
                </VStack>
            </Box>
        </StudentAppLayout>
    )
}

export default FeedbackPage
