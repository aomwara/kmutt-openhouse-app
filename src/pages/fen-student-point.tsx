"use client";

import { useEffect, useState } from "react";

type BaseStudentData = {
  student_id: number;
  student_name: string;
  school: string | null;
  province: string | null;
  email: string;
  phone: string;
  total_points: number;
};

type StudentData = BaseStudentData & {
  [K in `activity_${number}`]?: string;
};

export default function StudentsPointsPage() {
  const [data, setData] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/student-point")
      .then((res) => res.json())
      .then((json: StudentData[]) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!data.length) return <p>No data found</p>;

  // หาชื่อ activity columns แบบ dynamic
  const activityColumns = Object.keys(data[0]).filter((key) =>
    key.startsWith("activity_")
  ) as Array<keyof StudentData>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Students Points & Activities (Engineering Faculty)</h2>

      {/* container scrollable horizontal */}
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            borderCollapse: "collapse",
            width: "100%",
            minWidth: 800, // ให้ scroll ทำงานเมื่อ column เยอะ
            backgroundColor: "white",
          }}
        >
          <thead>
            <tr>
              <th style={{ border: "1px solid #000", padding: 8 }}>Student Name</th>
              <th style={{ border: "1px solid #000", padding: 8 }}>School</th>
              <th style={{ border: "1px solid #000", padding: 8 }}>Province</th>
              <th style={{ border: "1px solid #000", padding: 8 }}>Email</th>
              <th style={{ border: "1px solid #000", padding: 8 }}>Phone</th>
              <th style={{ border: "1px solid #000", padding: 8 }}>Total Points</th>
              {activityColumns.map((col) => (
                <th key={col} style={{ border: "1px solid #000", padding: 8 }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((student) => (
              <tr key={student.student_id}>
                <td style={{ border: "1px solid #000", padding: 8 }}>{student.student_name}</td>
                <td style={{ border: "1px solid #000", padding: 8 }}>{student.school}</td>
                <td style={{ border: "1px solid #000", padding: 8 }}>{student.province}</td>
                <td style={{ border: "1px solid #000", padding: 8 }}>{student.email}</td>
                <td style={{ border: "1px solid #000", padding: 8 }}>{student.phone}</td>
                <td style={{ border: "1px solid #000", padding: 8 }}>{student.total_points}</td>
                {activityColumns.map((col) => (
                  <td key={col} style={{ border: "1px solid #000", padding: 8 }}>
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
