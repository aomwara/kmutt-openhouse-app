"use client"

import { useEffect, useState } from "react"
import {
    Box,
    Heading,
    VStack,
    Spinner,
    Center,
    Text,
    SimpleGrid,
    useColorModeValue,
} from "@chakra-ui/react"
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts"

type Survey = {
    participantType: string
    educationLevel: string
    interestLevel: string
    preferredFaculty: string
    infoChannels: string
    confusionRanking: string
    factors: string
    creditTransferInterest: number | null
    teachingMode: string
    interestKMUTT: string
}

const COLORS = [
    "#FF8042",
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF4560",
    "#775DD0",
    "#00E396",
    "#FEB019",
]

// ✅ helper: sort มาก → น้อย
const sortDesc = (data: { name: string; value: number }[]) =>
    [...data].sort((a, b) => b.value - a.value)

const ReportPage = () => {
    const [surveys, setSurveys] = useState<Survey[]>([])
    const [loading, setLoading] = useState(true)
    const cardBg = useColorModeValue("white", "gray.800")

    useEffect(() => {
        fetch("/api/survey")
            .then((res) => res.json())
            .then((data) => {
                setSurveys(data.surveys)
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [])

    if (loading) {
        return (
            <Center minH="100vh">
                <Spinner size="xl" />
            </Center>
        )
    }

    if (!surveys.length) {
        return (
            <Center minH="100vh">
                <Text>ยังไม่มีข้อมูลแบบสอบถาม</Text>
            </Center>
        )
    }

    // ✅ รวม + นับข้อมูล
    const countBy = (key: keyof Survey) => {
        const map: Record<string, number> = {}
        surveys.forEach((s) => {
            const vals = (s[key] || "").toString().split(",")
            vals.forEach((v) => {
                const k = v.trim()
                if (!k) return
                map[k] = (map[k] || 0) + 1
            })
        })
        return Object.entries(map).map(([name, value]) => ({ name, value }))
    }

    // ✅ sort ทุกกราฟที่ควรเรียง
    const participantData = sortDesc(countBy("participantType"))
    const educationData = sortDesc(countBy("educationLevel"))
    const interestData = sortDesc(countBy("interestLevel"))
    const facultyData = sortDesc(countBy("preferredFaculty"))
    const infoChannelData = sortDesc(countBy("infoChannels"))
    const factorsData = sortDesc(countBy("factors"))
    const teachingModeData = sortDesc(countBy("teachingMode"))
    const interestKMUTTData = sortDesc(countBy("interestKMUTT"))

    // ✅ ค่าเฉลี่ยความสนใจเทียบโอน
    const avgCreditInterest =
        surveys.reduce((sum, s) => sum + (s.creditTransferInterest || 0), 0) /
        (surveys.filter((s) => s.creditTransferInterest !== null).length || 1)

    // ❌ ไม่ sort (เพราะเป็น ranking)
    const confusionStats: Record<string, number[]> = {
        "มจธ.": [0, 0, 0],
        "มจพ.": [0, 0, 0],
        "สจล.": [0, 0, 0],
    }

    surveys.forEach((s) => {
        const ranks = (s.confusionRanking || "").split(",")
        ranks.forEach((uni, idx) => {
            if (confusionStats[uni]) confusionStats[uni][idx] += 1
        })
    })

    const confusionData = Object.entries(confusionStats).map(
        ([university, counts]) => ({
            university,
            rank1: counts[0],
            rank2: counts[1],
            rank3: counts[2],
        })
    )

    return (
        <Box py={10} px={{ base: 4, md: 10 }} bg="gray.50" minH="100vh">
            <VStack spacing={10} maxW="1200px" mx="auto">
                <Heading textAlign="center" color="orange.600">
                    รายงานผลแบบสอบถาม KMUTT Open House 2025
                </Heading>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                    {/* Participant */}
                    <Box bg={cardBg} p={4} rounded="xl" shadow="md">
                        <Heading size="md" mb={4}>ประเภทผู้เข้าร่วม</Heading>
                        <PieChart width={300} height={300}>
                            <Pie data={participantData} dataKey="value" nameKey="name" outerRadius={90} label>
                                {participantData.map((_, i) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </Box>

                    {/* Education */}
                    <Box bg={cardBg} p={4} rounded="xl" shadow="md">
                        <Heading size="md" mb={4}>ระดับการศึกษา</Heading>
                        <BarChart width={400} height={300} data={educationData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#775DD0" />
                        </BarChart>
                    </Box>

                    {/* Interest */}
                    <Box bg={cardBg} p={4} rounded="xl" shadow="md">
                        <Heading size="md" mb={4}>ความสนใจเข้าศึกษาต่อ</Heading>
                        <BarChart width={400} height={300} data={interestData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#0088FE" />
                        </BarChart>
                    </Box>

                    {/* Preferred Faculty */} <Box bg={cardBg} p={4} rounded="xl" shadow="md"> <Heading size="md" mb={4}>คณะที่สนใจ (เลือกได้หลายข้อ)</Heading> <PieChart width={500} height={500}> <Pie data={facultyData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#00C49F" label> {facultyData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)} </Pie> <Tooltip /><Legend verticalAlign="bottom" /> </PieChart> </Box>
                    {/* Info Channels */} <Box bg={cardBg} p={4} rounded="xl" shadow="md"> <Heading size="md" mb={4}>ช่องทางรับข้อมูลข่าวสาร {"(เลือกได้มากกว่า 1 ข้อ)"}</Heading> <BarChart width={700} height={500} data={infoChannelData}> <CartesianGrid strokeDasharray="3 3" /> <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-20} textAnchor="end" /> <YAxis /> <Tooltip /> <Legend /> <Bar dataKey="value" fill="#FFBB28" /> </BarChart> </Box>

                    {/* Factors */}
                    <Box bg={cardBg} p={4} rounded="xl" shadow="md">
                        <Heading size="md" mb={4}>ปัจจัยในการเลือกมหาวิทยาลัย {"(เลือกได้มากกว่า 1 ข้อ)"}</Heading>
                        <BarChart width={500} height={350} data={factorsData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" angle={-20} textAnchor="end" interval={0} />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#00E396" />
                        </BarChart>
                    </Box>

                    {/* ✅ รูปแบบการเรียนที่สนใจ */}
                    <Box bg={cardBg} p={4} rounded="xl" shadow="md"> <Heading size="md" mb={4}>รูปแบบการเรียนที่สนใจ</Heading> <PieChart width={300} height={300}> <Pie data={teachingModeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#FF4560" label> {teachingModeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)} </Pie> <Tooltip /><Legend verticalAlign="bottom" /> </PieChart> </Box>

                    {/* Credit Transfer */}
                    <Box bg={cardBg} p={6} rounded="xl" shadow="md" textAlign="center">
                        <Heading size="md">ระดับความสนใจเรื่องการเรียนล่วงหน้าและการเทียบโอนหน่วยกิต (เฉลี่ย)</Heading>
                        <Text fontSize="4xl" fontWeight="bold" color="orange.500">
                            {avgCreditInterest.toFixed(2)} / 5
                        </Text>
                    </Box>

                    {/* Confusion Ranking */}
                    <Box bg={cardBg} p={4} rounded="xl" shadow="md">
                        <Heading size="md" mb={4}>ลำดับความสนใจ 3 พระจอม</Heading>
                        <BarChart width={450} height={300} data={confusionData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="university" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="rank1" stackId="a" fill="#FF8042" />
                            <Bar dataKey="rank2" stackId="a" fill="#00C49F" />
                            <Bar dataKey="rank3" stackId="a" fill="#0088FE" />
                        </BarChart>
                    </Box>

                    {/* ✅ ความสนใจเข้าศึกษาต่อที่ มจธ. */} <Box bg={cardBg} p={4} rounded="xl" shadow="md"> <Heading size="md" mb={4}>ความสนใจเข้าศึกษาต่อที่ มจธ.</Heading> <BarChart width={350} height={300} data={interestKMUTTData}> <CartesianGrid strokeDasharray="3 3" /> <XAxis dataKey="name" /> <YAxis /> <Tooltip /> <Legend /> <Bar dataKey="value" fill="#775DD0" /> </BarChart> </Box>
                </SimpleGrid>
            </VStack>
        </Box>
    )
}

export default ReportPage
