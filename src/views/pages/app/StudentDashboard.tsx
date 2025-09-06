import { useEffect, useState } from "react";

const StudentDashboard = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch("/api/student/student-only")
            // fetch("/api/staff/staff-only")
            .then((res) => res.json())
            .then((d) => setData(d));
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-xl text-white font-bold">🎓 Student Dashboard</h1>
            <pre className="mt-4 bg-gray-100 p-4 rounded-lg text-gray-800">
                {JSON.stringify(data, null, 2)}
            </pre>
        </div>
    );
}

export { StudentDashboard };