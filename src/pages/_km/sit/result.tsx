"use client";

import { useEffect, useState } from "react";

type BaseStudentData = {
    student_id: number;
    student_name: string;
    school: string | null;
    province: string | null;
    email: string | null;
    phone: string | null;
    total_points: number;
};

type StudentData = BaseStudentData & {
    [K in `activity_${number}`]?: string | null;
};

export default function StudentsPointsPage() {
    const [data, setData] = useState<StudentData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/sit-point")
            .then((res) => res.json())
            .then((json: StudentData[]) => {
                setData(json);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching /api/sit-point:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading...</p>;
    if (!data.length) return <p>No data found</p>;

    // ดึงชื่อ activity columns (dynamic) จากข้อมูลชุดแรก
    const activityColumns = Object.keys(data[0])
        .filter((key) => key.startsWith("activity_"))
        .sort((a, b) => {
            const numA = parseInt(a.split("_")[1] ?? "0", 10);
            const numB = parseInt(b.split("_")[1] ?? "0", 10);
            return numA - numB;
        }) as Array<keyof StudentData>;

    return (
        <div style={{ padding: 20 }}>
            <h2 style={{ marginBottom: 10 }}>Students Points & Activities (SIT)</h2>

            {/* ตารางเลื่อนแนวนอนได้ */}
            <div style={{ overflowX: "auto", maxWidth: "100%" }}>
                <table
                    style={{
                        borderCollapse: "collapse",
                        width: "100%",
                        minWidth: 1000,
                        backgroundColor: "white",
                        fontFamily: "sans-serif",
                    }}
                >
                    <thead style={{ background: "#f0f0f0" }}>
                        <tr>
                            <th style={thStyle}>#</th>
                            <th style={thStyle}>Student Name</th>
                            <th style={thStyle}>School</th>
                            <th style={thStyle}>Province</th>
                            <th style={thStyle}>Email</th>
                            <th style={thStyle}>Phone</th>
                            <th style={thStyle}>Total Points</th>
                            {activityColumns.map((col) => (
                                <th key={col} style={thStyle}>
                                    {col.replace("activity_", "Activity ")}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((student, index) => (
                            <tr key={student.student_id}>
                                <td style={tdStyle}>{index + 1}</td>
                                <td style={tdStyle}>{student.student_name}</td>
                                <td style={tdStyle}>{student.school ?? "-"}</td>
                                <td style={tdStyle}>{student.province ?? "-"}</td>
                                <td style={tdStyle}>{student.email ?? "-"}</td>
                                <td style={tdStyle}>{student.phone ?? "-"}</td>
                                <td style={{ ...tdStyle, fontWeight: "bold" }}>{student.total_points}</td>
                                {activityColumns.map((col) => (
                                    <td key={col} style={{ ...tdStyle, whiteSpace: "nowrap" }}>
                                        {student[col] ?? "-"}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const thStyle: React.CSSProperties = {
    border: "1px solid #ccc",
    padding: "8px",
    textAlign: "left",
    fontWeight: 600,
    whiteSpace: "nowrap",
};

const tdStyle: React.CSSProperties = {
    border: "1px solid #ddd",
    padding: "6px 8px",
};
