"use client"

import { useState } from "react"
import {
    Box,
    Text,
    VStack,
    HStack,
    Radio,
    RadioGroup,
    Checkbox,
    CheckboxGroup,
    Select,
    Button,
    Input,
    Stack,
    Divider,
    Heading,
    Textarea,
    useToast,
} from "@chakra-ui/react"
import StudentAppLayout from "../layouts/StudentAppLayout"

const PublicSurvey = () => {
    const toast = useToast()

    // Section 1
    const [participantType, setParticipantType] = useState("")
    const [educationLevel, setEducationLevel] = useState("")
    const [interestLevel, setInterestLevel] = useState("")
    const [preferredFaculty, setPreferredFaculty] = useState("")

    // Section 2
    const [infoChannels, setInfoChannels] = useState<string[]>([])
    const [factors, setFactors] = useState<string[]>([])
    const [creditTransferInterest, setCreditTransferInterest] = useState("3")
    const [teachingMode, setTeachingMode] = useState("")
    const [confusionRanking, setConfusionRanking] = useState(["", "", ""])
    const [interestKMUTT, setInterestKMUTT] = useState("")

    const handleSubmit = () => {
        // validation เบื้องต้น
        if (!participantType) {
            toast({ title: "กรุณาเลือกประเภทผู้เข้าร่วม", status: "error" })
            return
        }

        const surveyData = {
            participantType,
            educationLevel,
            interestLevel,
            preferredFaculty,
            infoChannels,
            factors,
            creditTransferInterest,
            teachingMode,
            confusionRanking,
            interestKMUTT,
        }

        console.log("Survey submitted:", surveyData)
        toast({ title: "ส่งแบบสอบถามเรียบร้อยแล้ว", status: "success" })
    }

    return (
        <StudentAppLayout>
            <Box maxW="800px" mx="auto" p={6}>
                <Heading mb={6}>แบบสอบถาม KMUTT Open House 2025</Heading>
                <VStack spacing={6} align="stretch">
                    {/* ---------- Section 1 ---------- */}
                    <Box>
                        <Heading size="md" mb={3}>ส่วนที่ 1: ข้อมูลทั่วไปเกี่ยวกับผู้ตอบแบบสำรวจ</Heading>

                        <Box mb={4}>
                            <Text mb={1}>1. ประเภทผู้เข้าร่วมกิจกรรม</Text>
                            <RadioGroup value={participantType} onChange={setParticipantType}>
                                <Stack direction="column">
                                    {["นักเรียน", "นักศึกษา", "ผู้ปกครอง", "คุณครู/อาจารย์", "บุคคลทั่วไป"].map((t) => (
                                        <Radio key={t} value={t}>{t}</Radio>
                                    ))}
                                </Stack>
                            </RadioGroup>
                        </Box>

                        {participantType === "นักเรียน" && (
                            <>
                                <Box mb={4}>
                                    <Text mb={1}>2. ระดับการศึกษา</Text>
                                    <RadioGroup value={educationLevel} onChange={setEducationLevel}>
                                        <Stack direction="column">
                                            {[
                                                "ประถมศึกษา",
                                                "ประกาศนียบัตรวิชาชีพ (ปวช.)",
                                                "ประกาศนียบัตรวิชาชีพชั้นสูง (ปวส.)",
                                                "มัธยมศึกษาตอนต้น (ม.1-3)",
                                                "มัธยมศึกษาตอนปลาย (ม.4)",
                                                "มัธยมศึกษาตอนปลาย (ม.5)",
                                                "มัธยมศึกษาตอนปลาย (ม.6)",
                                            ].map((lvl) => (
                                                <Radio key={lvl} value={lvl}>{lvl}</Radio>
                                            ))}
                                        </Stack>
                                    </RadioGroup>
                                </Box>

                                <Box mb={4}>
                                    <Text mb={1}>3. ท่านมีความสนใจที่จะศึกษาต่อในระดับการศึกษาใด</Text>
                                    <RadioGroup value={interestLevel} onChange={setInterestLevel}>
                                        <Stack direction="column">
                                            {["ปริญญาตรี", "ปริญญาโท/ปริญญาเอก", "เรียนหลักสูตรระยะสั้น"].map((lvl) => (
                                                <Radio key={lvl} value={lvl}>{lvl}</Radio>
                                            ))}
                                        </Stack>
                                    </RadioGroup>
                                </Box>

                                <Box mb={4}>
                                    <Text mb={1}>4. ท่านมีความสนใจที่จะศึกษาต่อในคณะใด</Text>
                                    <Input
                                        placeholder="ระบุคณะที่สนใจ"
                                        value={preferredFaculty}
                                        onChange={(e) => setPreferredFaculty(e.target.value)}
                                    />
                                </Box>
                            </>
                        )}
                    </Box>

                    <Divider />

                    {/* ---------- Section 2 ---------- */}
                    <Box>
                        <Heading size="md" mb={3}>ส่วนที่ 2: ข้อมูลด้านการประชาสัมพันธ์</Heading>

                        <Box mb={4}>
                            <Text mb={1}>1. ท่านได้รับข้อมูลข่าวสารเกี่ยวกับกิจกรรม KMUTT Open House 2025 ผ่านช่องทางใด (เลือกได้มากกว่า 1 ข้อ)</Text>
                            <CheckboxGroup value={infoChannels} onChange={(v) => setInfoChannels(v as string[])}>
                                <Stack direction="column">
                                    {[
                                        "Facebook", "Instagram", "Tiktok", "Line", "Website", "CampHub", "สื่อบนรถโดยสารประจำทาง",
                                        "งาน Dek-D TCAS และอื่น ๆ", "Roadshow",
                                        "รุ่นพี่ที่โรงเรียน", "เพื่อน", "ศิษย์เก่า มจธ.", "ผู้ปกครอง เครือญาติ", "คุณครูที่โรงเรียน/ครูแนะแนว"
                                    ].map((c) => <Checkbox key={c} value={c}>{c}</Checkbox>)}
                                </Stack>
                            </CheckboxGroup>
                        </Box>

                        <Box mb={4}>
                            <Text mb={1}>2. ปัจจัยที่ส่งผลต่อการเลือกศึกษาต่อในระดับอุดมศึกษา (เลือกได้มากกว่า 1 ข้อ)</Text>
                            <CheckboxGroup value={factors} onChange={(v) => setFactors(v as string[])}>
                                <Stack direction="column">
                                    {[
                                        "ชื่อเสียงของมหาวิทยาลัย/คณะ/ภาควิชา",
                                        "ผลการจัดลำดับมหาวิทยาลัยในเวทีระดับโลก (Ranking)",
                                        "ความรู้ความสามารถของคณาจารย์ประจำมหาวิทยาลัย",
                                        "อาจารย์เข้าถึงง่าย",
                                        "มีงานทำหลังเรียนจบ",
                                        "โอกาสในการไปฝึกงาน/แลกเปลี่ยนในต่างประเทศ",
                                        "ผู้ปกครอง/ครอบครัว แนะนำ",
                                        "รุ่นพี่/มีรุ่นพี่ศึกษาอยู่ที่คณะฯ แนะนำ",
                                        "ครูที่โรงเรียน/ครูแนะแนว แนะนำ",
                                        "บรรยากาศและสภาพแวดล้อมน่าอยู่",
                                        "อุปกรณ์การเรียนการสอน ห้องแลป มีเครื่องมือครบ และทันสมัย",
                                        "กิจกรรม Open house/กิจกรรมแนะแนวการศึกษา/กิจกรรมค่ายที่จัดขึ้น โดยนักศึกษา มจธ. หรือมหาวิทยาลัย",
                                        "ทุนการศึกษา",
                                        "มีคณะ/สาขาวิชา ตรงตามความต้องการ/น่าสนใจ",
                                        "สะดวกต่อการเดินทาง/ใกล้บ้าน",
                                        "มีกิจกรรมนักศึกษาที่ตอบสนองความต้องการให้ทำระหว่างเรียน",
                                        "เป็นหลักสูตรปริญญาตรี ที่ใช้ระยะเวลาการเรียนน้อยกว่าระบบเดิม"
                                    ].map((f) => <Checkbox key={f} value={f}>{f}</Checkbox>)}
                                </Stack>
                            </CheckboxGroup>
                        </Box>

                        <Box mb={4}>
                            <Text mb={1}>3. ถ้ามีหลักสูตรที่เรียนล่วงหน้าและสามารถเทียบโอนหน่วยกิต มีความสนใจแค่ไหน</Text>
                            <Select value={creditTransferInterest} onChange={(e) => setCreditTransferInterest(e.target.value)}>
                                {["5", "4", "3", "2", "1"].map((v) => (
                                    <option key={v} value={v}>{v}</option>
                                ))}
                            </Select>
                        </Box>

                        <Box mb={4}>
                            <Text mb={1}>4. รูปแบบการจัดเรียนการสอนในรายวิชาบรรยาย นักเรียนสนใจเรียนในรูปแบบใด</Text>
                            <RadioGroup value={teachingMode} onChange={setTeachingMode}>
                                <Stack direction="row">
                                    <Radio value="Online">Online</Radio>
                                    <Radio value="Onsite">Onsite</Radio>
                                </Stack>
                            </RadioGroup>
                        </Box>

                        <Box mb={4}>
                            <Text mb={1}>5. ท่านมีความสับสนในการจำแนก 3 พระจอมหรือไม่ และจัดลำดับความสนใจ 3 พระจอม (มจธ. มจพ. สจล.)</Text>
                            <HStack spacing={3}>
                                {["อันดับ 1", "อันดับ 2", "อันดับ 3"].map((label, idx) => (
                                    <Select
                                        key={idx}
                                        value={confusionRanking[idx]}
                                        placeholder={label}
                                        onChange={(e) => {
                                            const newRank = [...confusionRanking]
                                            newRank[idx] = e.target.value
                                            setConfusionRanking(newRank)
                                        }}
                                    >
                                        {["มจธ.", "มจพ.", "สจล."].map((uni) => (
                                            <option key={uni} value={uni}>{uni}</option>
                                        ))}
                                    </Select>
                                ))}
                            </HStack>
                        </Box>

                        <Box mb={4}>
                            <Text mb={1}>6. ท่านสนใจเข้าศึกษาต่อใน มจธ. หรือไม่</Text>
                            <RadioGroup value={interestKMUTT} onChange={setInterestKMUTT}>
                                <Stack direction="row">
                                    <Radio value="สนใจ">สนใจ</Radio>
                                    <Radio value="ไม่สนใจ">ไม่สนใจ</Radio>
                                </Stack>
                            </RadioGroup>
                        </Box>

                    </Box>

                    <Button colorScheme="orange" size="lg" onClick={handleSubmit}>
                        ส่งแบบสอบถาม
                    </Button>
                </VStack>
            </Box>
        </StudentAppLayout>
    )
}

export { PublicSurvey }
